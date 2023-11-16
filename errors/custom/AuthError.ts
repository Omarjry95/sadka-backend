import BasicError from "../BasicError";

class AuthError extends BasicError {
    constructor(path: string) {
        const messages: string[][] = [[
          "User authentication".red,
          "was",
          "rejected".red,
          "while trying to use this endpoint:",
          path.red
        ]];

        const message: string = "User authentication was rejected while trying to use this endpoint: " + path.red;

        super(messages, message, "UAE");
    }
}

export default AuthError;