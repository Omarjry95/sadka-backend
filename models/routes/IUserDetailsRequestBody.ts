import {string, type} from "io-ts";

export const IUserDetailsRequestBody = type({
    id: string
})