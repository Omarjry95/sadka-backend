module.exports = class SuccessResponse {
    private success: boolean;

    constructor(success: boolean = true) {
        this.success = success;
    }
}