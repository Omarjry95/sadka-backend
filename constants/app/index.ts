const AUTHORIZATION_HEADER: string = "authorization";

const AUTH_TOKEN_PREFIX: string = "Bearer ";

const FILE_EXTENSIONS_SEPARATOR: string = ".";

const ARROWBASE_SEPARATOR: string = "@";

const INTERROGATION_POINT_SEPARATOR: string = "?";

const COLON_SEPARATOR: string = ":";

const SLASH_SEPARATOR: string = "/";

const EQUAL_SEPARATOR: string = "=";

const AMPERSAND_SEPARATOR: string = "&";

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
    OAUTH2_SCOPES
}