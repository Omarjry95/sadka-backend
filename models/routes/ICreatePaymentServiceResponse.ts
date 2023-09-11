export interface ICreatePaymentServiceResponse {
  success?: boolean,
  requiresAction?: boolean
  clientSecret?: string
}