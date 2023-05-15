import {NextFunction} from "express";
import {auth} from "firebase-admin";
import {IUserSchema} from "../models/schema/IUserSchema";
import {Error as MongooseError, HydratedDocument} from "mongoose";

var AppLogger = require("../logger");
var Constants = require("../constants/user");
const User = require("../schema/User");
const gatherValidationMessages = require("../handlers/mongoose-schema-validation-messages");

module.exports = {
    createUser: async (user: HydratedDocument<IUserSchema>, next: NextFunction): Promise<boolean> => {

        const userModelValidation: MongooseError.ValidationError | null = user.validateSync();

        if (userModelValidation) {
            next(
                new Error(
                    AppLogger.stringifyToThrow(
                        AppLogger.messages.schemaValidationError(
                            User.modelName,
                            gatherValidationMessages(userModelValidation)))));

            return false;
        }

        let userCreated: boolean = true;

        try { await user.save(); }
        catch (e) {
            userCreated = false;

            next(
                new Error(
                    AppLogger.stringifyToThrow(
                        AppLogger.messages.documentNotCreated(User.modelName))))
        }

        return userCreated;
    },
    createFirebaseUser: async (data: auth.CreateRequest, next: NextFunction): Promise<string> => {
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
            next(
                new Error(
                    AppLogger.stringifyToThrow(
                        AppLogger.messages.firebaseUserNotCreated()
                    )));
        }

        return userUID;
    },
    throwIfFirebaseUserExists: async (email: string, next: NextFunction) => {
        await auth()
            .getUserByEmail(email);

        next(
            new Error(
                AppLogger.stringifyToThrow(
                    AppLogger.messages.firebaseUserWithSameEmailExists()
                )));
    }
}