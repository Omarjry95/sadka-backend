import express, { NextFunction, Request, Response, Router } from "express";
import {ICreateUserRequestBody} from "../models/routes/ICreateUserRequestBody";
import {TypeOf} from "io-ts";
import {IDataValidationObject} from "../models/app/IDataValidationObject";
import {ValidationTypesEnum} from "../models/app/ValidationTypesEnum";
import {auth} from "firebase-admin";
import {IRoleSchema} from "../models/schema/IRoleSchema";
import {IUserSchema} from "../models/schema/IUserSchema";
import {HydratedDocument} from "mongoose";

var router: Router = express.Router();
var AppLogger = require("../logger");
var Constants = require("../constants");
var send = require('../handlers/send-response');
var User = require("../schema/User");
var UserService = require("../services/userService");
var RoleService = require("../services/roleService");
var isRequestBodyInvalid = require("../handlers/request-body-validation");
var isRequestBodyDataInvalid = require("../handlers/request-body-data-validation");

router.post('/', async (req: Request<any, any, TypeOf<typeof ICreateUserRequestBody>>, res: Response, next: NextFunction) => {

  const { body, originalUrl } = req;
  const { email, password, lastName, firstName, role } = body;

  const valuesToValidate: IDataValidationObject[] = [
    { value: email, validations: [ValidationTypesEnum.NOT_BLANK, ValidationTypesEnum.REGEX], options: { regex: new RegExp(Constants.emailRegex) } },
    { value: password, validations: [ValidationTypesEnum.NOT_BLANK, ValidationTypesEnum.MIN_LENGTH], options: { minLength: 6 } },
    { value: lastName, validations: [ValidationTypesEnum.NOT_BLANK] },
    { value: firstName, validations: [ValidationTypesEnum.NOT_BLANK] },
    { value: role, validations: [ValidationTypesEnum.NOT_BLANK] }
  ];

  if (isRequestBodyInvalid(req, ICreateUserRequestBody, next) ||
      isRequestBodyDataInvalid(valuesToValidate, originalUrl, next))
  { return; }

  try {
    await UserService.throwIfFirebaseUserExists(email, next);

    return;
  }
  catch (e: any) {

    const userRole: IRoleSchema | null = await RoleService.getRoleById(role, next);

    if (!userRole) { return; }

    const firebaseUserData: auth.CreateRequest = {
      email,
      password,
      displayName: firstName.concat(' ').concat(lastName)
    }

    const userUID: string = await UserService.createFirebaseUser(firebaseUserData, next);

    if (!userUID.length) { return; }

    const user: HydratedDocument<IUserSchema> = new User({
      _id: userUID,
      firstName,
      lastName,
      role: userRole._id
    });

    if (!(await UserService.createUser(user, next))) { return; }

    send({ message: AppLogger.messages.documentCreatedSuccess(User.modelName)[0] }, res, next);
  }
});

module.exports = router;
