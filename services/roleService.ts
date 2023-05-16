import {IRoleSchema} from "../models/schema/IRoleSchema";

const AppLogger = require("../logger");
const Role = require("../schema/Role");

module.exports = {
    getRoleById: async (id: string): Promise<IRoleSchema> => {
        let role: IRoleSchema | null = null;

        try {
            role = await Role.findById(id);

            if (!role) { throw new Error(); }
        }
        catch (e: any) {
            throw new Error(
                AppLogger.stringifyToThrow(
                    AppLogger.messages.documentDoesNotExist(Role.modelName)))
        }

        return role;
    }
}