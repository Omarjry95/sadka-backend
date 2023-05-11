import 'colors';

const AppMessages = require("./messages");

module.exports = {
    messages: AppMessages,
    log: (messages: string[]) => messages.forEach((message: string) => console.log(message)),
    stringifyToThrow: (messages: string[]) => JSON.stringify(messages),
    parseAndLog: function (arrayAsString: string) {
        this.log(JSON.parse(arrayAsString) as string[]);
    }
};