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
    schemaValidationError: (model: string, messages: string[]): string[] => [
        "Error: ".red + new Date(),
        "Schema validation for model ".white + model.red + " has exited with these error messages:".white,
        ...messages.map((message: string) => "\t" + message.red)
    ],
    seedsInserted: (model: string): string[] => ["Seeds".green + " for ".white + model.green + " have been inserted seccessfully.".white],
    documentDoesNotExist: (model: string): string[] => ["No document".red + " for the ".white + model.red +
        " with the criteria you provided has been found.".white],
    userWithSameIdExists: (): string[] => ["A user with the same ID".red + " you provided ".white + "already exists".red + " in our database.".white],
    firebaseUserWithSameEmailExists: (): string[] => ["A user with the same email".red + " you provided ".white + "already exists".red +
        " in our ".white + "firebase".red + " database.".white]
}