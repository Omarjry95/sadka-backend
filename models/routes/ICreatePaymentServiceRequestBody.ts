interface ICreatePaymentServiceRequestBody {
  amount: number,
  paymentMethodId: string,
  customerId?: string
}

export default ICreatePaymentServiceRequestBody;