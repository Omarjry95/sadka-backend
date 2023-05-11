import express, { NextFunction, Request, Response, Router } from "express";
import {auth} from "firebase-admin";
import {ICreateUserRequestBody} from "../models/routes/ICreateUserRequestBody";

var router: Router = express.Router();
var AppLogger = require("../logger");

var send = require('../handlers/send');

router.post('/', async (req: Request<any, any, ICreateUserRequestBody>, res: Response, next: NextFunction) => {

  const { email, password, lastName, firstName, role } = req.body;

  try {
    await auth()
        .getUserByEmail(email);

    next(
        new Error(
            AppLogger.stringifyToThrow(
                AppLogger.messages.firebaseUserWithSameEmailExists()
            )));
  }
  catch (e: any) {
    send({ message: "The user has been created successfully" }, res, next);
  }
});

module.exports = router;
