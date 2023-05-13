import {NextFunction} from "express";
import {auth} from "firebase-admin";

var AppLogger = require("../logger");
var Constants = require("../constants/user");

module.exports = {
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