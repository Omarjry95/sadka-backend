import {Document} from "mongoose";

interface IRoundingSchema extends Document {
  label: string,
  power: number
}

export default IRoundingSchema;