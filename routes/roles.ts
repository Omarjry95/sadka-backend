import * as express from "express";
import {NextFunction, Response, Request} from "express";
import {RoleService} from "../services";
import { verifyJwt, verifyRequiredScopes } from "../middlewares/oauth2";
import {OAUTH2_SCOPES} from "../constants/app";
import {IRoleItem} from "../models/routes";
import * as messages from "../logger/messages";
import {Role} from "../schema";
import send from "../handlers/success";

var router = express.Router();

router.get('/', verifyJwt(), verifyRequiredScopes([OAUTH2_SCOPES.unrestricted]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roles: IRoleItem[] = await RoleService.getAllRoles();

    const payload = {
      message: messages.fetchSuccess(Role.modelName).observable,
      body: roles
    }

    send(res, payload, req.originalUrl);
  }
  catch (e: any) {
    next(e);
  }
});

export default router;