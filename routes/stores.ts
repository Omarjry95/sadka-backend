import * as express from "express";
import authenticateFirebaseUser from "../middlewares/firebase-auth";
import {Request, Response, NextFunction} from "express";
import {IStoreItem} from "../models/routes";
import {StoreService} from "../services";
import * as messages from "../logger/messages";
import {Store} from "../schema";
import send from "../handlers/success";

var router = express.Router();

router.get('/', authenticateFirebaseUser,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stores: IStoreItem[] = await StoreService.getAllStores();

      const payload = {
        message: messages.fetchSuccess(Store.modelName).observable,
        body: stores
      }

      send(res, payload, req.originalUrl);
    }
    catch (e: any) {
      next(e);
    }
});

export default router;