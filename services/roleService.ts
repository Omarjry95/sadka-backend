import {UserRolesEnum} from "../models/app";
import {IRoleSchema} from "../models/schema";
import {DocumentNotFound} from "../errors/custom";
import {Role} from "../schema";
import {IRoleItem} from "../models/routes";

const roleService = {
    getAllRoles: (): Promise<IRoleItem[]> => Role.find()
        .sort({ _id: 1 })
        .then((roles: IRoleSchema[]) => {
          if (roles.length === 0)
            throw new Error();

          roles.pop();

          return roles.map(({ _id, label }: IRoleSchema) => ({
            _id,
            label
          }));
        })
        .catch(() => {
          throw new DocumentNotFound(Role.modelName);
        }),
    getUserRoleIndex: async (id: string): Promise<UserRolesEnum> => Role.find()
        .sort({ _id: 1 })
        .then((roles: IRoleSchema[]) => {
            const roleIndex = roles.findIndex((role) => role._id.toString() === id);

            if (roleIndex < 0)
                throw new Error();

            return roleIndex;
        })
        .catch(() => {
            throw new DocumentNotFound(Role.modelName);
        }),
    isUserCitizen: async (roleId: string): Promise<boolean> => {
        const roles: IRoleSchema[] = await Role.find()
            .sort({ _id: 1 });

        roles.pop();

        const userRoleIndex: number = roles.findIndex((role) => role._id.toString() === roleId);

        if (userRoleIndex < 0)
            throw new DocumentNotFound(Role.modelName);

        return userRoleIndex === UserRolesEnum.isCitizen;
    }
};

export default roleService;