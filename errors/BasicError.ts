class BasicError extends Error {
  constructor(messages: string[][]) {
    super(messages.map(message => message.join(" "))
      .join("\n"));

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }

  public log() {
    console.log(this.message);
  }
}

export default BasicError;