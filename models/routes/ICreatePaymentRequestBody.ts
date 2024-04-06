interface ICreatePaymentRequestBody {
  store?: string,
  originalAmount: number,
  rounding?: string,
  association: string,
  paymentMethodId?: string,
  note?: string,
  savePaymentMethod: boolean
}

export default ICreatePaymentRequestBody;