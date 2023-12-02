import express, {NextFunction, Request, Response, Router} from "express";
import {auth} from "firebase-admin";
import {HydratedDocument} from "mongoose";
import authenticateFirebaseUser from "../middlewares/firebase-auth";
import {IUserSchema} from "../models/schema";
import {RoleService, UserService, MailService} from "../services";
import send from "../handlers/success";
import * as messages from "../logger/messages";
import {UserRolesEnum} from "../models/app";
import {ICreateUserRequestBody, IUsersByTypeServiceResponse, IUpdateUserRequestBody} from "../models/routes";
import oauth2Manager from "../middlewares/oauth2";
import { OAUTH2_SCOPES } from "../constants/app";
import templates from "../emails";
import multerManager from "../middlewares/multer";
import { User } from "../schema";

const { verifyJwt, verifyRequiredScopes } = oauth2Manager;

var router: Router = express.Router();

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

router.put('/', multerManager.single('photo'), authenticateFirebaseUser,
  async (req: Request<any, any, IUpdateUserRequestBody>, res: Response, next: NextFunction) => {

  const { body, file, originalUrl, userId = '' } = req;

  try {
    await UserService.updateUser({
      id: userId,
      ...body,
      file
    });

    send(res, { message: messages.documentUpdated(User.modelName).observable }, originalUrl);
  }
  catch (e: any) {
    next(e);
  }
});

router.post('/email-verification-link', authenticateFirebaseUser, async (req: Request, res: Response, next: NextFunction) => {

  const { userEmail = '', originalUrl } = req;

  try {
    const link = await UserService.generateEmailVerificationLink(userEmail);

    await MailService.send([userEmail], templates.ACCOUNT_VERIFICATION_TEMPLATE, { link });

    send(res, { message: messages.mailSent().observable }, originalUrl);
  }
  catch (e: any) {
    next(e);
  }
});

export default router;