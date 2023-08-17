import { initializeApp, cert, AppOptions } from 'firebase-admin/app';

const { GOOGLE_APPLICATION_CREDENTIALS } = process.env;

var AppLogger = require("../logger");

module.exports = async () => {
    try {
        const firebaseAppOptions: AppOptions = {
            credential: cert(
                require(GOOGLE_APPLICATION_CREDENTIALS as string)
            ),
            storageBucket: 'sadka-31ab2.appspot.com'
        }

        initializeApp(firebaseAppOptions);

        AppLogger.log(AppLogger.messages.firebaseInitialized());
    }
    catch (e: any) {
        throw new Error(AppLogger.stringifyToThrow(AppLogger.messages.firebaseInitializationFailed()));
    }
}