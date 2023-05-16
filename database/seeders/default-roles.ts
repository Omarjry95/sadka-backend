import {IRoleSchema} from "../../models/schema/IRoleSchema";
import {Error as MongooseError, HydratedDocument} from "mongoose";

const AppLogger = require("../../logger");
const gatherValidationMessages = require("../../handlers/mongoose-schema-validation-messages");

const Role = require("../../schema/Role");

module.exports = () => {
    const roles: HydratedDocument<IRoleSchema>[] = [
        new Role({ label: 'Citoyen philantrope' }),
        new Role({ label: 'Organisme de bienfaisance' }),
        new Role({ label: 'Administrateur' })
    ];

    let valid: boolean = true;
    let index: number = 0;
    let roleModelValidation: MongooseError.ValidationError | null = null;

    while (valid && index < roles.length) {
        roleModelValidation = roles[index].validateSync();

        valid = !roleModelValidation;
        index++;
    }

    if (valid) {
        return Role.deleteMany({})
            .then(() => Role.insertMany(roles))
            .then(() => AppLogger.log(AppLogger.messages.seedsInserted(Role.modelName)));
    }
    else {
        throw new Error(AppLogger.stringifyToThrow(
            AppLogger.messages.schemaValidationError(Role.modelName, gatherValidationMessages(roleModelValidation))
        ));
    }
}