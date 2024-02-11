import {model, Schema} from "mongoose";
import {IDonationSchema} from "../models/schema";

const Donation = model('Donation', new Schema<IDonationSchema>({
  _id: { type: String, required: true },
  originalAmount: { type: Number, required: false },
  association: {
    type: String,
    ref: "User",
    required: true
  },
  note: { type: String, required: false },
  success: { type: Boolean, required: true }
}));

export default Donation;