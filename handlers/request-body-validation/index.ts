import {Errors, IntersectionC, TypeOf} from "io-ts";
import {Either, isLeft} from "fp-ts/Either";
import {Request} from "express";
// import {PathReporter} from "io-ts/PathReporter";

var AppLogger = require("../../logger");

module.exports = (req: Request<any, any, TypeOf<typeof requestBodyType>>, requestBodyType: IntersectionC<any>): void => {

    const { body, originalUrl } = req;

    const decodedRequestBody: Either<Errors, TypeOf<typeof requestBodyType>> = requestBodyType.decode(body);

    if (isLeft(decodedRequestBody)) {
        // PathReporter.report(decodedRequestBody).map(console.log);
        throw new Error(
            AppLogger.stringifyToThrow(
                AppLogger.messages.requestBodyValidationError(originalUrl)
            ));
    }
}