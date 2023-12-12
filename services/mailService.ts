import {createTransport} from "nodemailer";
import * as Email from "email-templates";
import {
    COMMA_SEPARATOR,
    EMAIL_SENDING_DEFAULT_PARAMS,
    MAIL_TRANSPORT_DEFAULT_PARAMS,
    SPACE_SEPARATOR
} from "../constants/app";
import * as messages from "../logger/messages";

const { SMTP_HOST: host, SMTP_USERNAME: user, SMTP_PASSWORD: pass } = process.env;

const mailService = {
    send: async (receivers: string[], template: string, locals: Object) => {
        try {
            const email = new Email({
                ...EMAIL_SENDING_DEFAULT_PARAMS,
                transport: createTransport({
                    host,
                    auth: {
                        user,
                        pass
                    },
                    ...MAIL_TRANSPORT_DEFAULT_PARAMS
                })
            });

            await email.send({
                template,
                message: { to: receivers.join(COMMA_SEPARATOR.concat(SPACE_SEPARATOR)) },
                locals
            });
        }
        catch (e: any) {
            messages.mailSendingFailed(receivers).log();
        }
    }
}

export default mailService;