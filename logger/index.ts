import 'colors';

module.exports = {
    serverRunning: () => console.info("Sadka-backend is ".white + "running".green + " on port: ".white + "3000".green),
    requestSuccess: (message: string, path: string) => {
        console.log(message);
        console.log("Success: ".green + new Date());
        console.log("Request for ".white + path.green + " has been done successfully".white);
    },
    requestError: (message: string, path: string) => {
        console.error("Error: ".red + new Date());
        console.error("When requesting: ".red + path);
        console.error("With error message: ".red + message);
    }
}