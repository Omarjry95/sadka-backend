import express, {Locals, NextFunction, Request, Response, Router} from "express";
import {ICreatePaymentRequestBody} from "../models/routes/ICreatePaymentRequestBody";
import {ICreatePaymentServiceResponse} from "../models/routes/ICreatePaymentServiceBasicResponse";
import {IConfirmPaymentRequestBody} from "../models/routes/IConfirmPaymentRequestBody";

var router: Router = express.Router();
var AppLogger = require("../logger");
var PaymentService = require('../services/paymentService');
var authenticateFirebaseUser = require("../middlewares/firebase-auth");
var send = require('../handlers/send-response');

router.post('/', authenticateFirebaseUser, (req: Request<any, any, ICreatePaymentRequestBody>, res: Response, next: NextFunction) => {

  const { originalAmount, association, paymentMethodId, note } = req.body;

  PaymentService.createPayment(originalAmount, paymentMethodId)
    .then(async (stripePaymentResult: ICreatePaymentServiceResponse): Promise<ICreatePaymentServiceResponse> => {
      await PaymentService.createDonation({
        _id: stripePaymentResult.paymentIntent,
        originalAmount,
        association,
        note,
        success: stripePaymentResult.success
      });

      return stripePaymentResult;
    })
    .then((stripePaymentResult: ICreatePaymentServiceResponse) => {
      const { success, requiresAction, clientSecret } = stripePaymentResult;

      const response: Locals = {
        status: 200,
        message: AppLogger.messages.documentCreatedSuccess("Donation")[0],
        body: {
          success,
          requiresAction,
          clientSecret
        }
      }

      send(response, res, next);
    })
    .catch(next);

  // else if (!originalAmount && !paymentMethodId && paymentIntentId) {
  //   stripePaymentResult = await PaymentService.confirmPayment(paymentIntentId);
  // }
});

router.post('/confirm', authenticateFirebaseUser, (req: Request<any, any, IConfirmPaymentRequestBody>, res: Response, next: NextFunction) => {

  const { paymentIntentId } = req.body;

  PaymentService.confirmPayment(paymentIntentId)
    .then(async (stripePaymentResult: ICreatePaymentServiceResponse) => {
      await PaymentService.confirmPayment(paymentIntentId)

      return stripePaymentResult;
    })
    .then((stripePaymentResult: ICreatePaymentServiceResponse) => {
    const { success, requiresAction, clientSecret } = stripePaymentResult;

    const response: Locals = {
      status: 200,
      message: AppLogger.messages.documentUpdatedSuccess("Donation")[0],
      body: {
        success,
        requiresAction,
        clientSecret
      }
    }

    send(response, res, next);
  })
});

router.get('/publishable-key', authenticateFirebaseUser, (req: Request, res: Response, next: NextFunction) => {
  try {
    const response: Locals = {
      status: 200,
      message: AppLogger.messages.dataFetchedSuccess("Stripe Key")[0],
      body: {
        stripePublishableKey: PaymentService.getStripePublishableKey()
      }
    }

    send(response, res, next);
  }
  catch (e: any) {
    next(e);
  }
});

export default router;