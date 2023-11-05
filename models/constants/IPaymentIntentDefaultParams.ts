import Stripe from "stripe";

export interface IPaymentIntentDefaultParams {
  currency: string,
  confirm: boolean,
  use_stripe_sdk: boolean,
  automatic_payment_methods: Stripe.PaymentIntentCreateParams.AutomaticPaymentMethods
}