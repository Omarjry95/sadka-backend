interface ICreatePaymentServiceBasicResponse {
  success: boolean,
  requiresAction?: boolean
  clientSecret?: string
}

export default ICreatePaymentServiceBasicResponse;