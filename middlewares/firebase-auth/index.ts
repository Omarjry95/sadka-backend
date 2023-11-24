import {Request, Response, NextFunction} from "express";
import {auth} from "firebase-admin";
import {AUTHORIZATION_HEADER, AUTH_TOKEN_PREFIX} from "../../constants/app";
import * as messages from "../../logger/messages";
import { AuthError } from "../../errors/custom";

const authenticateFirebaseUser = async (req: Request, res: Response, next: NextFunction) => {

    const { headers, originalUrl } = req;

    const authHeader: string | string[] | undefined = headers[AUTHORIZATION_HEADER];

    if (typeof authHeader === "string") {

        const authToken: string | undefined = authHeader.split(AUTH_TOKEN_PREFIX)[1];

        if (authToken) {
            try {
                const decodedAuthToken: auth.DecodedIdToken = await auth().verifyIdToken(authToken);

                req.userId = decodedAuthToken.uid;
                req.userEmail = decodedAuthToken.email;

                messages.authSuccess(originalUrl).log();

                next();
            }
            catch (e: any) {
                next(new AuthError(originalUrl));
            }
        }
        else {
            next(new AuthError(originalUrl));
        }
    }
    else {
        next(new AuthError(originalUrl));
    }
}

export default authenticateFirebaseUser;