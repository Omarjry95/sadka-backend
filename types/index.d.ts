// declare namespace Express {
//   export interface Request {
//     userId?: string,
//     userEmail?: string
//   }
//
//   export interface Response {
//
//   }
// }

import 'express';

declare module 'express' {
  export interface Response  {

  }

  export interface Request {
    userId?: string,
    userEmail?: string
  }
}

// export {};
//
// declare global {
//   namespace Express {
//     interface Request {
//       userId: string,
//       userEmail?: string
//     }
//   }
// }