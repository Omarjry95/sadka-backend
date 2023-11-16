import UserWithSameIdExistsError from "./UserWithSameIdExistsError";
import DocumentNotFoundError from "./DocumentNotFoundError";
import DatabaseConnectionFailed from "./DatabaseConnectionFailed";
import AuthError from "./AuthError";
import FirebaseInitFailed from "./FirebaseInitFailed";

export {
  DatabaseConnectionFailed,
  AuthError,
  FirebaseInitFailed,
  DocumentNotFoundError,
  UserWithSameIdExistsError
}