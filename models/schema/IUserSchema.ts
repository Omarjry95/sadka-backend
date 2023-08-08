import {Types, Document} from "mongoose";

export interface IUserSchema extends Document {
    lastName?: string,
    firstName?: string,
    charityName?: string,
    role: Types.ObjectId,
    defaultAssociation: Types.ObjectId
}