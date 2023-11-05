import 'colors';

const AppMessages = require("./messages");

module.exports = {
    messages: AppMessages,
    parseAndLog: function (arrayAsString: string): void {
        const messages: string[] = JSON.parse(arrayAsString);

        messages.forEach(console.log);
    }
};