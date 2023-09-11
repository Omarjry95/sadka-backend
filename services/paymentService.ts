import {ICreatePaymentServiceResponse} from "../models/routes/ICreatePaymentServiceResponse";

const Stripe = require("stripe");
var AppLogger = require("../logger");
var { stripeDefaultParams, paymentIntentDefaultParams } = require("../constants/payment");

const { STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY } = process.env;

const stripe = new Stripe(STRIPE_SECRET_KEY, stripeDefaultParams);

module.exports = {
  createPayment: async function (amount: number, paymentMethodId: string): Promise<ICreatePaymentServiceResponse> {
    const paymentIntent = await stripe.paymentIntents.create({
      ...paymentIntentDefaultParams,
      amount: amount * 100,
      payment_method: paymentMethodId
    });

    return this.getResponseByPaymentIntentStatus(paymentIntent.status);
  },
  confirmPayment: async function (paymentIntentId: string): Promise<ICreatePaymentServiceResponse> {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);

    return this.getResponseByPaymentIntentStatus(paymentIntent.status);
  },
  getStripePublishableKey: (): string => {
    if (STRIPE_PUBLISHABLE_KEY) {
      return STRIPE_PUBLISHABLE_KEY;
    }

    throw new Error(
      AppLogger.stringifyToThrow(
        AppLogger.messages.stripePublishableKeyDoesNotExist()))
  },
  getResponseByPaymentIntentStatus: (status: string, clientSecret?: string): ICreatePaymentServiceResponse => {
    switch (status) {
      case 'requires_action':
        return {
          success: false,
          requiresAction: true,
          clientSecret
        }
      case 'processing':
      case 'succeeded':
        return {
          success: true
        }
      default:
        throw new Error(
          AppLogger.stringifyToThrow(
            AppLogger.messages.stripePaymentNotForwarded()))
    }
  }
}