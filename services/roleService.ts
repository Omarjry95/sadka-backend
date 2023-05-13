import {IRoleSchema} from "../models/schema/IRoleSchema";

const Role = require("../schema/Role");

module.exports = {
    getRoleById: async (id: string): Promise<IRoleSchema | null> => {
        const role: IRoleSchema | null = await Role.findById(id);

        if (!role) {

        }

        return role;
    }
}