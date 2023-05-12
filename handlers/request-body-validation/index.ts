import {Errors, TypeC, TypeOf} from "io-ts";
import {Either, isLeft} from "fp-ts/Either";
import {NextFunction, Request} from "express";
import {PathReporter} from "io-ts/PathReporter";

var AppLogger = require("../../logger");

module.exports = (req: Request<any, any, TypeOf<typeof requestBodyType>>, requestBodyType: TypeC<any>, next: NextFunction): boolean => {

    const { body, originalUrl } = req;

    let isValidationFailed: boolean = false;

    const decodedRequestBody: Either<Errors, TypeOf<typeof requestBodyType>> = requestBodyType.decode(body);

    if (isLeft(decodedRequestBody)) {
        next(
            new Error(
                AppLogger.stringifyToThrow(
                    AppLogger.messages.requestBodyValidationError(originalUrl, PathReporter.report(decodedRequestBody))
                )));

        isValidationFailed = true;
    }

    return isValidationFailed;
}