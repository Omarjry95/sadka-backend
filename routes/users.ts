import express, {Locals, NextFunction, Request, Response, Router} from "express";
import {ICreateUserRequestBody} from "../models/routes/ICreateUserRequestBody";
import {TypeOf} from "io-ts";
import {IDataValidationObject} from "../models/app/IDataValidationObject";
import {ValidationTypesEnum} from "../models/app/ValidationTypesEnum";
import {auth, storage} from "firebase-admin";
import {IUserSchema} from "../models/schema/IUserSchema";
import {HydratedDocument} from "mongoose";
import {IUserRoleServiceResponse} from "../models/routes/IUserRoleServiceResponse";
import {IUsersByTypeServiceResponse} from "../models/routes/IUsersByTypeServiceResponse";
import {IUpdateUserRequestBody} from "../models/routes/IUpdateUserRequestBody";
import multer, { memoryStorage, Multer, StorageEngine } from "multer";

const multerMemoryStorage: StorageEngine = memoryStorage();
const upload: Multer = multer({ storage: multerMemoryStorage });

var router: Router = express.Router();
var AppLogger = require("../logger");
var Constants = require("../constants");
var send = require('../handlers/send-response');
var { verifyJwt, verifyRequiredScopes, scopes } = require("../middlewares/oauth2");
var authenticateFirebaseUser = require("../middlewares/firebase-auth");
var User = require("../schema/User");
var UserService = require("../services/userService");
var RoleService = require("../services/roleService");
var MailService = require("../services/mailService");
var FileService = require("../services/fileService");
var performRequestBodyValidation = require("../handlers/request-body-validation");
var performRequestBodyDataValidation = require("../handlers/request-body-data-validation");

router.get('/details', authenticateFirebaseUser, async (req: Request, res: Response, next: NextFunction) => {

  const { userId = '' } = req;

  try {
    const user: IUserSchema = await UserService.getUserById(userId);

    const roleIndex: number = await RoleService.getUserRoleIndex(user.role.toString());

    const { firstName, lastName, charityName, defaultAssociation } = user;

    const responseBodyInit: Object = roleIndex !== 1 ? { firstName, lastName } : { charityName };

    const response: Locals = {
      status: 200,
      message: AppLogger.messages.dataFetchedSuccess(User.modelName)[0],
      body: {
        ...responseBodyInit,
        id: userId,
        role: roleIndex,
        defaultAssociation: defaultAssociation ? defaultAssociation.toString() : undefined
      }
    }

    send(response, res, next);
  }
  catch (e: any) { next(e); }
});

router.get('/associations', authenticateFirebaseUser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users: IUsersByTypeServiceResponse[] = await UserService.getUsersByRole(1);

    const response: Locals = {
      status: 200,
      message: AppLogger.messages.dataFetchedSuccess(User.modelName)[0],
      body: users.map((user: IUsersByTypeServiceResponse) => ({
        _id: user.id,
        label: user.charityName,
        photoUrl: "https://img.freepik.com/vecteurs-libre/vecteur-degrade-logo-colore-oiseau_343694-1365.jpg"
      }))
    }

    send(response, res, next);
  }
  catch (e: any) { next(e); }
});

router.post('/', verifyJwt(), verifyRequiredScopes([scopes.unrestricted]), async (req: Request<any, any, TypeOf<typeof ICreateUserRequestBody>>, res: Response, next: NextFunction) => {

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

      const link: string = await UserService.generateEmailVerificationLink(email);

      await MailService([email], 'account-verification', { link });

      send({
        status: 200,
        message: AppLogger.messages.documentCreatedSuccess(User.modelName)[0]
      }, res, next);
    }
  }
  catch (e: any) { next(e); }
});

router.put('/', upload.single('photo')/*, authenticateFirebaseUser*/, async (req: Request<any, any, TypeOf<typeof IUpdateUserRequestBody>>, res: Response, next: NextFunction) => {

  const { body, file, originalUrl } = req;
  const { id, lastName, firstName, charityName, defaultAssociation,
    isPhotoChanged, role } = body;

  const isUserCitizen: boolean = role === "0";

  const roleBasedDataToValidate: IDataValidationObject[] = isUserCitizen ? [
    { value: lastName, validations: [ValidationTypesEnum.NOT_BLANK] },
    { value: firstName, validations: [ValidationTypesEnum.NOT_BLANK] }
  ] : [
    { value: charityName, validations: [ValidationTypesEnum.NOT_BLANK] }
  ];

  const dataToValidate: IDataValidationObject[] = [
    ...roleBasedDataToValidate,
    { value: id, validations: [ValidationTypesEnum.NOT_BLANK] }
  ];

  try {
    performRequestBodyValidation(req, IUpdateUserRequestBody);
    performRequestBodyDataValidation(dataToValidate, originalUrl);

    let propertiesToUpdate: Object = { lastName, firstName, charityName };
    let propertiesToUnset: Object = { defaultAssociation: '' };

    if (defaultAssociation) {
      propertiesToUpdate = {
        ...propertiesToUpdate,
        defaultAssociation: defaultAssociation
      };

      propertiesToUnset = {};
    }

    await User.findByIdAndUpdate(id, {
      ...propertiesToUpdate,
      $unset: propertiesToUnset
    });

    if (file) {
      await storage()
        .bucket()
        .file(FileService
          .getFileNameWithExtension(file, id))
        .save(file.buffer);
    } else if (isPhotoChanged) {
      const [storageFiles] = await storage().bucket().getFiles();

      const userSavedPhoto = storageFiles.find((storageFile) => storageFile.name.startsWith(id));

      if (userSavedPhoto) {
        await storage()
          .bucket()
          .file(userSavedPhoto.name)
          .delete();
      }
    }

    send({
      status: 200,
      message: AppLogger.messages.documentUpdatedSuccess(User.modelName)[0]
    }, res, next);
  }
  catch (e: any) { console.log(e); next(e); }
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

module.exports = router;