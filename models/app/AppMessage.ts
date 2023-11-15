import AppMessageStatus from "./AppMessageStatus";

class AppMessage {

  private _status: AppMessageStatus = AppMessageStatus.INFO;

  private _observable?: string;

  private _logables: string[] = [];

  constructor() {

  }

  get observable(): string | undefined {
    return this._observable;
  }

  set observable(value: string | undefined ) {
    this._observable = value;
  }

  get logables(): string[]  {
    return this._logables;
  }

  set logables(value: string[]) {
    this._logables = value;
  }

  public log(): void {
    const successLog: string[] = [];

    if (this._status === AppMessageStatus.SUCCESS) {
      successLog.push("Success: ".green + new Date())
    }

    [...successLog, ...this._logables].forEach(console.log);
  }

  public stringify(): string {
    return JSON.stringify([
      "Error: ".red + new Date(),
      ...this._logables
    ]);
  }
}

export default AppMessage;