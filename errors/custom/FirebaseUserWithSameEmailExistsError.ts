import BasicError from "../BasicError";

class FirebaseUserWithSameEmailExistsError extends BasicError {
    constructor() {
        const messages: string[][] = [[
            "A user with the same email".red,
            "you provided",
            "already exists".red,
            "in the firebase database"
        ]];

        const message: string = "A user with the same email you provided already exists in the firebase database";

        super(messages, message, "UNU");
    }
}

export default FirebaseUserWithSameEmailExistsError;