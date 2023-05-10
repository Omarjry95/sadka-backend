import 'colors';

module.exports = {
    serverRunning: () => console.info("Sadka-backend is ".white + "running".green + " on port: ".white + "3000".green),
    databaseConnected: () => console.info("MongoDB Database".green + " is connected successfully.".white),
    databaseConnectionAbandoned: () => console.error("Error: ".red + "The server is unable to establish a connection to the MongoDB database.".white),
    requestSuccess: (message: string, path: string) => {
        console.log(message);
        console.log("Success: ".green + new Date());
        console.log("Request for ".white + path.green + " has been done successfully".white);
    },
    requestError: (message: string, path: string) => {
        console.error("Error: ".red + new Date());
        console.error("When requesting: ".red + path);
        console.error("With error message: ".red + message);
    },
    schemaValidationError: (model: string, messages: string[]) => {
        console.error("Error: ".red + new Date());
        console.error("Schema validation for model ".white + model.red + " has exited with these error messages:".white);

        messages.forEach(message => console.error("\t" + message.red));
    },
    seedsInserted: (model: string) => console.info("Seeds".green + " for ".white + model.green + " have been inserted seccessfully.".white),
    documentDoesNotExist: (model: string) => console.error("No document".red + " for the ".white + model.red +
        " with the criteria you provided has been found.".white),
    userWithSameIdExists: () => console.error("A user with the same ID".red + " you provided " + "already exists".red + " in our database.")
}