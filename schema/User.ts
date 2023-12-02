import { Schema, model } from 'mongoose';
import {IUserSchema} from "../models/schema";

const User = model('User', new Schema<IUserSchema>({
    _id: { type: String, required: true },
    lastName: { type: String, required: false },
    firstName: { type: String, required: false },
    charityName: { type: String, required: false },
    photo: { type: String, required: false },
    role: {
        type: Schema.Types.ObjectId,
        ref: "Role",
        required: true
    },
    rounding: {
        type: Schema.Types.ObjectId,
        ref: "Rounding",
        required: false
    },
    defaultAssociation: {
        type: String,
        ref: "User",
        required: false
    }
}));

export default User;