import BasicError from "../BasicError";

class FirebaseEmailVerificationLinkGenerationFailed extends BasicError {
    constructor() {
        const messages: string[][] = [[
            "The Firebase email",
            "verification link".red,
            "has",
            "failed to generate".red,
            "."
        ]];

        const message: string = "The Firebase email verification link has failed to generate.";

        super(messages, message);
    }
}

export default FirebaseEmailVerificationLinkGenerationFailed;