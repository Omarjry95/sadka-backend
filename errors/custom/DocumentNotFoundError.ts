import BasicError from "../BasicError";

class DocumentNotFoundError extends BasicError {
  constructor(model: string) {
    const messages: string[][] = [[
      "No document".red,
      "for the".white,
      model.red,
      "with the criteria you provided has been found.".white
    ]];

    super(messages);
  }
}

export default DocumentNotFoundError;