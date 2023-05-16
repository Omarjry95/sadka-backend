import {Errors, TypeC, TypeOf} from "io-ts";
import {Either, isLeft} from "fp-ts/Either";
import {Request} from "express";

var AppLogger = require("../../logger");

module.exports = (req: Request<any, any, TypeOf<typeof requestBodyType>>, requestBodyType: TypeC<any>): void => {

    const { body, originalUrl } = req;

    const decodedRequestBody: Either<Errors, TypeOf<typeof requestBodyType>> = requestBodyType.decode(body);

    if (isLeft(decodedRequestBody)) {
        throw new Error(
            AppLogger.stringifyToThrow(
                AppLogger.messages.requestBodyValidationError(originalUrl)
            ));
    }
}