import BasicError from "../BasicError";

class DatabaseConnectionFailed extends BasicError {
  constructor() {
    const messages: string[][] = [[
      "The server is",
      "unable to establish a connection".red,
      "to the",
      "MongoDB database".red,
      "."
    ]];

    super(messages);
  }
}

export default DatabaseConnectionFailed;