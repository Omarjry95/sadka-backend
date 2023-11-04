import {Document, Types} from "mongoose";

export interface IDonationSchema extends Document {
  originalAmount?: number,
  association: Types.ObjectId,
  note: string,
  success: boolean
}