import {HydratedDocument} from "mongoose";
import Stripe from 'stripe';
import {
  PAYMENT_INTENT_DEFAULT_PARAMS,
  SETUP_INTENT_DEFAULT_PARAMS,
  SETUP_INTENTS_LIST_DEFAULT_PARAMS,
  STRIPE_DEFAULT_PARAMS
} from "../constants/payment";
import {ICreatePaymentServiceRequestBody, IDonationItem, IManagePaymentServiceResponse} from "../models/routes";
import {
  DocumentNotCreated,
  DocumentNotUpdated, StripeFetchFailed,
  StripePaymentFailed,
  StripePublishableKeyNotFound
} from "../errors/custom";
import {IDonationSchema} from "../models/schema";
import {Donation} from "../schema";
import { ILastSetupCardResponse } from "../models/routes";
import {ASTERISK, EMPTY_SEPARATOR, MONTH_PREFIX, SLASH_SEPARATOR, SPACE_SEPARATOR} from "../constants/app";

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
  getLastCard: async (): Promise<ILastSetupCardResponse | null> => stripe.setupIntents
    .list(SETUP_INTENTS_LIST_DEFAULT_PARAMS)
    .then((setupIntent: Stripe.Response<Stripe.ApiList<Stripe.SetupIntent>>) => {
      const setupIntents: Stripe.SetupIntent[] = setupIntent.data;

      if (setupIntents.length == 0)
        return null;

      const paymentMethod: Stripe.PaymentMethod = setupIntents[0]
        .payment_method as Stripe.PaymentMethod;

      const { card: paymentCard } = paymentMethod;

      if (!paymentCard)
        return null;

      const { last4: cardLast4Digits, exp_year: cardExpiryYear,
        exp_month } = paymentCard;

      let cardExpiryMonth: string = exp_month.toString();

      if (cardExpiryMonth.length === 1)
        cardExpiryMonth = MONTH_PREFIX.concat(cardExpiryMonth);

      const arrayOfFour: unknown[] = Array.from({ length: 4 });

      return {
        hiddenCardNumber: arrayOfFour
          .map((_v, k) => {
            if (k == 3)
              return cardLast4Digits;

            return arrayOfFour.map(() => ASTERISK)
              .join(EMPTY_SEPARATOR)
          })
          .join(SPACE_SEPARATOR),
        expiresAt: cardExpiryMonth.concat(SLASH_SEPARATOR)
          .concat(cardExpiryYear.toString()
            .substring(2))
      };
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