import {model, Schema} from "mongoose";
import {IRoundingSchema} from "../models/schema/IRoundingSchema";

module.exports = model('Rounding', new Schema<IRoundingSchema>({
  label: {
    type: String,
    required: true
  },
  power: {
    type: Number,
    required: true
  }
}));