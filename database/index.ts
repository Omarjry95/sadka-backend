import mongoose from 'mongoose';
import {
    AMPERSAND_SEPARATOR,
    ARROWBASE_SEPARATOR,
    COLON_SEPARATOR, EQUAL_SEPARATOR,
    INTERROGATION_POINT_SEPARATOR, MONGODB_CONNECTION_OPTIONS,
    MONGODB_CONNECTION_URL_PREFIX,
    SLASH_SEPARATOR
} from "../constants/app";
import * as messages from "../logger/messages";
import { DatabaseConnectionFailed } from "../errors/custom";
// import { firstFirebaseUserSeeder, defaultRolesSeeder, defaultRoundingsSeeder } from './seeders';

const { DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD } = process.env;

const establishDatabaseConnection = async (dbName: string = "", dbUsername: string = "", dbPwd: string = "") => {

    let connectionURL = MONGODB_CONNECTION_URL_PREFIX
      .concat(dbUsername)
      .concat(COLON_SEPARATOR)
      .concat(dbPwd)
      .concat(ARROWBASE_SEPARATOR)
      .concat(dbName)
      .concat(SLASH_SEPARATOR)
      .concat(INTERROGATION_POINT_SEPARATOR);

    let urlOptions: string[] = [];

    MONGODB_CONNECTION_OPTIONS.forEach((value, key) => urlOptions.push(key.concat(EQUAL_SEPARATOR).concat(value)));

    connectionURL = connectionURL.concat(urlOptions.join(AMPERSAND_SEPARATOR));

    try {
        await mongoose.connect(connectionURL);

        messages.databaseConnected().log();
    }
    catch (e: any) {
        throw new DatabaseConnectionFailed();
    }
}

const databaseProcess = () => establishDatabaseConnection(DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD)
  /* Seeders: Please comment after completing seeding the database ! */
  // .then(defaultRolesSeeder)
  // .then(firstUserSeeder)
  // .then(defaultRoundingsSeeder)
;

export default databaseProcess;