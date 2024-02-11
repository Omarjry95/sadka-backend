import {HydratedDocument} from "mongoose";
import Stripe from 'stripe';
import {PAYMENT_INTENT_DEFAULT_PARAMS, STRIPE_DEFAULT_PARAMS} from "../constants/payment";
import {ICreatePaymentServiceRequestBody, IDonationItem, IManagePaymentServiceResponse} from "../models/routes";
import {
  DocumentNotCreated,
  DocumentNotUpdated,
  StripePaymentFailed,
  StripePublishableKeyNotFound
} from "../errors/custom";
import {IDonationSchema} from "../models/schema";
import {Donation} from "../schema";

const { STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY } = process.env;

const stripe = new Stripe(STRIPE_SECRET_KEY as string, STRIPE_DEFAULT_PARAMS);

const getResponseByPaymentIntentStatus = (paymentIntent: Stripe.PaymentIntent, clientSecret?: string): IManagePaymentServiceResponse => {

  const { id, status } = paymentIntent;

  const data: IManagePaymentServiceResponse = {
    success: true,
    paymentIntent: id
  };

  switch (status) {
    case 'requires_action':
      return {
        ...data,
        success: false,
        requiresAction: true,
        clientSecret
      }
    case 'processing':
    case 'succeeded':
      return data;
    default:
      throw new StripePaymentFailed();
  }
};

const paymentService = {
  createDonation: async (d: IDonationItem) => {
    try {
      const donation: HydratedDocument<IDonationSchema> = new Donation(d);

      await donation.save();
    } catch (e) {
      console.log(e);
      throw new DocumentNotCreated(Donation.modelName);
    }
  },
  createPayment: async (payment: ICreatePaymentServiceRequestBody): Promise<IManagePaymentServiceResponse> => stripe.paymentIntents.create({
    ...PAYMENT_INTENT_DEFAULT_PARAMS,
    amount: payment.amount * 100,
    payment_method: payment.paymentMethodId
  })
    .then((paymentIntent) => getResponseByPaymentIntentStatus(paymentIntent))
    .catch((e) => {
      console.log(e);
      throw new StripePaymentFailed();
    }),
  confirmDonation: async (id: string) => Donation.findById(id)
    .then((donation) => {
      if (!donation)
        throw new Error();

      donation.success = true;

      return donation.save();
    })
    .catch(() => {
      throw new DocumentNotUpdated(Donation.modelName);
    }),
  confirmPayment: (paymentIntentId: string): Promise<IManagePaymentServiceResponse> => stripe.paymentIntents.confirm(paymentIntentId)
    .then((result) => getResponseByPaymentIntentStatus(result))
    .catch(() => {
      throw new StripePaymentFailed();
    }),
  getStripePublishableKey: (): string => {
    if (!STRIPE_PUBLISHABLE_KEY)
      throw new StripePublishableKeyNotFound();

    return STRIPE_PUBLISHABLE_KEY;
  }
}

export default paymentService;