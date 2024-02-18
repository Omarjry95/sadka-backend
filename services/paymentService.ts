import {HydratedDocument} from "mongoose";
import Stripe from 'stripe';
import {PAYMENT_INTENT_DEFAULT_PARAMS, SETUP_INTENT_DEFAULT_PARAMS, STRIPE_DEFAULT_PARAMS} from "../constants/payment";
import {ICreatePaymentServiceRequestBody, IDonationItem, IManagePaymentServiceResponse} from "../models/routes";
import {
  DocumentNotCreated,
  DocumentNotUpdated, StripeFetchFailed,
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

// const searchCustomers = (query: string, page?: string): Stripe.ApiSearchResultPromise<Stripe.Customer> => stripe.customers
//   .search({
//     query,
//     limit: 100,
//     page
//   });

const paymentService = {
  getLastCard: async (): Promise<Stripe.ApiSearchResultPromise<Stripe.Customer>> => stripe.customers
    .search({
      query: 'email:\'omarjry9@gmail.com\'',
      limit: 100
    }),
  createDonation: async (d: IDonationItem) => {
    try {
      const donation: HydratedDocument<IDonationSchema> = new Donation(d);

      await donation.save();
    } catch (e) {
      throw new DocumentNotCreated(Donation.modelName);
    }
  },
  createPayment: async (payment: ICreatePaymentServiceRequestBody): Promise<IManagePaymentServiceResponse> => stripe.paymentIntents.create({
    ...PAYMENT_INTENT_DEFAULT_PARAMS,
    amount: payment.amount * 100,
    payment_method: payment.paymentMethodId,
    customer: payment.customerId
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
  savePaymentMethod: async (paymentMethodId: string, email: string): Promise<string> => {
    const customers: Stripe.Response<Stripe.ApiList<Stripe.Customer>> = await stripe.customers.list({
      email,
      limit: 1
    }).catch(() => {
      throw new StripeFetchFailed();
    });

    let customerId: string | undefined;

    if (customers.data.length > 0)
      customerId = customers.data[0].id;
    else {
      const customer: Stripe.Response<Stripe.Customer> = await stripe.customers.create({
        email
      });

      customerId = customer.id;
    }

    await stripe.setupIntents.create({
      ...SETUP_INTENT_DEFAULT_PARAMS,
      payment_method: paymentMethodId,
      customer: customerId
    }).catch(() => {
      throw new StripePaymentFailed();
    });

    return customerId;
  },
  getStripePublishableKey: (): string => {
    if (!STRIPE_PUBLISHABLE_KEY)
      throw new StripePublishableKeyNotFound();

    return STRIPE_PUBLISHABLE_KEY;
  }
}

export default paymentService;