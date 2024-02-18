interface ICreatePaymentRequestBody {
  originalAmount: number,
  association: string,
  paymentMethodId: string,
  note?: string,
  savePaymentMethod: boolean
}

export default ICreatePaymentRequestBody;