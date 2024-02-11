import {Document, Types} from "mongoose";

interface IDonationSchema extends Document {
  originalAmount?: number,
  association: string,
  note?: string,
  success: boolean
}

export default IDonationSchema;