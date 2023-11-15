import BasicError from "../BasicError";

class UserWithSameIdExistsError extends BasicError {
  constructor() {
    const messages: string[][] = [[
      "A user with the same ID".red,
      "you provided".white,
      "already exists".red
    ]];

    super(messages);
  }
}

export default UserWithSameIdExistsError;