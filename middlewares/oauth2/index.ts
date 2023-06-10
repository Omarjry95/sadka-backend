import {Handler} from "express";
const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');

const { OAUTH2_AUDIENCE, OAUTH2_ISSUER_BASE_URL } = process.env;

module.exports = {
    verifyJwt: (): Handler => auth({
        audience: OAUTH2_AUDIENCE,
        issuerBaseURL: OAUTH2_ISSUER_BASE_URL
    }),
    verifyRequiredScopes: (scopes: string[]) => requiredScopes(scopes),
    scopes: {
        unrestricted: 'unrestricted'
    }
}