import mongoose from 'mongoose';

const AppLogger = require("../logger");

// const defaultRolesSeeder = require('./seeders/default-roles');
// const firstUserSeeder = require('./seeders/1st-firebase-user');
// const defaultRoundingsSeeder = require('./seeders/default-roundings');

const { DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD } = process.env;

const establishDatabaseConnection = async () => {
    try {
        await mongoose
            .connect("mongodb+srv://"
                .concat(DATABASE_USERNAME ?? "")
                .concat(":")
                .concat(DATABASE_PASSWORD ?? "")
                .concat("@")
                .concat(DATABASE_NAME ?? "")
                .concat("/")
                .concat("?")
                .concat("retryWrites=true")
                .concat("&")
                .concat("w=majority"));

        AppLogger.log(AppLogger.messages.databaseConnected());
    }
    catch (e: any) {
        throw new Error(AppLogger.stringifyToThrow(
            AppLogger.messages.databaseConnectionAbandoned()
        ));
    }
}

module.exports = () => establishDatabaseConnection()
    /* Seeders: Please comment after completing seeding the database ! */
    // .then(defaultRolesSeeder)
    // .then(firstUserSeeder)
  // .then(defaultRoundingsSeeder)
;