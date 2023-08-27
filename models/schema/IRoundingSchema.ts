import {Document} from "mongoose";

export interface IRoundingSchema extends Document {
  label: string,
  power: number
}