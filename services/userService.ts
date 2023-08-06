import {NextFunction} from "express";
import {auth} from "firebase-admin";
import {IUserSchema} from "../models/schema/IUserSchema";
import {Error as MongooseError, HydratedDocument} from "mongoose";
import {IRoleSchema} from "../models/schema/IRoleSchema";
import {IUsersByTypeServiceResponse} from "../models/routes/IUsersByTypeServiceResponse";
import {undefined} from "io-ts";

var AppLogger = require("../logger");
var Constants = require("../constants/user");
const User = require("../schema/User");
const Role = require("../schema/Role");
const gatherValidationMessages = require("../handlers/mongoose-schema-validation-messages");

module.exports = {
    getUsersByRole: (roleIndex: 0 | 1 | 2): Promise<IUsersByTypeServiceResponse[]> => Role.find()
        .sort({ _id: 1 })
        .then((roles: IRoleSchema[]) => {
            const role: IRoleSchema = roles[roleIndex];

            if (!role) { throw new Error(); }

            return role._id;
        })
        .then((roleId: any) => User.find({ role: { _id: roleId } }))
        .then((users: IUserSchema[]) => users.map((user: IUserSchema) => ({
            id: user._id,
            lastName: user.lastName,
            firstName: user.firstName,
            charityName: user.charityName
        })))
        .then(async (users: IUsersByTypeServiceResponse[]) => {
            const usersRecords: auth.GetUsersResult = await auth().getUsers(users.map((user: IUsersByTypeServiceResponse) => ({ uid: user.id })));

            const { users: usersFound, notFound: usersNotFound } = usersRecords;

            if (usersNotFound.length > 0 || usersFound.length !== users.length) { throw new Error(); }

            return users.map((user: IUsersByTypeServiceResponse) => {
                const userFound: auth.UserRecord | undefined = usersFound.find((u: auth.UserRecord) => u.uid === user.id);

                return {
                    ...user,
                    photoUrl: userFound ? userFound.photoURL : undefined
                }
            })
        })
        .catch(() => {
            throw new Error(
                AppLogger.stringifyToThrow(
                    AppLogger.messages.documentDoesNotExist(User.modelName)))
        }),
    getUserById: async (id: string): Promise<IUserSchema> => {
        let user: IUserSchema | null = null;

        try {
            user = await User.findById(id);

            if (!user) { throw new Error(); }
        }
        catch (e: any) {
            throw new Error(
                AppLogger.stringifyToThrow(
                    AppLogger.messages.documentDoesNotExist(User.modelName)));
        }

        return user;
    },
    createUser: async (user: HydratedDocument<IUserSchema>): Promise<void> => {
        const userModelValidation: MongooseError.ValidationError | null = user.validateSync();

        if (userModelValidation) {
            throw new Error(
                AppLogger.stringifyToThrow(
                    AppLogger.messages.schemaValidationError(
                        User.modelName,
                        gatherValidationMessages(userModelValidation))));
        }

        try { await user.save(); }
        catch (e: any) {
            throw new Error(
                AppLogger.stringifyToThrow(
                    AppLogger.messages.documentNotCreated(User.modelName)))
        }
    },
    createFirebaseUser: async (data: auth.CreateRequest): Promise<string> => {
        let userUID: string = "";

        try {
            const userCreated: auth.UserRecord = await auth()
                .createUser({
                    ...Constants.defaultCreateUserRequestProps(),
                    ...data
                });

            userUID = userCreated.uid;
        }
        catch (e: any) {
            throw new Error(
                AppLogger.stringifyToThrow(
                    AppLogger.messages.firebaseUserNotCreated()
                ));
        }

        return userUID;
    },
    throwIfFirebaseUserExists: async (email: string, next: NextFunction) => {
        await auth()
            .getUserByEmail(email);

        next(
            new Error(
                AppLogger.stringifyToThrow(["UAE"])));
    },
    getDisplayName: (isUserCitizen: boolean, firstName: string = "", lastName: string = "", charityName: string = ""): string => {
        if (isUserCitizen) {
            return firstName.concat(' ').concat(lastName);
        }

        return charityName;
    },
    generateEmailVerificationLink: async (email: string): Promise<string> => {
        try {
            const link: string = await auth().generateEmailVerificationLink(email);

            AppLogger.log(AppLogger.messages.firebaseEmailVerificationLinkGeneratedSuccess());

            return link;
        }
        catch (e: any) {
            throw new Error(
                AppLogger.stringifyToThrow(
                    AppLogger.messages.firebaseEmailVerificationLinkGeneratedError()
                ));
        }
    }
};