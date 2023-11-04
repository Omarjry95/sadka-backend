import {model, Schema} from "mongoose";
import {IDonationSchema} from "../models/schema/IDonationSchema";

module.exports = model('Donation', new Schema<IDonationSchema>({
  _id: { type: String, required: true },
  originalAmount: { type: Number, required: false },
  association: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  note: { type: String, required: false },
  success: { type: Boolean, required: true }
}));