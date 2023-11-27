import UserWithSameIdExistsError from "./UserWithSameIdExistsError";
import DocumentNotFoundError from "./DocumentNotFoundError";
import DatabaseConnectionFailed from "./DatabaseConnectionFailed";
import AuthError from "./AuthError";
import FirebaseInitFailed from "./FirebaseInitFailed";
import FirebaseUserNotCreated from "./FirebaseUserNotCreated";
import FirebaseUserWithSameEmailExistsError from "./FirebaseUserWithSameEmailExistsError";
import DocumentNotCreated from "./DocumentNotCreated";
import FirebaseEmailVerificationLinkGenerationFailed from "./FirebaseEmailVerificationLinkGenerationFailed";

export {
  DatabaseConnectionFailed,
  AuthError,
  FirebaseInitFailed,
  DocumentNotFoundError,
  DocumentNotCreated,
  FirebaseUserNotCreated,
  UserWithSameIdExistsError,
  FirebaseUserWithSameEmailExistsError,
  FirebaseEmailVerificationLinkGenerationFailed
}