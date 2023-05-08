import express, {Express, Request, Response, NextFunction} from "express";
const ErrorBody = require('./models/app/ErrorBody');

// var express = require('express');
var path = require('path');
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app: Express = express();

var usersRouter = require('./routes/users');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
// app.use((_req: Request, _res: Response, next: NextFunction) => next(createError(404)));

/* Routes */
app.use('/users', usersRouter);

// error handler
app.use((error: Error, req: Request, res: Response) => {

  const defaultErrorStatus: number = 500;

  res.status(500)
      .send({ message: error.message });
});

app.listen(3000, () => console.log(`Sadka-Backend is running on port: 3000`));