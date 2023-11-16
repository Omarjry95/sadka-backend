import { Schema, model } from 'mongoose';
import {IRoleSchema} from "../models/schema";

module.exports = model('Role', new Schema<IRoleSchema>({
    label: {
        type: String,
        required: true
    }
}));