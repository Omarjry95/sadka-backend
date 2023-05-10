import {Error as MongooseError, HydratedDocument} from "mongoose";
import {IUserSchema} from "../../models/schema/IUserSchema";
import {IRoleSchema} from "../../models/schema/IRoleSchema";

var AppLogger = require('../../logger');
const gatherValidationMessages = require("../../handlers/validation-messages");

const User = require("../../schema/User");
const Role = require("../../schema/Role");

module.exports = async () => {
    const userId: string = 'RIsX5KouB3TnN69WRIHwIra5Qtt2';

    await User.deleteOne({ _id: userId });

    const userRole: IRoleSchema | null = await Role.findOne({ label: 'Citizen' });

    if (userRole) {
        const existingUser: IUserSchema | null = await User.findOne({ _id: userId });

        if (existingUser) {
            AppLogger.userWithSameIdExists();
            throw new Error();
        }

        const firstUser: HydratedDocument<IUserSchema> = new User({
            _id: userId,
            firstName: 'Omar',
            lastName: 'Jarray',
            role: userRole._id
        });

        const roleModelValidation: MongooseError.ValidationError | null = firstUser.validateSync();

        if (roleModelValidation) {
            AppLogger.schemaValidationError(User.modelName, gatherValidationMessages(roleModelValidation));
            throw new Error();
        }

        await firstUser.save();
    }

    AppLogger.documentDoesNotExist(Role.modelName);
    throw new Error();
}