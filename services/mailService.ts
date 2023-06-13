const { createTransport } = require("nodemailer");
const Email = require('email-templates');
const AppLogger = require("../logger");

module.exports = async (receivers: string[], subject: string, content: string) => {
    try {
        const transport = createTransport({
            host: "smtp-relay.sendinblue.com",
            port: 587,
            secure: false,
            auth: {
                user: "omarjry9@gmail.com",
                pass: "WLhmF7EfQ5IUpkK8"
            }
        });

        const email = new Email({
            message: { from: '"Sadka" <noreply@sadka.com>' },
            send: true,
            transport
        });

        await email.send({
            template: 'account-verification',
            message: { to: receivers.join(", ") }
        });

        AppLogger.log(AppLogger.messages.mailSendingSuccess(receivers));
    }
    catch (e: any) {
        console.log(e);
        AppLogger.log(AppLogger.messages.mailSendingError(receivers));
    }
}