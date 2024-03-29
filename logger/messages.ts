import AppMessage from "../logger/AppMessage";
import {COMMA_SEPARATOR, SPACE_SEPARATOR} from "../constants/app";

const serverRunning = () => {
  const appMessage = new AppMessage();

  appMessage.logables = [
    [
      "Sadka-backend is",
      "running".green,
      "on port:",
      "3000".green
    ].join(" ")
  ];

  return appMessage;
};

const databaseConnected = () => {
  const appMessage = new AppMessage();

  appMessage.logables = [
    [
      "MongoDB Database".green,
      "is",
      "connected".green,
      "successfully."
    ].join(" ")
  ];

  return appMessage;
};

const firebaseInitialized = () => {
  const appMessage = new AppMessage();

  appMessage.logables = [
    [
      "Firebase Service Account".green,
      "has been initialized successfully."
    ].join(" ")
  ];

  return appMessage;
};

const requestSuccess = (path: string) => {
  const appMessage = new AppMessage();

  appMessage.logables = [
    [
      "Success:".green,
      new Date()
    ],
    [
      "Request for",
      path.green,
      "has been done successfully."]
  ].map(m => m.join(" "));

  return appMessage;
};

const authSuccess = (path: string) => {
  const appMessage = new AppMessage();

  appMessage.logables = [
    [
      "User".green,
      "has been",
      "authenticated".green,
      "successfully for usage of the endpoint:",
      path.green
    ].join(" ")
  ];

  return appMessage;
};

const fetchSuccess = (model: string) => {
  const appMessage = new AppMessage();

  appMessage.observable = [
    "Requested documents of model",
    model,
    "have been fetched successfully."
  ].join(" ");

  return appMessage;
};

const documentCreated = (model: string) => {
  const appMessage = new AppMessage();

  appMessage.observable = [
    "Document of model",
    model,
    "has been created successfully."
  ].join(" ");

  return appMessage;
};

const documentUpdated = (model: string) => {
  const appMessage = new AppMessage();

  appMessage.observable = [
    "Document of model",
    model,
    "has been updated successfully."
  ].join(" ");

  return appMessage;
};

const seedsInserted = (model: string) => {
  const appMessage = new AppMessage();

  appMessage.logables = [
    [
      "Seeds".green,
      "for",
      model.green,
      "model have been",
      "inserted".green,
      "successfully."
    ].join(" ")
  ];

  return appMessage;
};

const verificationLinkGenerated = () => {
  const appMessage = new AppMessage();

  appMessage.logables = [
    [
      "The Firebase email",
      "verification link".green,
      "has been",
      "generated successfully".green
    ].join(" ")
  ];

  return appMessage;
};

const mailSent = () => {
  const appMessage = new AppMessage();

  appMessage.observable = "The email has been sent successfully.";

  return appMessage;
};

const mailSendingFailed = (emailAddresses: string[]) => {
  const appMessage = new AppMessage();

  appMessage.logables = [
    [
      "An",
      "error".red,
      "has occured while trying to",
      "send an e-mail".red,
      "to the following address:",
      emailAddresses.join(COMMA_SEPARATOR.concat(SPACE_SEPARATOR)).red
    ].join(" ")
  ];

  return appMessage;
}

export {
  // serverRunning: (): string[] => ["Sadka-backend is ".white + "running".green + " on port: ".white + "3000".green],
  // databaseConnected: (): string[] => ["MongoDB Database".green + " is connected successfully.".white],
  // databaseConnectionAbandoned: (): string[] => ["Error: ".red + "The server is unable to establish a connection to the MongoDB database.".white],
  // firebaseInitialized: (): string[] => ["Firebase Service Account".green + " has been initialized successfully.".white],
  // firebaseInitializationFailed: (): string[] => ["Error: ".red + "The Firebase Service Account is unable to initialize.".white],
  // requestSuccess: (message: string, path: string): string[] => [
  //     message,
  //     "Success: ".green + new Date(),
  //     "Request for ".white + path.green + " has been done successfully".white
  // ],
  // requestError: (message: string, path: string): string[] => [
  //     "Error: ".red + new Date(),
  //     "When requesting: ".red + path,
  //     "With error message: ".red + message
  // ],
  // routeLostError: (path: string): string[] => [
  //     "Requesting route ".white + path.red + " is 404 ".white + "not found.".red
  // ],
  // // SCHEMA_VALIDATION_ERROR,
  // requestBodyValidationError: (path: string): string[] => ["Runtime type validation".red + " for body of request ".white + path.red + " has failed".red],
  // requestBodyDataValidationError: (path: string): string[] => ["Data validation".red + " for body of request ".white + path.red + " has failed".red],
  // userAuthSuccess: (path: string): string[] => ["User".green + " has been " + "authenticated successfully".green + " for usage of this endpoint: " + path.green],
  // userAuthError: (path: string): string[] => ["User authentication".red + " was " + "rejected".red + " while trying to use this endpoint: " + path.red],
  // dataFetchedSuccess: (model: string): string[] => ["Requested documents of model ".white + model.green + " has been ".white + "fetched".green +
  //     " successfully".white],
  // documentCreatedSuccess: (model: string): string[] => ["Document of model ".white + model.green + " has been ".white + "created".green +
  //     " successfully".white],
  // documentUpdatedSuccess: (model: string): string[] => ["Document of model ".white + model.green + " has been ".white + "updated".green +
  // " successfully".white],
  // // DOCUMENT_NOT_FOUND,
  // documentNotCreated: (model: string): string[] => ["Model ".white + model.red + " could not be created."],
  // mailSendingSuccess: (emailAddresses: string[]): string[] => ["The ".white + "email".green + " has been ".white + "sent successfully".green +
  //     " to the following address: ".white + emailAddresses.join(", ").green],
  // mailSendingError: (emailAddresses: string[]): string[] => ["An ".white + "error".red + " has occured while trying to ".white + "send an e-mail".red +
  //     " to the following address: ".white + emailAddresses.join(", ").red],
  // // firebaseUserNotFound: (): string[] => ["Firebase ".white + "User".red + " was ".white + "not found".red],
  // firebaseUserNotCreated: (): string[] => ["User has failed".red + " to add to ".white + "Firebase".red],
  // firebaseEmailVerificationLinkGeneratedSuccess: (): string[] => ["The ".white + "Firebase email verification link".green + " has been generated ".white +
  //     "successfully".green],
  // firebaseEmailVerificationLinkGeneratedError: (): string[] => ["The ".white + "firebase email verification link".red + " has ".white + "failed to generate".red],
  // // USER_WITH_SAME_ID_EXISTS,
  // // firebaseUserWithSameEmailExists: (): string[] => ["A user with the same email".red + " you provided ".white + "already exists".red +
  // //     " in our ".white + "firebase".red + " database.".white],
  // stripePaymentNotForwarded: (): string[] => ["The ".white + "Stripe payment operation".red + " has returned ".white + "an error.".red],
  // stripePublishableKeyDoesNotExist: (): string[] => ["The ".white + "Stripe publishable key".red + " is ".white + "not configured".red +
  //     " as an environment variable.".white],
  serverRunning,
  databaseConnected,
  firebaseInitialized,
  requestSuccess,
  authSuccess,
  fetchSuccess,
  documentCreated,
  documentUpdated,
  seedsInserted,
  mailSent,
  mailSendingFailed,
  verificationLinkGenerated
};