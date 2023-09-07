const { createTransport } = require("nodemailer");
const Email = require('email-templates');
var AppLogger = require("../logger");

const { SMTP_HOST, SMTP_USERNAME, SMTP_PASSWORD } = process.env;

module.exports = async (receivers: string[], template: string, locals: Object) => {
    try {
        const transport = createTransport({
            host: SMTP_HOST,
            port: 587,
            secure: false,
            auth: {
                user: SMTP_USERNAME,
                pass: SMTP_PASSWORD
            }
        });

        const email = new Email({
            message: { from: '"Sadka" <noreply@sadka.com>' },
            send: true,
            transport
        });

        await email.send({
            template,
            message: { to: receivers.join(", ") },
            locals
        });
    }
    catch (e: any) {
        AppLogger.log(AppLogger.messages.mailSendingError(receivers));
    }
}