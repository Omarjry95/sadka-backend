import {IRoleSchema} from "../models/schema/IRoleSchema";
import {IUserRoleServiceResponse} from "../models/routes/IUserRoleServiceResponse";
import {DocumentNotFoundError} from "../errors/custom";
import { UserRolesEnum } from "../models/app";

const Role = require("../schema/Role");
const AppLogger = require("../logger");

const roleService = {
    getAllRoles: (): Promise<IRoleSchema[]> => Role.find()
        .sort({ _id: 1 })
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
    getUserRoleIndex: async (id: string): Promise<UserRolesEnum> => Role.find()
        .sort({ _id: 1 })
        .then((roles: IRoleSchema[]) => {
            const roleIndex = roles.findIndex((role) => role._id.toString() === id);

            if (roleIndex < 0)
                throw new Error();

            return roleIndex;
        })
        .catch(() => {
            throw new DocumentNotFoundError(Role.modelName);
        }),
    isUserCitizen: async (roleId: string): Promise<boolean> => {
        const roles: IRoleSchema[] = await Role.find()
            .sort({ _id: 1 });

        roles.pop();

        const userRoleIndex: number = roles.findIndex((role) => role._id.toString() === roleId);

        if (userRoleIndex < 0)
            throw new DocumentNotFoundError(Role.modelName);

        return userRoleIndex === UserRolesEnum.isCitizen;
    }
};

export default roleService;