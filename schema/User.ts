import { Schema, model } from 'mongoose';
import {IUserSchema} from "../models/schema/IUserSchema";

module.exports = model('User', new Schema<IUserSchema>({
    _id: {
        type: String,
        required: true
    },
    lastName: { type: String },
    firstName: { type: String },
    charityName: { type: String },
    role: {
        type: Schema.Types.ObjectId,
        ref: "Role",
        required: true
    }
}));