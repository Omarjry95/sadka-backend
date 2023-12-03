import BasicError from "../BasicError";

class StripePaymentFailed extends BasicError {
  constructor() {
    const messages: string[][] = [[
      "An",
      "error".red,
      "has occured while processing",
      "the Stripe payment".red,
      "."
    ]];

    const message: string = "An error has occured while processing the Stripe payment.";

    super(messages, message);
  }
}

export default StripePaymentFailed;