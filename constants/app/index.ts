import * as SMTPConnection from "nodemailer/lib/smtp-connection";
import {EmailConfig} from "email-templates";

const AUTHORIZATION_HEADER: string = "authorization";

const AUTH_TOKEN_PREFIX: string = "Bearer ";

const FILE_EXTENSIONS_SEPARATOR: string = ".";

const ARROWBASE_SEPARATOR: string = "@";

const INTERROGATION_POINT_SEPARATOR: string = "?";

const COLON_SEPARATOR: string = ":";

const SLASH_SEPARATOR: string = "/";

const EQUAL_SEPARATOR: string = "=";

const AMPERSAND_SEPARATOR: string = "&";

const COMMA_SEPARATOR: string = ",";

const SPACE_SEPARATOR: string = " ";

const EMPTY_SEPARATOR: string = "";

const MONTH_PREFIX: string = "0";

const ASTERISK: string = "*";

const MONGODB_CONNECTION_URL_PREFIX: string = "mongodb+srv"
  .concat(COLON_SEPARATOR)
  .concat(SLASH_SEPARATOR.repeat(2));

const MONGODB_CONNECTION_OPTIONS = new Map([
    ["retryWrites", "true"],
    ["w", "majority"]
]);

const OAUTH2_SCOPES = {
    unrestricted: 'unrestricted'
};

const MAIL_TRANSPORT_DEFAULT_PARAMS: SMTPConnection.Options = {
    port: 587,
    secure: false
}

const EMAIL_SENDING_DEFAULT_PARAMS: EmailConfig = {
    message: { from: '"Sadka" <noreply@sadka.com>' },
    send: true
}

export {
    AUTHORIZATION_HEADER,
    AUTH_TOKEN_PREFIX,
    MONGODB_CONNECTION_URL_PREFIX,
    MONGODB_CONNECTION_OPTIONS,
    FILE_EXTENSIONS_SEPARATOR,
    COLON_SEPARATOR,
    ARROWBASE_SEPARATOR,
    SLASH_SEPARATOR,
    INTERROGATION_POINT_SEPARATOR,
    EQUAL_SEPARATOR,
    AMPERSAND_SEPARATOR,
    COMMA_SEPARATOR,
    SPACE_SEPARATOR,
    EMPTY_SEPARATOR,
    MONTH_PREFIX,
    ASTERISK,
    OAUTH2_SCOPES,
    MAIL_TRANSPORT_DEFAULT_PARAMS,
    EMAIL_SENDING_DEFAULT_PARAMS
}