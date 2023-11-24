import ICreateUserRequestBody from "./ICreateUserRequestBody";
import IUpdateUserRequestBody from "./IUpdateUserRequestBody";
import IUserRoleServiceResponse from "./IUserRoleServiceResponse";
import IUsersByTypeServiceResponse from "./IUsersByTypeServiceResponse";
import ICreatePaymentRequestBody from "./ICreatePaymentRequestBody";
import IConfirmPaymentRequestBody from "./IConfirmPaymentRequestBody";
import ICreatePaymentServiceBasicResponse from "./ICreatePaymentServiceBasicResponse";
import ICreatePaymentServiceComplementaryResponse from "./ICreatePaymentServiceComplementaryResponse";

type ICreatePaymentServiceResponse = ICreatePaymentServiceBasicResponse & ICreatePaymentServiceComplementaryResponse

export {
    ICreateUserRequestBody,
    IUpdateUserRequestBody,
    IUserRoleServiceResponse,
    IUsersByTypeServiceResponse,
    ICreatePaymentRequestBody,
    IConfirmPaymentRequestBody,
    ICreatePaymentServiceBasicResponse,
    ICreatePaymentServiceComplementaryResponse
}

export type {
    ICreatePaymentServiceResponse
}