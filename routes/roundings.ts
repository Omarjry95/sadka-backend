import * as express from "express";
import {NextFunction, Response, Request} from "express";
import authenticateFirebaseUser from "../middlewares/firebase-auth";
import {RoundingService} from "../services";
import {IRoundingItem} from "../models/routes";
import * as messages from "../logger/messages";
import {Rounding} from "../schema";
import send from "../handlers/success";

var router = express.Router();

router.get('/', authenticateFirebaseUser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roundings: IRoundingItem[] = await RoundingService.getAllRoundings();

    const payload = {
      message: messages.fetchSuccess(Rounding.modelName).observable,
      body: roundings
    }

    send(res, payload, req.originalUrl);
  }
  catch (e: any) {
    next(e);
  }
});

export default router;