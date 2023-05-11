import {Types, Document} from "mongoose";

export interface IUserSchema extends Document {
    lastName: string,
    firstName: string,
    role: Types.ObjectId
}