import 'express';

declare module 'express' {
    export interface Request {
        userId?: string,
        userEmail?: string
    }
}