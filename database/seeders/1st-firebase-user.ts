import {Error as MongooseError, HydratedDocument} from "mongoose";
import {schema} from "../../models";

const AppLogger = require('../../logger');
const MongooseSchemaValidationMessagesExtractor = require("../../handlers/mongoose-schema-validation-messages");

const { User, Role } = require("../../schema");

module.exports = async () => {

    const userId: string = 'RIsX5KouB3TnN69WRIHwIra5Qtt2';

    await User.deleteOne({ _id: userId });

    const userRole: schema.IRoleSchema | null = await Role.findOne().sort({ created_at: 1 });

    if (userRole) {
        const existingUser: schema.IUserSchema | null = await User.findOne({ _id: userId });

        if (existingUser) {
            throw new Error(
              AppLogger.messages
                .USER_WITH_SAME_ID_EXISTS.stringify()
            );
        }

        const firstUser: HydratedDocument<schema.IUserSchema> = new User({
            _id: userId,
            firstName: 'Omar',
            lastName: 'Jarray',
            role: userRole._id
        });

        const userModelValidation: MongooseError.ValidationError | null = firstUser.validateSync();

        if (userModelValidation) {
            throw new Error(
              AppLogger.messages
                .SCHEMA_VALIDATION_ERROR(User.modelName, MongooseSchemaValidationMessagesExtractor(userModelValidation))
                .stringify()
            );
        }

        return firstUser.save()
            .then(() => AppLogger.messages.SEEDS_INSERTED(User.modelName).log());
    }

    throw new Error(AppLogger.messages
      .DOCUMENT_NOT_FOUND(Role.modelName).stringify());
}