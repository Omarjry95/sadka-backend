import { auth, requiredScopes } from 'express-oauth2-jwt-bearer';

const { OAUTH2_AUDIENCE, OAUTH2_ISSUER_BASE_URL } = process.env;

const verifyJwt = () => auth({
    audience: OAUTH2_AUDIENCE,
    issuerBaseURL: OAUTH2_ISSUER_BASE_URL
});

const verifyRequiredScopes = (scopes: string[]) => requiredScopes(scopes);

export {
    verifyJwt,
    verifyRequiredScopes
};