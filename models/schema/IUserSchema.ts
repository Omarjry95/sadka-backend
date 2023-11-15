import {Types, Document} from "mongoose";

interface IUserSchema extends Document {
    lastName?: string,
    firstName?: string,
    charityName?: string,
    photo?: string,
    role: Types.ObjectId,
    rounding?: Types.ObjectId,
    defaultAssociation?: string
}

export default IUserSchema;