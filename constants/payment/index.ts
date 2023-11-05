import {constants} from "../../models";

const STRIPE_DEFAULT_PARAMS: constants.IStripeDefaultParams = {
  typescript: true
}

const PAYMENT_INTENT_DEFAULT_PARAMS: constants.IPaymentIntentDefaultParams = {
  currency: "eur",
  confirm: true,
  // confirmation_method: "manual",
  use_stripe_sdk: true,
  automatic_payment_methods: {
    enabled: true,
    allow_redirects: 'never'
  }
}

module.exports = {
  STRIPE_DEFAULT_PARAMS,
  PAYMENT_INTENT_DEFAULT_PARAMS
}