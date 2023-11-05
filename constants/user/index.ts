import { auth } from "firebase-admin";

const DEFAULT_CREATE_USER_REQUEST_PROPS: auth.CreateRequest = {
    emailVerified: false,
    disabled: false
}

module.exports = {
    DEFAULT_CREATE_USER_REQUEST_PROPS
}