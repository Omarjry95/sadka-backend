import BasicError from "../BasicError";

class FirebaseUserNotCreated extends BasicError {
    constructor() {
        const messages: string[][] = [[
            "User".red,
            "has",
            "failed".red,
            "to",
            "add".red,
            "to",
            "Firebase".red
        ]];

        const message: string = "User has failed to add to Firebase.";

        super(messages, message);
    }
}

export default FirebaseUserNotCreated;