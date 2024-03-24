import BasicError from "../BasicError";

class SeedsInsertionFailed extends BasicError {

  constructor(model: string) {
    const messages: string[][] = [[
      "An",
      "error".red,
      "has occured while",
      "inserting seeds".red,
      "to the",
      model.red,
      "document."
    ]];

    super(messages);
  }
}

export default SeedsInsertionFailed;