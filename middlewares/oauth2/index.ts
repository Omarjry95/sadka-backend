import {Handler} from "express";
import { auth, requiredScopes } from 'express-oauth2-jwt-bearer';

const { OAUTH2_AUDIENCE, OAUTH2_ISSUER_BASE_URL } = process.env;

const oauth2Manager = {
    verifyJwt: (): Handler => auth({
        audience: OAUTH2_AUDIENCE,
        issuerBaseURL: OAUTH2_ISSUER_BASE_URL
    }),
    verifyRequiredScopes: (scopes: string[]) => requiredScopes(scopes)
}

export default oauth2Manager;