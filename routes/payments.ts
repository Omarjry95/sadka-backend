import express, {Router, Response, Request, NextFunction, Locals} from "express";

var router: Router = express.Router();
var AppLogger = require("../logger");
var PaymentService = require('../services/paymentService');
var authenticateFirebaseUser = require("../middlewares/firebase-auth");
var send = require('../handlers/send-response');

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