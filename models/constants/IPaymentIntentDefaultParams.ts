import Stripe from "stripe";

interface IPaymentIntentDefaultParams {
  currency: string,
  confirm: boolean,
  use_stripe_sdk: boolean,
  automatic_payment_methods: Stripe.PaymentIntentCreateParams.AutomaticPaymentMethods
}

export default IPaymentIntentDefaultParams;