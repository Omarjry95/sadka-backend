import express, {Router, Request, Response, NextFunction} from "express";
import {RoleService} from "../services";
import oauth2Manager from "../middlewares/oauth2";
import {OAUTH2_SCOPES} from "../constants/app";
import {IRoleItem} from "../models/routes";
import * as messages from "../logger/messages";
import {Role} from "../schema";
import send from "../handlers/success";

const { verifyJwt, verifyRequiredScopes } = oauth2Manager;

var router: Router = express.Router();

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