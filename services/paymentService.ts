var AppLogger = require("../logger");

const { STRIPE_PUBLISHABLE_KEY } = process.env;

module.exports = {
  getStripePublishableKey: (): string => {
    if (STRIPE_PUBLISHABLE_KEY) {
      return STRIPE_PUBLISHABLE_KEY;
    }

    throw new Error(
      AppLogger.stringifyToThrow(
        AppLogger.messages.stripePublishableKeyDoesNotExist()))
  }
}