import 'express';

interface Locals {
    status?: number,
    message: string;
    body?: Object
}

declare module 'express' {
    export interface Response  {
        locals: Locals;
    }

    export interface Request {
        userId?: string,
        userEmail?: string
    }
}