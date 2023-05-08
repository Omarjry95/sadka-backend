module.exports = class ErrorBody {
    private code: number;
    private message: string = "";

    constructor(code: number = 500, message: string = "") {
        this.code = code;
        this.message = message;
    }
}