interface IManagePaymentServiceResponse {
  success: boolean,
  requiresAction?: boolean
  clientSecret?: string,
  paymentIntent: string
}

export default IManagePaymentServiceResponse;