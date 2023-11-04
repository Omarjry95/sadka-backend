export interface ICreatePaymentRequestBody {
  originalAmount: number,
  association: string,
  paymentMethodId: string,
  // paymentIntentId: union([string, optional]),
  note?: string
}