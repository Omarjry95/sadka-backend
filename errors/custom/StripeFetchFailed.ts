import BasicError from "../BasicError";

class StripeFetchFailed extends BasicError {

  constructor() {
    const messages: string[][] = [[
      "An",
      "error".red,
      "has occured while",
      "fetching".red,
      "data from",
      "Stripe".red,
      "."
    ]];

    const message: string = "An error has occured while fetching data from Stripe.";

    super(messages, message);
  }
}

export default StripeFetchFailed;