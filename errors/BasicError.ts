class BasicError extends Error {

  private _observable: string;

  private _code: string;

  constructor(messages: string[][], observable: string = "", code: string = "ERR") {
    super(messages.map(message => message.join(" "))
      .join("\n"));

    this.name = this.constructor.name;
    this._code = code;
    this._observable = observable;

    Error.captureStackTrace(this, this.constructor);
  }

  get observable(): string {
    return this._observable;
  }

  set observable(value: string) {
    this._observable = value;
  }

  get code(): string {
    return this._code;
  }

  set code(value: string) {
    this._code = value;
  }

  public log() {
    console.log(this.message);
  }
}

export default BasicError;