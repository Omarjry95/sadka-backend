import {NextFunction} from "express";
import {auth} from "firebase-admin";

var AppLogger = require("../logger");

module.exports = {
    createUser: () => {
        
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