import express, {Locals, NextFunction, Request, Response, Router} from "express";
import {TypeOf} from "io-ts";
import {ICreatePaymentRequestBody} from "../models/routes/ICreatePaymentRequestBody";
import {ICreatePaymentServiceResponse} from "../models/routes/ICreatePaymentServiceResponse";
import {IDataValidationObject} from "../models/app/IDataValidationObject";
import {ValidationTypesEnum} from "../models/app/ValidationTypesEnum";

var router: Router = express.Router();
var AppLogger = require("../logger");
var PaymentService = require('../services/paymentService');
var authenticateFirebaseUser = require("../middlewares/firebase-auth");
var performRequestBodyValidation = require("../handlers/request-body-validation");
var performRequestBodyDataValidation = require("../handlers/request-body-data-validation");
var send = require('../handlers/send-response');

router.post('/', authenticateFirebaseUser, async (req: Request<any, any, TypeOf<typeof ICreatePaymentRequestBody>>, res: Response, next: NextFunction) => {

  const { body, originalUrl } = req;
  const { amount, paymentMethodId, paymentIntentId } = body;

  try {
    performRequestBodyValidation(req, ICreatePaymentRequestBody);

    let stripePaymentResult: ICreatePaymentServiceResponse = {};

    if (amount && paymentMethodId && !paymentIntentId) {
      const dataToValidate: IDataValidationObject[] = [
        { value: amount, validations: [ValidationTypesEnum.GREATER_THAN_ZERO] },
        { value: paymentMethodId, validations: [ValidationTypesEnum.NOT_BLANK] }
      ];

      performRequestBodyDataValidation(dataToValidate, originalUrl);

      stripePaymentResult = await PaymentService.createPayment(amount, paymentMethodId);
    }
    else if (!amount && !paymentMethodId && paymentIntentId) {
      const dataToValidate: IDataValidationObject[] = [
        { value: paymentIntentId, validations: [ValidationTypesEnum.NOT_BLANK] }
      ];

      performRequestBodyDataValidation(dataToValidate, originalUrl);

      stripePaymentResult = await PaymentService.confirmPayment(paymentIntentId);
    }
    else {
      throw new Error(
        AppLogger.stringifyToThrow(
          AppLogger.messages.requestBodyDataValidationError(originalUrl)
        ));
    }

    const response: Locals = {
      status: 200,
      message: AppLogger.messages.documentCreatedSuccess("Donation")[0],
      body: stripePaymentResult
    }

    send(response, res, next);
  }
  catch (e: any) {
    console.log(e);
    next(e);
  }
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

module.exports = router;