import mongoose from 'mongoose';

const AppLogger = require("../logger");

// const defaultRolesSeeder = require('./seeders/default-roles');
// const firstUserSeeder = require('./seeders/1st-firebase-user');

const { DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD } = process.env;

module.exports = () => mongoose
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
        .concat("w=majority"))
    .then(AppLogger.databaseConnected)
    .catch(() => {
        AppLogger.databaseConnectionAbandoned();
        throw new Error();
    })
    // .then(defaultRolesSeeder)
    // .then(firstUserSeeder)
;