import express, {NextFunction, Request, Response, Router} from "express";
import {TypeOf} from "io-ts";
import {auth} from "firebase-admin";
import {HydratedDocument} from "mongoose";
import authenticateFirebaseUser from "../middlewares/firebase-auth";
import {IUserSchema} from "../models/schema";
import {RoleService, UserService, MailService} from "../services";
import send from "../handlers/success";
import * as messages from "../logger/messages";
import {UserRolesEnum} from "../models/app";
import {ICreateUserRequestBody, IUsersByTypeServiceResponse} from "../models/routes";
import oauth2Manager from "../middlewares/oauth2";
import { OAUTH2_SCOPES } from "../constants/app";
import templates from "../emails";

var router: Router = express.Router();

const { verifyJwt, verifyRequiredScopes } = oauth2Manager;

var AppLogger = require("../logger");
var User = require("../schema/User");
var performRequestBodyValidation = require("../handlers/request-body-validation");
var performRequestBodyDataValidation = require("../handlers/request-body-data-validation");
var { multerSingle } = require("../middlewares/multer");

router.get('/details', authenticateFirebaseUser, async (req: Request, res: Response, next: NextFunction) => {

  const { userId = '', originalUrl } = req;

  try {
    const user: IUserSchema = await UserService.getUserById(userId);

    const { firstName, lastName, charityName, photo, rounding: defaultRounding,
      defaultAssociation, role } = user;

    const roleIndex: UserRolesEnum = await RoleService.getUserRoleIndex(role.toString());

    const payloadBodyInit = roleIndex !== UserRolesEnum.isAssociation ? { firstName, lastName } : { charityName };

    const payload = {
      message: messages.fetchSuccess(User.modelName).observable,
      body: {
        ...payloadBodyInit,
        id: userId,
        role: roleIndex,
        defaultAssociation,
        defaultRounding,
        photo
      }
    }

    send(res, payload, originalUrl);
  }
  catch (e: any) {
    next(e);
  }
});

router.get('/associations', authenticateFirebaseUser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users: IUsersByTypeServiceResponse[] = await UserService.getUsersByRole(UserRolesEnum.isAssociation);

    const response = {
      message: messages.fetchSuccess(User.modelName).observable,
      body: users.map(({ id: _id, charityName: label, photo }: IUsersByTypeServiceResponse) => ({
        _id,
        label,
        photo
      }))
    }

    send(res, response, req.originalUrl);
  }
  catch (e: any) {
    next(e);
  }
});

router.post('/', verifyJwt(), verifyRequiredScopes([OAUTH2_SCOPES.unrestricted]),
  async (req: Request<any, any, ICreateUserRequestBody>, res: Response, next: NextFunction) => {

    const { body, originalUrl } = req;
    const { email, password, lastName, firstName, charityName, role } = body;

    const isUserCitizen: boolean = await RoleService.isUserCitizen(role);

    try {
      try {
        await UserService.throwIfFirebaseUserExists(email, next);

        return;
      }
      catch (e: any) {
        const firebaseUserData: auth.CreateRequest = {
          email,
          password,
          displayName: UserService.getDisplayName(isUserCitizen, firstName, lastName, charityName)
        }

        const userUID: string = await UserService.createFirebaseUser(firebaseUserData);

        const user: HydratedDocument<IUserSchema> = new User({
          _id: userUID,
          firstName,
          lastName,
          charityName,
          role
        });

        await UserService.createUser(user);

        const link: string = await UserService.generateEmailVerificationLink(email);

        await MailService.send([email], templates.ACCOUNT_VERIFICATION_TEMPLATE, { link });

        send(res, { message: messages.documentCreated(User.modelName).observable }, originalUrl);
      }
    }
    catch (e: any) {
      next(e);
    }
});

router.put('/', multerSingle('photo'), authenticateFirebaseUser, async (req: Request<any, any, TypeOf<typeof IUpdateUserRequestBody>>, res: Response,
                                                                        next: NextFunction) => {

  const { body, file, originalUrl, userId = '' } = req;
  const { lastName, firstName, charityName, defaultRounding, defaultAssociation,
    isPhotoChanged, role } = body;

  const isUserCitizen: boolean = role === "0";

  const dataToValidate: IDataValidationObject[] = isUserCitizen ? [
    { value: lastName, validations: [ValidationTypesEnum.NOT_BLANK] },
    { value: firstName, validations: [ValidationTypesEnum.NOT_BLANK] }
  ] : [
    { value: charityName, validations: [ValidationTypesEnum.NOT_BLANK] }
  ];

  try {
    performRequestBodyValidation(req, IUpdateUserRequestBody);
    performRequestBodyDataValidation(dataToValidate, originalUrl);

    await UserService.updateUser(userId, lastName, firstName, charityName, defaultRounding, defaultAssociation, file, isPhotoChanged);

    send({
      status: 200,
      message: AppLogger.messages.documentUpdatedSuccess(User.modelName)[0]
    }, res, next);
  }
  catch (e: any) { next(e); }
});

router.get('/send-email-verification-link', authenticateFirebaseUser, async (req: Request, res: Response, next: NextFunction) => {

  const { userEmail = '' } = req;

  try {
    const link: string = await UserService.generateEmailVerificationLink(userEmail);

    const receivers: string[] = [userEmail];

    await MailService(receivers, 'account-verification', { link });

    send({
      status: 200,
      message: AppLogger.messages.mailSendingSuccess(receivers)[0]
    }, res, next);
  }
  catch (e: any) { next(e); }
});

export default router;