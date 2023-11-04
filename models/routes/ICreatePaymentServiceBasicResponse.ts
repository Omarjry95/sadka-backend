import {ICreatePaymentServiceComplementaryResponse} from "./ICreatePaymentServiceComplementaryResponse";

export interface ICreatePaymentServiceBasicResponse {
  success: boolean,
  requiresAction?: boolean
  clientSecret?: string
}

export type ICreatePaymentServiceResponse = ICreatePaymentServiceBasicResponse & ICreatePaymentServiceComplementaryResponse;