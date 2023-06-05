import {Handler} from "express";
const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');

module.exports = {
    verifyJwt: (): Handler => auth({
        audience: 'https://sadka.com',
        issuerBaseURL: 'https://sadka.eu.auth0.com/'
    }),
    verifyRequiredScopes: (scopes: string[]) => requiredScopes(scopes),
    scopes: {
        unrestricted: 'unrestricted'
    }
}