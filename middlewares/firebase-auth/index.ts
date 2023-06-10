import {Request, Response, NextFunction} from "express";
import {auth} from "firebase-admin";

var AppLogger = require("../../logger");
var { authTokenPrefix } = require("../../constants");

module.exports = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { headers, originalUrl } = req;

        const authHeader: string | string[] | undefined = headers['authorization'];

        if (typeof authHeader === "string" && authHeader.startsWith(authTokenPrefix)) {
            const authToken: string = authHeader.split(authTokenPrefix)[1];

            const decodedAuthToken: auth.DecodedIdToken = await auth().verifyIdToken(authToken);

            req.userId = decodedAuthToken.uid;

            AppLogger.log(AppLogger.messages.userAuthSuccess(originalUrl));

            next();
        } else {
            throw new Error(
                AppLogger.stringifyToThrow(
                    AppLogger.messages.userAuthError(originalUrl)
                ));
        }
    }
    catch (e: any) { next(e); }
}