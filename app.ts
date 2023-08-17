/* Imports */
import express, { Express } from "express";
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

/* Node requirements */
require('dotenv').config();
// var createError = require('http-errors');

/* Custom utilities */
const databaseConnect = require("./database");
const firebaseInit = require("./firebase");
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

app.use(SuccessHandler);

/* Error handler */
app.use(ErrorHandler);

/* MongoDB database connection, which leads to the server launch if established */
databaseConnect()
    .then(firebaseInit)
    .then(() => app.listen(3000, () => AppLogger.log(AppLogger.messages.serverRunning())))
    .catch((error: Error) => AppLogger.parseAndLog(error.message));