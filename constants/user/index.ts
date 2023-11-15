import { auth } from "firebase-admin";

const DEFAULT_CREATE_USER_REQUEST_PROPS: auth.CreateRequest = {
    emailVerified: false,
    disabled: false
}

export {
    DEFAULT_CREATE_USER_REQUEST_PROPS
}