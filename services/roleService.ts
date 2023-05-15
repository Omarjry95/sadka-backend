import {IRoleSchema} from "../models/schema/IRoleSchema";
import {NextFunction} from "express";

const AppLogger = require("../logger");
const Role = require("../schema/Role");

module.exports = {
    getRoleById: async (id: string, next: NextFunction): Promise<IRoleSchema | null> => {
        let role: IRoleSchema | null = null;

        try {
            role = await Role.findById(id);

            if (!role) {
                throw new Error();
            }
        }
        catch (e: any) {
            next(
                new Error(
                    AppLogger.stringifyToThrow(
                        AppLogger.messages.documentDoesNotExist(Role.modelName))))
        }

        return role;
    }
}