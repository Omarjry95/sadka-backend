import {IDataValidationObject} from "../../models/app/IDataValidationObject";
import {ValidationTypesEnum} from "../../models/app/ValidationTypesEnum";

var AppLogger = require("../../logger");

module.exports = (dataToValidate: IDataValidationObject[], path: string): void => {
    const isNotValid: boolean = dataToValidate.map(valueToValidate => valueToValidate
        .validations
        .map(validation => {
            const { value, options } = valueToValidate;

            switch (validation) {
                case ValidationTypesEnum.NOT_BLANK:
                    return (typeof value === "string" && value.length === 0) ||
                        typeof value !== "string";
                case ValidationTypesEnum.MIN_LENGTH:
                    return (typeof value === "string" && typeof options?.minLength === "number" && value.length < options.minLength) ||
                        typeof value !== "string" ||
                        typeof options?.minLength !== "number";
                case ValidationTypesEnum.MAX_LENGTH:
                    return (typeof value === "string" && typeof options?.maxLength === "number" && value.length > options.maxLength) ||
                        typeof value !== "string" ||
                        typeof options?.maxLength !== "number";
                case ValidationTypesEnum.REGEX:
                    return (typeof value === "string" && options?.regex instanceof RegExp && !options?.regex?.test(value)) ||
                        typeof value !== "string" ||
                        !(options?.regex instanceof RegExp);
                default:
                    return false;
            }
        })
        .some(v => v))
        .some(v => v);

    if (isNotValid) {
        throw new Error(
            AppLogger.stringifyToThrow(
                AppLogger.messages.requestBodyDataValidationError(path)
            ));
    }
}