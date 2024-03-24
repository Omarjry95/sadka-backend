import {model, Schema} from "mongoose";
import {IStoreSchema} from "../models/schema";

const Store = model('Store', new Schema<IStoreSchema>({
  name: { type: String, required: true },
  photo: { type: String, required: false }
}));

export default Store;