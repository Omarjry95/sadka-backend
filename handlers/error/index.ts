import { NextFunction, Request, Response } from "express";

var AppLogger = require('../../logger');
var ErrorBody = require('../../models/app/ErrorBody');

module.exports = (error: Error, req: Request, res: Response, next: NextFunction) => {

    AppLogger.requestError(error.message, req.path);

    const defaultErrorStatus: number = 500;

    res.status(defaultErrorStatus)
        .send(new ErrorBody(defaultErrorStatus, error.message));
}