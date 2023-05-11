import { NextFunction, Request, Response } from "express";

var AppLogger = require('../../logger');
var ErrorBody = require('../../models/app/ErrorBody');

module.exports = (error: Error, req: Request, res: Response, next: NextFunction) => {

    const message: string = (JSON.parse(error.message) as string[])[0];

    AppLogger.log(
        AppLogger.messages.requestError(
            message,
            req.path
        ));

    const defaultErrorStatus: number = 500;

    res.status(defaultErrorStatus)
        .send(new ErrorBody(defaultErrorStatus, message));
}