import { initializeApp, cert, AppOptions } from 'firebase-admin/app';
import * as messages from "../logger/messages";
import FirebaseInitFailed from "../errors/custom/FirebaseInitFailed";

const firebaseInit = async () => {
  try {
    const { GOOGLE_APPLICATION_CREDENTIALS = '', FIREBASE_STORAGE_DEFAULT_BUCKET } = process.env;

    const firebaseAppOptions: AppOptions = {
      credential: cert(
        require(GOOGLE_APPLICATION_CREDENTIALS)
      ),
      storageBucket: FIREBASE_STORAGE_DEFAULT_BUCKET
    }

    initializeApp(firebaseAppOptions);

    messages.firebaseInitialized().log();
  }
  catch (e: any) {
    throw new FirebaseInitFailed();
  }
}

export default firebaseInit;