import {ICreatePaymentServiceResponse} from "../models/routes/ICreatePaymentServiceBasicResponse";
import {HydratedDocument} from "mongoose";
import {IDonationSchema} from "../models/schema/IDonationSchema";
import {ICreatePaymentServiceComplementaryResponse} from "../models/routes/ICreatePaymentServiceComplementaryResponse";
import Stripe from 'stripe';

var AppLogger = require("../logger");
const Donation = require("../schema/Donation");
var { stripeDefaultParams, paymentIntentDefaultParams } = require("../constants/payment");

const { STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY } = process.env;

const stripe: Stripe = new Stripe(STRIPE_SECRET_KEY as string, stripeDefaultParams);

module.exports = {
  createDonation: async (d: IDonationSchema) => {
    try {
      const donation: HydratedDocument<IDonationSchema> = new Donation(d);

      await donation.save();
    } catch (e) {
      throw new Error(
        AppLogger.stringifyToThrow(
          AppLogger.messages.documentNotCreated("Donation")
        ));
    }
  },
  createPayment: async function (amount: number, payment_method: string): Promise<ICreatePaymentServiceResponse> {
    const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create({
      ...paymentIntentDefaultParams,
      amount: amount * 100,
      payment_method
    });

    return this.getResponseByPaymentIntentStatus(paymentIntent);
  },
  confirmDonation: async (id: string) => {
    try {
      const donation: IDonationSchema | null = await Donation.findById(id);

      if (donation) {
        donation.success = true;

        await donation.save();
      } else {
        throw new Error();
      }
    } catch (e) {
      throw new Error(
        AppLogger.stringifyToThrow(
          AppLogger.messages.documentDoesNotExist("Donation")
        ));
    }
  },
  confirmPayment: async function (paymentIntentId: string): Promise<ICreatePaymentServiceResponse> {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);

    return this.getResponseByPaymentIntentStatus(paymentIntent);
  },
  getStripePublishableKey: (): string => {
    if (STRIPE_PUBLISHABLE_KEY) {
      return STRIPE_PUBLISHABLE_KEY;
    }

    throw new Error(
      AppLogger.stringifyToThrow(
        AppLogger.messages.stripePublishableKeyDoesNotExist()))
  },
  getResponseByPaymentIntentStatus: (paymentIntent: Stripe.PaymentIntent, clientSecret?: string): ICreatePaymentServiceResponse => {

    const complementaryData: ICreatePaymentServiceComplementaryResponse = {
      paymentIntent: paymentIntent.id
    };

    switch (paymentIntent.status) {
      case 'requires_action':
        return {
          success: false,
          requiresAction: true,
          clientSecret,
          ...complementaryData
        }
      case 'processing':
      case 'succeeded':
        return {
          success: true,
          ...complementaryData
        }
      default:
        throw new Error(
          AppLogger.stringifyToThrow(
            AppLogger.messages.stripePaymentNotForwarded()))
    }
  }
}