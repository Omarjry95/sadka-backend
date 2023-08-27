import express, {Locals, Router, Request, Response, NextFunction} from "express";
import {IRoleSchema} from "../models/schema/IRoleSchema";

var router: Router = express.Router();

var AppLogger = require("../logger");
var send = require('../handlers/send-response');
var { verifyJwt, verifyRequiredScopes, scopes } = require("../middlewares/oauth2");
var Role = require("../schema/Role");
var RoleService = require("../services/roleService");

router.get('/', verifyJwt(), verifyRequiredScopes([scopes.unrestricted]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const roles: IRoleSchema[] = await RoleService.getAllRoles();

        const response: Locals = {
            status: 200,
            message: AppLogger.messages.dataFetchedSuccess(Role.modelName)[0],
            body: roles
        }

        send(response, res, next);
    }
    catch (e: any) { next(e); }
});

module.exports = router;