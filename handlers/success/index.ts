import {NextFunction, Request, Response} from "express";

var AppLogger = require('../../logger');

var SuccessResponse = require("../../models/app/SuccessResponse");

module.exports = (req: Request, res: Response, next: NextFunction) => {

    const { path } = req;
    const { status, message, body } = res.locals;

    AppLogger.requestSuccess(message, path);

    res.status(status ?? 200)
        .send(body ?? new SuccessResponse());
}