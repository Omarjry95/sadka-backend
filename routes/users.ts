import express, {Locals, NextFunction, Request, Response, Router} from "express";
import {ICreateUserRequestBody} from "../models/routes/ICreateUserRequestBody";
import {TypeOf} from "io-ts";
import {IDataValidationObject} from "../models/app/IDataValidationObject";
import {ValidationTypesEnum} from "../models/app/ValidationTypesEnum";
import {auth} from "firebase-admin";
import {IUserSchema} from "../models/schema/IUserSchema";
import {HydratedDocument} from "mongoose";
import {IUserRoleServiceResponse} from "../models/routes/IUserRoleServiceResponse";
import {IUserDetailsRequestBody} from "../models/routes/IUserDetailsRequestBody";

var router: Router = express.Router();
var AppLogger = require("../logger");
var Constants = require("../constants");
var send = require('../handlers/send-response');
var User = require("../schema/User");
var UserService = require("../services/userService");
var RoleService = require("../services/roleService");
var performRequestBodyValidation = require("../handlers/request-body-validation");
var performRequestBodyDataValidation = require("../handlers/request-body-data-validation");

router.post('/details', async (req: Request<any, any, TypeOf<typeof IUserDetailsRequestBody>>, res: Response, next: NextFunction) => {

  const { body } = req;
  const { id } = body;

  try {
    performRequestBodyValidation(req, IUserDetailsRequestBody);

    const user: IUserSchema = await UserService.getUserById(id);

    const roleIndex: number = await RoleService.getUserRoleIndex(user.role.toString());

    const { firstName, lastName, charityName } = user;

    const responseBodyInit: Object = roleIndex !== 1 ? { firstName, lastName } : { charityName };

    const response: Locals = {
      message: AppLogger.messages.dataFetchedSuccess(User.modelName)[0],
      body: {
        ...responseBodyInit,
        role: roleIndex
      }
    }

    send(response, res, next);
  }
  catch (e: any) { next(e); }
});

router.post('/', async (req: Request<any, any, TypeOf<typeof ICreateUserRequestBody>>, res: Response, next: NextFunction) => {

  const { body, originalUrl } = req;
  const { email, password, lastName, firstName, charityName, role } = body;

  const userRoleData: IUserRoleServiceResponse = await RoleService.isUserCitizen(role);

  const { isCitizen, userRoleId } = userRoleData;

  const roleBasedDataToValidate: IDataValidationObject[] = isCitizen ? [
    { value: lastName, validations: [ValidationTypesEnum.NOT_BLANK] },
    { value: firstName, validations: [ValidationTypesEnum.NOT_BLANK] }
  ] : [
    { value: charityName, validations: [ValidationTypesEnum.NOT_BLANK] }
  ];

  const dataToValidate: IDataValidationObject[] = [
    ...roleBasedDataToValidate,
    { value: email, validations: [ValidationTypesEnum.NOT_BLANK, ValidationTypesEnum.REGEX], options: { regex: new RegExp(Constants.emailRegex) } },
    { value: password, validations: [ValidationTypesEnum.NOT_BLANK, ValidationTypesEnum.MIN_LENGTH], options: { minLength: 6 } },
    { value: role, validations: [ValidationTypesEnum.NOT_BLANK] }
  ];

  try {
    performRequestBodyValidation(req, ICreateUserRequestBody);
    performRequestBodyDataValidation(dataToValidate, originalUrl);

    try {
      await UserService.throwIfFirebaseUserExists(email, next);

      return;
    }
    catch (e: any) {
      const firebaseUserData: auth.CreateRequest = {
        email,
        password,
        displayName: UserService.getDisplayName(isCitizen, firstName, lastName, charityName)
      }

      const userUID: string = await UserService.createFirebaseUser(firebaseUserData);

      const user: HydratedDocument<IUserSchema> = new User({
        _id: userUID,
        firstName,
        lastName,
        charityName,
        role: userRoleId
      });

      await UserService.createUser(user);

      send({ message: AppLogger.messages.documentCreatedSuccess(User.modelName)[0] }, res, next);
    }
  }
  catch (e: any) { next(e); }
});

module.exports = router;
