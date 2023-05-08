import mongoose from 'mongoose';

const AppLogger = require("../logger");

module.exports = async () => mongoose
    .connect("mongodb+srv://omarjry9:testtest@sadka.dgvir7h.mongodb.net/?retryWrites=true&w=majority")
    .then(AppLogger.databaseConnected)
    .catch(AppLogger.databaseConnectionAbandoned);