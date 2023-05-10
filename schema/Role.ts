import { Schema, model } from 'mongoose';
import {IRoleSchema} from "../models/schema/IRoleSchema";

module.exports = model('Role', new Schema<IRoleSchema>({
    label: {
        type: String,
        required: true/*,
        validate: {
            validator: (label: string) => label.length > 0,
            message: 'Field "label" is blank'
        }*/
    }
}));