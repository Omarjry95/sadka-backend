import {Document, Types} from "mongoose";

interface IDonationSchema extends Document {
  user: string,
  originalAmount?: number,
  association: string,
  note?: string,
  success: boolean
}

export default IDonationSchema;