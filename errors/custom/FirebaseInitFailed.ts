import BasicError from "../BasicError";

class FirebaseInitFailed extends BasicError {
  constructor() {
    const messages: string[][] = [[
      "The",
      "Firebase Service Account".red,
      "is",
      "unable to initialize.".red
    ]];

    super(messages);
  }
}

export default FirebaseInitFailed;