import {model, Schema} from "mongoose";
import {IDonationSchema} from "../models/schema";

const Donation = model('Donation', new Schema<IDonationSchema>({
  _id: { type: String, required: true },
  user: {
    type: String,
    ref: "User",
    required: true
  },
  amount: { type: Number, required: true },
  productAmount: { type: Number, required: false },
  rounding: {
    type: Schema.Types.ObjectId,
    ref: "Rounding",
    required: false
  },
  association: {
    type: String,
    ref: "User",
    required: true
  },
  store: {
    type: Schema.Types.ObjectId,
    ref: "Store",
    required: false
  },
  note: { type: String, required: false },
  success: { type: Boolean, required: true }
}));

export default Donation;