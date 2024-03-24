import {Document} from "mongoose";

interface IStoreSchema extends Document {
  name: string,
  photo?: string
}

export default IStoreSchema;