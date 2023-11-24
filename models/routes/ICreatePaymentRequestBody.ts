interface ICreatePaymentRequestBody {
  originalAmount: number,
  association: string,
  paymentMethodId: string,
  note?: string
}

export default ICreatePaymentRequestBody;