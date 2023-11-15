import {Document} from "mongoose";

interface IRoleSchema extends Document {
    label: string
}

export default IRoleSchema;