import {IRoleSchema} from "../models/schema/IRoleSchema";
import {IUserRoleServiceResponse} from "../models/routes/IUserRoleServiceResponse";

const AppLogger = require("../logger");
const Role = require("../schema/Role");

module.exports = {
    getAllRoles: async (): Promise<IRoleSchema[]> => Role.find()
        .then((roles: IRoleSchema[]) => {
            if (roles.length === 0) { throw new Error(); }

            roles.pop();

            return roles.map((role: IRoleSchema) => ({
                _id: role._id,
                label: role.label
            }));
        })
        .catch(() => {
            throw new Error(
                AppLogger.stringifyToThrow(
                    AppLogger.messages.documentDoesNotExist(Role.modelName)))
        }),
    // getRoleById: async (id: string): Promise<IRoleSchema> => {
    //     let role: IRoleSchema | null = null;
    //
    //     try {
    //         role = await Role.findById(id);
    //
    //         if (!role) { throw new Error(); }
    //     }
    //     catch (e: any) {
    //         throw new Error(
    //             AppLogger.stringifyToThrow(
    //                 AppLogger.messages.documentDoesNotExist(Role.modelName)));
    //     }
    //
    //     return role;
    // },
    getUserRoleIndex: async (id: string): Promise<number> => Role.find()
        .then((roles: IRoleSchema[]) => {
            const roleIndex: number = roles.findIndex((role: IRoleSchema) => role._id.toString() === id);

            if (roleIndex < 0) { throw new Error(); }

            return roleIndex;
        })
        .catch(() => {
            throw new Error(
                AppLogger.stringifyToThrow(
                    AppLogger.messages.documentDoesNotExist(Role.modelName)))
        }),
    isUserCitizen: async (roleId: string): Promise<IUserRoleServiceResponse> => {
        const roles: IRoleSchema[] = await Role.find();

        roles.pop();

        const userRoleIndex: number = roles.findIndex((roleItem: IRoleSchema) => roleItem._id.toString() === roleId);

        if (userRoleIndex < 0) {
            throw new Error(
                AppLogger.stringifyToThrow(
                    AppLogger.messages.documentDoesNotExist(Role.modelName)));
        }

        return {
            userRoleId: roles[userRoleIndex]._id,
            isCitizen: userRoleIndex === 0
        }
    }
}