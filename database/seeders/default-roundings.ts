import {Error as MongooseError, HydratedDocument} from "mongoose";
import {IRoundingSchema} from "../../models/schema/IRoundingSchema";

const Rounding = require('../../schema/Rounding');

const AppLogger = require("../../logger");
const gatherValidationMessages = require("../../handlers/mongoose-schema-validation-messages");

module.exports = () => {
  const roundings: HydratedDocument<IRoundingSchema>[] = [
    new Rounding({ label: "Au centième", power: 1 }),
    new Rounding({ label: "Au dixième", power: 2 }),
    new Rounding({ label: "À l'unité", power: 3 }),
    new Rounding({ label: "À la dizaine", power: 4 }),
    new Rounding({ label: "À la centaine", power: 5 }),
    new Rounding({ label: "Au millier", power: 6 })
  ]

  let valid: boolean = true;
  let index: number = 0;
  let roleModelValidation: MongooseError.ValidationError | null = null;

  while (valid && index < roundings.length) {
    roleModelValidation = roundings[index].validateSync();

    valid = !roleModelValidation;
    index++;
  }

  if (valid) {
    return Rounding.deleteMany({})
      .then(() => Rounding.insertMany(roundings))
      .then(() => AppLogger.log(AppLogger.messages.seedsInserted(Rounding.modelName)));
  }
  else {
    throw new Error(AppLogger.stringifyToThrow(
      AppLogger.messages.schemaValidationError(Rounding.modelName, gatherValidationMessages(roleModelValidation))
    ));
  }
}