class AppMessage {

  private _isSuccess: boolean = false;

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

  get isSuccess(): boolean {
    return this._isSuccess;
  }

  set isSuccess(value: boolean) {
    this._isSuccess = value;
  }

  public log(): void {
    const successLog: string[] = [];

    if (this._isSuccess) {
      successLog.push("Success: ".green + new Date())
    }

    [...successLog, ...this._logables].forEach(console.log);
  }
}

export default AppMessage;