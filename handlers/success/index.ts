import {NextFunction, Request, Response} from "express";
import {Locals} from "../../index";

var AppLogger = require('../../logger');
var routes = require('../../routes');

var SuccessResponse = require("../../models/app/SuccessResponse");

module.exports = (req: Request, res: Response, next: NextFunction) => {
    const { path } = req;
    const { status, message, body } = res.locals as Locals;

    /* Catch wrong routing and forward to Error handler */
    if (!status) {
        next(new Error(
            AppLogger.stringifyToThrow(
                AppLogger.messages.routeLostError(path))));

        return;
    }

    AppLogger.log(AppLogger.messages.requestSuccess(message, path));

    res.status(status)
        .send(body ?? new SuccessResponse());
}