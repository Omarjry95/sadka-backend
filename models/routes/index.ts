import ICreateUserRequestBody from "./ICreateUserRequestBody";
import IUpdateUserRequestBody from "./IUpdateUserRequestBody";
import IUserRoleServiceResponse from "./IUserRoleServiceResponse";
import IUsersByTypeServiceResponse from "./IUsersByTypeServiceResponse";
import ICreatePaymentRequestBody from "./ICreatePaymentRequestBody";
import IConfirmPaymentRequestBody from "./IConfirmPaymentRequestBody";
import ICreatePaymentServiceBasicResponse from "./ICreatePaymentServiceBasicResponse";
import ICreatePaymentServiceComplementaryResponse from "./ICreatePaymentServiceComplementaryResponse";
import IUpdateUserServiceRequestBody from "./IUpdateUserServiceRequestBody";
import IRoleItem from "./IRoleItem";
import IRoundingItem from "./IRoundingItem";

type ICreatePaymentServiceResponse = ICreatePaymentServiceBasicResponse & ICreatePaymentServiceComplementaryResponse

export {
    ICreateUserRequestBody,
    IUpdateUserRequestBody,
    IUpdateUserServiceRequestBody,
    IUserRoleServiceResponse,
    IUsersByTypeServiceResponse,
    ICreatePaymentRequestBody,
    IConfirmPaymentRequestBody,
    ICreatePaymentServiceBasicResponse,
    ICreatePaymentServiceComplementaryResponse,
    IRoleItem,
    IRoundingItem
}

export type {
    ICreatePaymentServiceResponse
}