import BasicError from "../BasicError";

class DocumentNotFound extends BasicError {
  constructor(model: string) {
    const messages: string[][] = [[
      "No document".red,
      "for the",
      model.red,
      "model with the criteria you provided has been found."
    ]];

    super(messages);
  }
}

export default DocumentNotFound;