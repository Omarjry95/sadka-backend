import {Error as MongooseError, HydratedDocument} from "mongoose";
import {IUserSchema} from "../../models/schema/IUserSchema";
import {IRoleSchema} from "../../models/schema/IRoleSchema";

var AppLogger = require('../../logger');
const gatherValidationMessages = require("../../handlers/mongoose-schema-validation-messages");

const User = require("../../schema/User");
const Role = require("../../schema/Role");

module.exports = async () => {
    const userId: string = 'RIsX5KouB3TnN69WRIHwIra5Qtt2';

    await User.deleteOne({ _id: userId });

    const userRole: IRoleSchema | null = await Role.findOne({ label: 'Citizen' });

    if (userRole) {
        const existingUser: IUserSchema | null = await User.findOne({ _id: userId });

        if (existingUser) {
            throw new Error(AppLogger.stringifyToThrow(
                AppLogger.messages.userWithSameIdExists()
            ));
        }

        const firstUser: HydratedDocument<IUserSchema> = new User({
            _id: userId,
            firstName: 'Omar',
            lastName: 'Jarray',
            role: userRole._id
        });

        const userModelValidation: MongooseError.ValidationError | null = firstUser.validateSync();

        if (userModelValidation) {
            throw new Error(AppLogger.stringifyToThrow(
                AppLogger.messages.schemaValidationError(User.modelName, gatherValidationMessages(userModelValidation))
            ));
        }

        return firstUser.save()
            .then(() => AppLogger.log(AppLogger.messages.seedsInserted(User.modelName)));
    }

    throw new Error(AppLogger.stringifyToThrow(
        AppLogger.messages.documentDoesNotExist(Role.modelName)
    ));
}