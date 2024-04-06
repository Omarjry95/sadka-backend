import {Document, Types} from "mongoose";

interface IDonationSchema extends Document {
  user: string,
  amount: number,
  productAmount?: number,
  rounding?: Types.ObjectId,
  association: string,
  store?: Types.ObjectId,
  note?: string,
  success: boolean
}

export default IDonationSchema;