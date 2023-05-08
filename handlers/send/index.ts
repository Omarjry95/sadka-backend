import {Locals, NextFunction, Response} from "express";

module.exports = (body: Locals, res: Response, next: NextFunction) => {
    Object.assign(res.locals, body);

    next();
}