import { Schema, model } from 'mongoose';
import {IRoleSchema} from "../models/schema";

const Role = model('Role', new Schema<IRoleSchema>({
    label: {
        type: String,
        required: true
    }
}));

export default Role;