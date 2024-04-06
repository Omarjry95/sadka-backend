import * as express from "express";
import {NextFunction, Response, Request} from "express";
import authenticateFirebaseUser from "../middlewares/firebase-auth";
import {IConfirmPaymentRequestBody, ICreatePaymentRequestBody, IManagePaymentServiceResponse} from "../models/routes";
import {PaymentService, RoundingService, StoreService, UserService} from "../services";
import * as messages from "../logger/messages";
import send from "../handlers/success";
import {Donation} from "../schema";
import {IUserSchema} from "../models/schema";

var router = express.Router();

router.post('/', authenticateFirebaseUser, async (req: Request<any, any, ICreatePaymentRequestBody>,
                                                  res: Response, next: NextFunction) => {

  const { body, userId = '', userEmail = '' } = req;

  const { store , originalAmount, rounding, association,
    paymentMethodId = '', note, savePaymentMethod } = body;

  const user: IUserSchema = await UserService.getUserById(userId);

  let customerId: string | undefined;

  if (savePaymentMethod)
    customerId = await PaymentService.savePaymentMethod(paymentMethodId, userEmail);

  let amount = originalAmount;

  const roundingItem = await RoundingService.getRoundingById(rounding);

  console.log('Amount: ' + amount);

  if (roundingItem)
    amount = PaymentService.calculatePaymentAmount(amount, roundingItem.power);

  console.log('Amount: ' + amount);

  PaymentService.createPayment({
    amount,
    paymentMethodId,
    customerId
  })
    .then(async (result: IManagePaymentServiceResponse): Promise<IManagePaymentServiceResponse> => {
      const storeItem = await StoreService.getStoreById(store);

      await PaymentService.createDonation({
        _id: result.paymentIntent,
        user: user._id,
        amount: amount !== originalAmount ? parseFloat((amount - originalAmount).toFixed(2)) : amount,
        productAmount: amount !== originalAmount ? originalAmount : undefined,
        rounding: roundingItem?._id,
        association,
        store: storeItem?._id,
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
    const { success } = result;

    const payload = {
      message: messages.documentUpdated(Donation.modelName).observable,
      body: {
        success
      }
    }

    send(res, payload, req.originalUrl);
  })
});

router.get('/lastSetupCard', (req: Request, res: Response, next: NextFunction) => {
  PaymentService.getLastCard()
    .then((data) => {
      const payload = {
        message: messages.fetchSuccess("Card").observable,
        body: data
      }

      send(res, payload, req.originalUrl);
    })
});

router.get('/publishable-key', authenticateFirebaseUser, (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = {
      message: messages.fetchSuccess("Stripe Key").observable,
      body: {
        stripePublishableKey: PaymentService.getStripePublishableKey()
      }
    }

    send(res, payload, req.originalUrl);
  }
  catch (e: any) {
    next(e);
  }
});

export default router;