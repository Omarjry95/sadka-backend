import {ValidationTypesEnum} from "./ValidationTypesEnum";
import {IDataValidationOptions} from "./IDataValidationOptions";

export interface IDataValidationObject {
    value: any,
    validations: ValidationTypesEnum[],
    options?: IDataValidationOptions
}