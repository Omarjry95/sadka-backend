import BasicError from "../BasicError";

class StripePublishableKeyNotFound extends BasicError {
  constructor() {
    const messages: string[][] = [[
      "The",
      "Stripe publishable key".red,
      "is",
      "not configured".red,
      "as an environment variable."]];

    const message: string = "The Stripe publishable key is not configured as an environment variable.";

    super(messages, message);
  }
}

export default StripePublishableKeyNotFound;