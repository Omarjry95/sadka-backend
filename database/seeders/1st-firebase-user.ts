import {HydratedDocument} from "mongoose";
import {IUserSchema, IRoleSchema} from "../../models/schema";
import {UserWithSameIdExistsError, DocumentNotFound} from "../../errors/custom";
import * as messages from '../../logger/messages';

const { User, Role } = require("../../schema");

const firstFirebaseUserSeeder = async () => {

    const userId: string = 'RIsX5KouB3TnN69WRIHwIra5Qtt2';

    await User.deleteOne({ _id: userId });

    const userRole: IRoleSchema | null = await Role.findOne()
      .sort({ created_at: 1 });

    if (userRole) {
        const existingUser: IUserSchema | null = await User.findOne({ _id: userId });

        if (existingUser)
            throw new UserWithSameIdExistsError();

        const firstUser: HydratedDocument<IUserSchema> = new User({
            _id: userId,
            firstName: 'Omar',
            lastName: 'Jarray',
            role: userRole._id
        });

        return firstUser.save()
            .then(() => messages.seedsInserted(User.modelName)
              .log());
    }

    throw new DocumentNotFound(Role.modelName);
}

export default firstFirebaseUserSeeder;