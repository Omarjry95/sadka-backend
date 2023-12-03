import express, {Locals, NextFunction, Request, Response, Router} from "express";
import authenticateFirebaseUser from "../middlewares/firebase-auth";
import {IConfirmPaymentRequestBody, ICreatePaymentRequestBody, IManagePaymentServiceResponse} from "../models/routes";
import {PaymentService} from "../services";
import * as messages from "../logger/messages";
import send from "../handlers/success";
import {Donation} from "../schema";

var router: Router = express.Router();

router.post('/', authenticateFirebaseUser, (req: Request<any, any, ICreatePaymentRequestBody>, res: Response, next: NextFunction) => {

  const { originalAmount, association, paymentMethodId, note } = req.body;

  PaymentService.createPayment({
    amount: originalAmount,
    paymentMethodId
  })
    .then(async (result: IManagePaymentServiceResponse): Promise<IManagePaymentServiceResponse> => {
      await PaymentService.createDonation({
        _id: result.paymentIntent,
        originalAmount,
        association,
        note,
        success: result.success
      });

      return result;
    })
    .then((result: IManagePaymentServiceResponse) => {

      const { paymentIntent, ...body } = result;

      const payload = {
        message: messages.documentCreated(Donation.modelName).observable,
        body
      }

      send(res, payload, req.originalUrl);
    })
    .catch(next);
});

router.post('/confirm', authenticateFirebaseUser, (req: Request<any, any, IConfirmPaymentRequestBody>, res: Response, next: NextFunction) => {

  const { paymentIntentId } = req.body;

  PaymentService.confirmPayment(paymentIntentId)
    .then(async (result: IManagePaymentServiceResponse) => {
      await PaymentService.confirmDonation(paymentIntentId)

      return result;
    })
    .then((result: IManagePaymentServiceResponse) => {
    const { paymentIntent, ...body } = result;

    const payload = {
      message: messages.documentUpdated(Donation.modelName).observable,
      body
    }

    send(res, payload, req.originalUrl);
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