import {IPaymentIntentDefaultParams, IStripeDefaultParams} from "../../models/constants";

const STRIPE_DEFAULT_PARAMS: IStripeDefaultParams = {
  typescript: true
}

const PAYMENT_INTENT_DEFAULT_PARAMS: IPaymentIntentDefaultParams = {
  currency: "eur",
  confirm: true,
  // confirmation_method: "manual",
  use_stripe_sdk: true,
  automatic_payment_methods: {
    enabled: true,
    allow_redirects: 'never'
  }
}

export {
  STRIPE_DEFAULT_PARAMS,
  PAYMENT_INTENT_DEFAULT_PARAMS
}