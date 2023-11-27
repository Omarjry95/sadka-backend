import {NextFunction} from "express";
import {auth, storage} from "firebase-admin";
import {HydratedDocument} from "mongoose";
import { IUsersByTypeServiceResponse } from "../models/routes";
import {
    DocumentNotFoundError,
    FirebaseUserNotCreated,
    DocumentNotCreated,
    FirebaseUserWithSameEmailExistsError,
    FirebaseEmailVerificationLinkGenerationFailed
} from "../errors/custom";
import { UserRolesEnum } from "../models/app";
import {DEFAULT_CREATE_USER_REQUEST_PROPS} from "../constants/user";
import {IRoleSchema, IUserSchema} from "../models/schema";
import * as messages from "../logger/messages";

var AppLogger = require("../logger");
const User = require("../schema/User");
const Role = require("../schema/Role");
var FileService = require("./fileService");

const userService = {
    getUsersByRole: (roleIndex: UserRolesEnum): Promise<IUsersByTypeServiceResponse[]> => Role.find()
        .sort({ _id: 1 })
        .then((roles: IRoleSchema[]) => {
            const role: IRoleSchema | undefined = roles[roleIndex];

            if (!role)
                throw new Error();

            return role._id;
        })
        .then((roleId: any) => User.find({ role: { _id: roleId } }))
        .then((users: IUserSchema[]) => users.map(({ _id: id, lastName, firstName, charityName, photo }: IUserSchema) => ({
            id,
            lastName,
            firstName,
            charityName,
            photo
        })))
        .catch(() => {
            throw new DocumentNotFoundError(User.modelName);
        }),
    // getUserById: async (id: string): Promise<IUserSchema> => {
    //     try {
    //         const user: IUserSchema | null = await User.findById(id);
    //
    //         if (!user)
    //             throw new DocumentNotFoundError(User.modelName);
    //
    //         return user;
    //     }
    //     catch (e: any) {
    //         throw new DocumentNotFoundError(User.modelName);
    //     }
    // },
    getUserById: async (id: string): Promise<IUserSchema> => User.findById(id)
      .then((user: IUserSchema | null) => {
          if (!user)
              throw new Error();

          return user;
      })
      .catch(() => {
          throw new DocumentNotFoundError(User.modelName);
      }),
    createUser: async (user: HydratedDocument<IUserSchema>) => user.save()
      .catch(() => {
          throw new DocumentNotCreated(User.modelName)
      }),
    createFirebaseUser: async (data: auth.CreateRequest): Promise<string> => {
        try {
            const userCreated: auth.UserRecord = await auth()
              .createUser({
                  ...DEFAULT_CREATE_USER_REQUEST_PROPS,
                  ...data
              });

            return userCreated.uid;
        }
        catch (e: any) {
            throw new FirebaseUserNotCreated();
        }
    },
    updateUser: async (id: string, lastName?: string, firstName?: string, charityName?: string, defaultRounding?: string, defaultAssociation?: string,
                       file?: Express.Multer.File, isPhotoChanged?: string) => {

        let propertiesToUpdate: Object = { lastName, firstName, charityName };
        let propertiesToUnset: Object = { };

        Object.assign(defaultAssociation ? propertiesToUpdate : propertiesToUnset, { defaultAssociation: defaultAssociation ?? '' });
        Object.assign(defaultRounding ? propertiesToUpdate : propertiesToUnset, { rounding: defaultRounding ?? '' });

        const storageBucket = storage().bucket();

        if (file) {
            const fileName: string = FileService.getFileNameWithExtension(file, id);

            await storageBucket.file(fileName)
              .save(file.buffer);

            propertiesToUpdate = {
                ...propertiesToUpdate,
                photo: fileName
            }
        } else if (isPhotoChanged) {
            const [storageFiles] = await storageBucket.getFiles();

            const userSavedPhoto = storageFiles.find((storageFile) => storageFile.name.startsWith(id));

            if (userSavedPhoto) {
                await storageBucket.file(userSavedPhoto.name)
                  .delete();

                propertiesToUnset = {
                    ...propertiesToUnset,
                    photo: ''
                }
            }
        }

        await User.findByIdAndUpdate(id, {...propertiesToUpdate, $unset: propertiesToUnset});
    },
    throwIfFirebaseUserExists: async (email: string, next: NextFunction) => {
        await auth().getUserByEmail(email);

        next(new FirebaseUserWithSameEmailExistsError());
    },
    getDisplayName: (isUserCitizen: boolean, firstName: string = "", lastName: string = "", charityName: string = ""): string => isUserCitizen ?
      firstName.concat(' ').concat(lastName) : charityName,
    generateEmailVerificationLink: async (email: string): Promise<string> => {
        try {
            const link: string = await auth().generateEmailVerificationLink(email);

            messages.verificationLinkGenerated().log();

            return link;
        }
        catch (e: any) {
            throw new FirebaseEmailVerificationLinkGenerationFailed();
        }
    }
};

export default userService;