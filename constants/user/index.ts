import {auth} from "firebase-admin";

module.exports = {
    defaultCreateUserRequestProps: (): auth.CreateRequest => {
        return {
            emailVerified: false,
            disabled: false
        }
    }
}