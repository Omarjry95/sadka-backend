class ErrorBody {

    private _message: string;
    private _code: string;

    constructor(message: string, code: string = "ERR") {
        this._message = message;
        this._code = code;
    }

    get message(): string {
        return this._message;
    }

    set message(value: string) {
        this._message = value;
    }

    get code(): string {
        return this._code;
    }

    set code(value: string) {
        this._code = value;
    }
}

export default ErrorBody;