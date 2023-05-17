import {type, string, intersection, partial, union, undefined as optional} from 'io-ts';

export const ICreateUserRequestBody = intersection([
    type({
        email: string,
        password: string,
        role: string
    }),
    partial({
        lastName: union([string, optional]),
        firstName: union([string, optional]),
        charityName: union([string, optional])
    })
]);