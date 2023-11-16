class SuccessResponse {

    private _success: boolean;

    constructor(success: boolean = true) {
        this._success = success;
    }

    get success(): boolean {
        return this._success;
    }

    set success(value: boolean) {
        this._success = value;
    }
}

export default SuccessResponse;