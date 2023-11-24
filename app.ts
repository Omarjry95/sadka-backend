/* Imports */
import express, { Express } from "express";
import path from 'path';
import cookieParser from 'cookie-parser';
import 'colors';
import logger from 'morgan';
import routes from "./routes";
import BasicError from "./errors/BasicError";
import databaseConnect from "./database";
import firebaseInit from "./firebase";
import IRoute from "./models/app/IRoute";

/* Node requirements */
require('dotenv').config();

/* Custom utilities */
const AppLogger = require("./logger");
const ErrorHandler = require("./handlers/error");

var app: Express = express();

/* Handlers */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* Routes */
routes.map(({ prefix, router }: IRoute) => app.use(prefix, router));

/* Error handler */
app.use(ErrorHandler);

/* MongoDB database connection, which leads to the server launch if established */
databaseConnect()
    .then(firebaseInit)
    .then(() => app.listen(3000, () => AppLogger.log(AppLogger.messages.serverRunning())))
    .catch((error: BasicError) => error.log());