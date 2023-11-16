import {IRoleSchema} from "../../models/schema";
import {HydratedDocument} from "mongoose";
import * as messages from "../../logger/messages";

const { Role } = require("../../schema");

const defaultRolesSeeder = () => {
    const roles: HydratedDocument<IRoleSchema>[] = [
        new Role({ label: 'Citoyen philantrope' }),
        new Role({ label: 'Organisme de bienfaisance' }),
        new Role({ label: 'Administrateur' })
    ];

    return Role.deleteMany({})
      .then(() => Role.insertMany(roles))
      .then(() => messages.seedsInserted(Role.modelName)
        .log());
}

export default defaultRolesSeeder;