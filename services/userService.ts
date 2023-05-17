import {NextFunction} from "express";
import {auth} from "firebase-admin";
import {IUserSchema} from "../models/schema/IUserSchema";
import {Error as MongooseError, HydratedDocument} from "mongoose";

var AppLogger = require("../logger");
var Constants = require("../constants/user");
const User = require("../schema/User");
const gatherValidationMessages = require("../handlers/mongoose-schema-validation-messages");

module.exports = {
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
                AppLogger.stringifyToThrow(
                    AppLogger.messages.firebaseUserWithSameEmailExists()
                )));
    },
    getDisplayName: (isUserCitizen: boolean, firstName: string = "", lastName: string = "", charityName: string = ""): string => {
        if (isUserCitizen) {
            return firstName.concat(' ').concat(lastName);
        }

        return charityName;
    }
}