import {NextFunction} from "express";
import {auth, storage} from "firebase-admin";
import {HydratedDocument} from "mongoose";
import { IUsersByTypeServiceResponse } from "../models/routes";
import {
    DocumentNotFound,
    FirebaseUserNotCreated,
    DocumentNotCreated,
    FirebaseUserWithSameEmailExistsError,
    FirebaseEmailVerificationLinkGenerationFailed, DocumentNotUpdated
} from "../errors/custom";
import { UserRolesEnum } from "../models/app";
import {DEFAULT_CREATE_USER_REQUEST_PROPS} from "../constants/user";
import {IRoleSchema, IUserSchema} from "../models/schema";
import * as messages from "../logger/messages";
import IUpdateUserServiceRequestBody from "../models/routes/IUpdateUserServiceRequestBody";
import { FileService } from "../services";
import {User, Role} from "../schema";

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
            throw new DocumentNotFound(User.modelName);
        }),
    getUserById: (id: string): Promise<IUserSchema> => User.findById(id)
      .then((user: IUserSchema | null) => {
          if (!user)
              throw new Error();

          return user;
      })
      .catch(() => {
          throw new DocumentNotFound(User.modelName);
      }),
    createUser: async (user: HydratedDocument<IUserSchema>) => user.save()
      .catch(() => {
          throw new DocumentNotCreated(User.modelName);
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
    updateUser: async (data: IUpdateUserServiceRequestBody) => {

        const { id, lastName, firstName, charityName, defaultRounding,
            defaultAssociation, isPhotoChanged, file } = data;

        let propertiesToUpdate: Record<string, string | undefined> = {
            lastName,
            firstName,
            charityName,
            ...(defaultAssociation ? { defaultAssociation } : {}),
            ...(defaultRounding ? { rounding: defaultRounding } : {})
        };

        let propertiesToUnset: Record<string, string | undefined> = {
            ...(defaultAssociation ? { } : { defaultAssociation: '' }),
            ...(defaultRounding ? { } : { rounding: '' })
        };

        try {
            const storageBucket = storage().bucket();

            if (file) {
                const { originalname: fileOriginalName, buffer: fileBuffer } = file;

                const fileName = FileService.getFileNameWithExtension(fileOriginalName, id);

                await storageBucket.file(fileName)
                  .save(fileBuffer);

                propertiesToUpdate = {
                    ...propertiesToUpdate,
                    photo: fileName
                }
            } else if (isPhotoChanged) {
                const [storageFiles] = await storageBucket.getFiles();

                const userSavedPhoto = storageFiles.find(({ name: storageFileName }) => storageFileName.startsWith(id));

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
        } catch (e: any) {
            throw new DocumentNotUpdated(User.modelName);
        }
    },
    throwIfFirebaseUserExists: async (email: string, next: NextFunction) => {
        await auth().getUserByEmail(email);

        next(new FirebaseUserWithSameEmailExistsError());
    },
    getDisplayName: (isUserCitizen: boolean, firstName: string = "", lastName: string = "", charityName: string = ""): string => isUserCitizen ?
      firstName.concat(' ').concat(lastName) : charityName,
    generateEmailVerificationLink: async (email: string): Promise<string> => auth().generateEmailVerificationLink(email)
      .then((link) => {
          messages.verificationLinkGenerated().log();

          return link;
      })
      .catch(() => {
          throw new FirebaseEmailVerificationLinkGenerationFailed();
      })
};

export default userService;