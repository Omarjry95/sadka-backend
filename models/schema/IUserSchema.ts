import {Types, Document} from "mongoose";

export interface IUserSchema extends Document {
    lastName?: string,
    firstName?: string,
    charityName?: string,
    photo?: string,
    role: Types.ObjectId,
    rounding?: Types.ObjectId,
    defaultAssociation?: string
}