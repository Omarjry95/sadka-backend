import BasicError from "../BasicError";

class DocumentNotUpdated extends BasicError {
    constructor(model: string) {
        const messages: string[][] = [[
            model.red,
            "model",
            "could not be updated".red,
            "."
        ]];

        const message: string = model.concat(" model could not be updated.");

        super(messages, message);
    }
}

export default DocumentNotUpdated;