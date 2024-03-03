import {IPaymentIntentDefaultParams} from "../../models/constants";
import Stripe from "stripe";

const STRIPE_DEFAULT_PARAMS: Stripe.StripeConfig = {
  typescript: true,
  // Always check the changelog of Stripe to make sure you are using the latest version
  apiVersion: '2023-08-16'
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

const SETUP_INTENT_DEFAULT_PARAMS: Stripe.SetupIntentCreateParams = {
  payment_method_types: ['card'],
  confirm: true
}

const SETUP_INTENTS_LIST_DEFAULT_PARAMS: Stripe.SetupIntentListParams = {
  limit: 1,
  expand: ["data.payment_method"]
}

export {
  STRIPE_DEFAULT_PARAMS,
  PAYMENT_INTENT_DEFAULT_PARAMS,
  SETUP_INTENT_DEFAULT_PARAMS,
  SETUP_INTENTS_LIST_DEFAULT_PARAMS
}