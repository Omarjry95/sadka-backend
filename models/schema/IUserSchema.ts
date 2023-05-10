import {Types, Document} from "mongoose";

export interface IUserSchema extends Document {
    _id: string,
    lastName: string,
    firstName: string,
    role: Types.ObjectId
}