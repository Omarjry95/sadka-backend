import { type, string } from 'io-ts'

export const ICreateUserRequestBody = type({
    email: string,
    password: string,
    lastName: string,
    firstName: string,
    role: string
});