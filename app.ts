/* Imports */
import express, { Express, Request, Response, NextFunction } from "express";
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

/* Node requirements */
var createError = require('http-errors');

/* Custom utilities */
const AppLogger = require("./logger");
const SuccessHandler = require("./handlers/success");
const ErrorHandler = require("./handlers/error");

var app: Express = express();

/* Routes requirements */
var usersRouter = require('./routes/users');

/* Handlers */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* Routes */
app.use('/users', usersRouter);

app.use(SuccessHandler);

// catch 404 and forward to error handler
app.use((_req: Request, _res: Response, next: NextFunction) => next(createError(404)));

// error handler
app.use(ErrorHandler);

app.listen(3000, AppLogger.serverRunning);