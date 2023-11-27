import BasicError from "../BasicError";

class DocumentNotCreated extends BasicError {
    constructor(model: string) {
        const messages: string[][] = [[
            model.red,
            "model",
            "could not be created".red,
            "."
        ]];

        const message: string = model.concat(" model could not be created.");

        super(messages, message);
    }
}

export default DocumentNotCreated;