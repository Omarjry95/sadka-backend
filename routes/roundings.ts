import express, {Locals, NextFunction, Request, Response, Router} from "express";
import {IRoundingSchema} from "../models/schema/IRoundingSchema";

var router: Router = express.Router();
var Rounding = require("../schema/Rounding");
var RoundingService = require('../services/roundingService');
var send = require('../handlers/send-response');
var AppLogger = require("../logger");
var authenticateFirebaseUser = require("../middlewares/firebase-auth");

router.get('/'/*, authenticateFirebaseUser*/, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roundings: IRoundingSchema[] = await RoundingService.getAllRoundings();

    const response: Locals = {
      status: 200,
      message: AppLogger.messages.dataFetchedSuccess(Rounding.modelName)[0],
      body: roundings
    }

    send(response, res, next);
  }
  catch (e: any) {
    next(e);
  }
});

module.exports = router;