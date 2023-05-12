import express, { NextFunction, Request, Response, Router } from "express";
import {ICreateUserRequestBody} from "../models/routes/ICreateUserRequestBody";
import {TypeOf} from "io-ts";
import {IDataValidationObject} from "../models/app/IDataValidationObject";
import {ValidationTypesEnum} from "../models/app/ValidationTypesEnum";

var router: Router = express.Router();
// var AppLogger = require("../logger");
var Constants = require("../constants");
var UserService = require("../services/userService");
var isRequestBodyInvalid = require("../handlers/request-body-validation");
var isRequestBodyDataInvalid = require("../handlers/request-body-data-validation");

var send = require('../handlers/send-response');

router.post('/', async (req: Request<any, any, TypeOf<typeof ICreateUserRequestBody>>, res: Response, next: NextFunction) => {

  const { body, originalUrl } = req;
  const { email, password, lastName, firstName, role } = body;

  const valuesToValidate: IDataValidationObject[] = [
    { value: email, validations: [ValidationTypesEnum.NOT_BLANK, ValidationTypesEnum.REGEX], options: { regex: new RegExp(Constants.emailRegex) } },
    { value: password, validations: [ValidationTypesEnum.NOT_BLANK, ValidationTypesEnum.MIN_LENGTH], options: { minLength: 6 } },
    { value: lastName, validations: [ValidationTypesEnum.NOT_BLANK] },
    { value: firstName, validations: [ValidationTypesEnum.NOT_BLANK] },
    { value: role, validations: [ValidationTypesEnum.NOT_BLANK] }
  ];

  if (isRequestBodyInvalid(req, ICreateUserRequestBody, next) ||
      isRequestBodyDataInvalid(valuesToValidate, originalUrl, next))
  { return; }

  try {
    await UserService.throwIfFirebaseUserExists(email, next);

    return;
  }
  catch (e: any) {
    send({ message: "The user has been created successfully" }, res, next);
  }
});

module.exports = router;
