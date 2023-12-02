import UserWithSameIdExistsError from "./UserWithSameIdExistsError";
import DocumentNotFound from "./DocumentNotFound";
import DatabaseConnectionFailed from "./DatabaseConnectionFailed";
import AuthError from "./AuthError";
import FirebaseInitFailed from "./FirebaseInitFailed";
import FirebaseUserNotCreated from "./FirebaseUserNotCreated";
import FirebaseUserWithSameEmailExistsError from "./FirebaseUserWithSameEmailExistsError";
import DocumentNotCreated from "./DocumentNotCreated";
import FirebaseEmailVerificationLinkGenerationFailed from "./FirebaseEmailVerificationLinkGenerationFailed";
import DocumentNotUpdated from "./DocumentNotUpdated";

export {
  DatabaseConnectionFailed,
  AuthError,
  FirebaseInitFailed,
  DocumentNotFound,
  DocumentNotCreated,
  DocumentNotUpdated,
  FirebaseUserNotCreated,
  UserWithSameIdExistsError,
  FirebaseUserWithSameEmailExistsError,
  FirebaseEmailVerificationLinkGenerationFailed
}