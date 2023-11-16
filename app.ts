/* Imports */
import express, { Express } from "express";
import path from 'path';
import cookieParser from 'cookie-parser';
import 'colors';
import logger from 'morgan';
import BasicError from "./errors/BasicError";
import databaseConnect from "./database";
import firebaseInit from "./firebase";

/* Node requirements */
require('dotenv').config();

/* Custom utilities */
const AppLogger = require("./logger");
const SuccessHandler = require("./handlers/success");
const ErrorHandler = require("./handlers/error");

var app: Express = express();

/* Routes requirements */
// var usersRouter = require('./routes/users');
// var rolesRouter = require('./routes/roles');
var routes = require('./routes');

/* Handlers */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* Routes */
routes.map((route: any) => app.use(route.prefix, route.router));

// app.use(SuccessHandler);

/* Error handler */
app.use(ErrorHandler);

/* MongoDB database connection, which leads to the server launch if established */
databaseConnect()
    .then(firebaseInit)
    .then(() => app.listen(3000, () => AppLogger.log(AppLogger.messages.serverRunning())))
    .catch((error: BasicError) => error.log());