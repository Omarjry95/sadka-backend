import {Error} from "mongoose";

module.exports = (validation: Error.ValidationError | null): string[] => {
    let messages: string[] = [];

    if (validation) {
        let validationErrors: { [p: string]: Error.ValidatorError | Error.CastError } = validation.errors;

        Object.keys(validationErrors)
            .forEach((field: string) => messages.push(validationErrors[field].toString()))
    }

    return messages;
}