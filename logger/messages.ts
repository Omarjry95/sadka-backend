module.exports = {
    serverRunning: (): string[] => ["Sadka-backend is ".white + "running".green + " on port: ".white + "3000".green],
    databaseConnected: (): string[] => ["MongoDB Database".green + " is connected successfully.".white],
    databaseConnectionAbandoned: (): string[] => ["Error: ".red + "The server is unable to establish a connection to the MongoDB database.".white],
    firebaseInitialized: (): string[] => ["Firebase Service Account".green + " has been initialized successfully.".white],
    firebaseInitializationFailed: (): string[] => ["Error: ".red + "The Firebase Service Account is unable to initialize.".white],
    requestSuccess: (message: string, path: string): string[] => [
        message,
        "Success: ".green + new Date(),
        "Request for ".white + path.green + " has been done successfully".white
    ],
    requestError: (message: string, path: string): string[] => [
        "Error: ".red + new Date(),
        "When requesting: ".red + path,
        "With error message: ".red + message
    ],
    routeLostError: (path: string): string[] => [
        "Requesting route ".white + path.red + " is 404 ".white + "not found.".red
    ],
    schemaValidationError: (model: string, messages: string[]): string[] => [
        "Error: ".red + new Date(),
        "Schema validation for model ".white + model.red + " has exited with these error messages:".white,
        ...messages.map((message: string) => "\t" + message.red)
    ],
    requestBodyValidationError: (path: string): string[] => ["Runtime type validation".red + " for body of request ".white + path.red + " has failed".red],
    requestBodyDataValidationError: (path: string): string[] => ["Data validation".red + " for body of request ".white + path.red + " has failed".red],
    userAuthSuccess: (path: string): string[] => ["User".green + " has been " + "authenticated successfully".green + " for usage of this endpoint: " + path.green],
    userAuthError: (path: string): string[] => ["User authentication".red + " was " + "rejected".red + " while trying to use this endpoint: " + path.red],
    dataFetchedSuccess: (model: string): string[] => ["Requested documents of model ".white + model.green + " has been ".white + "fetched".green +
        " successfully".white],
    documentCreatedSuccess: (model: string): string[] => ["Document of model ".white + model.green + " has been ".white + "created".green +
        " successfully".white],
    documentDoesNotExist: (model: string): string[] => ["No document".red + " for the ".white + model.red +
    " with the criteria you provided has been found.".white
    ],
    documentNotCreated: (model: string): string[] => ["Model ".white + model.red + " could not be created."],
    mailSendingSuccess: (emailAddresses: string[]): string[] => ["The ".white + "email".green + " has been ".white + "sent successfully".green +
        " to the following address: ".white + emailAddresses.join(", ").green],
    mailSendingError: (emailAddresses: string[]): string[] => ["An ".white + "error".red + " has occured while trying to ".white + "send an e-mail".red +
        " to the following address: ".white + emailAddresses.join(", ").red],
    firebaseUserNotCreated: (): string[] => ["User has failed".red + " to add to ".white + "Firebase".red],
    userWithSameIdExists: (): string[] => ["A user with the same ID".red + " you provided ".white + "already exists".red + " in our database.".white],
    firebaseUserWithSameEmailExists: (): string[] => ["A user with the same email".red + " you provided ".white + "already exists".red +
        " in our ".white + "firebase".red + " database.".white],
    seedsInserted: (model: string): string[] => ["Seeds".green + " for ".white + model.green + " have been inserted seccessfully.".white]
};