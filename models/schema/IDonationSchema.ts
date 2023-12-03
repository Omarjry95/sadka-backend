import {Document, Types} from "mongoose";

interface IDonationSchema extends Document {
  originalAmount?: number,
  association: Types.ObjectId,
  note?: string,
  success: boolean
}

export default IDonationSchema;