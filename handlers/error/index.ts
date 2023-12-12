import { NextFunction, Request, Response } from "express";
import BasicError from "../../errors/BasicError";
import { ErrorBody } from "../../models/app";

const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {

  const basicError: BasicError = error as BasicError;

  basicError.log();

  res.status(500)
    .send(new ErrorBody(basicError.observable, basicError.code));
}

export default errorHandler;