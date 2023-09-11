import {number, string, type, undefined as optional, union} from "io-ts";

export const ICreatePaymentRequestBody = type({
  amount: union([number, optional]),
  paymentMethodId: union([string, optional]),
  paymentIntentId: union([string, optional])
});