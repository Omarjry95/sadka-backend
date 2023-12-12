/* Imports */
import * as express from "express";
import * as path from 'path';
import * as cookieParser from 'cookie-parser';
import 'colors';
import * as logger from 'morgan';
import BasicError from "./errors/BasicError";
import databaseConnect from "./database";
import firebaseInit from "./firebase";
import { config as dotenvConfig } from 'dotenv';
import errorHandler from './handlers/error';
import * as messages from './logger/messages';

/* Env variables setup */
dotenvConfig();

var app = express();

/* Handlers */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* Routes */
var routes = require('./routes');
routes.map(({ prefix, router }: { prefix: string, router: any }) => app.use(prefix, router));

/* Error handler */
app.use(errorHandler);

/* MongoDB database connection, which leads to the server launch if established */
databaseConnect()
    .then(firebaseInit)
    .then(() => app.listen(3000, () => messages.serverRunning().log()))
    .catch((error: BasicError) => error.log());