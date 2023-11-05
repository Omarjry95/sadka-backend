import {Error as MongooseError} from "mongoose";

module.exports = (validation: MongooseError.ValidationError): string[] => Object.values(validation.errors)
  .map((error: MongooseError.ValidatorError | MongooseError.CastError) => error.toString());