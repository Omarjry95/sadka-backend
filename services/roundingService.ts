import {IRoundingSchema} from "../models/schema/IRoundingSchema";

const Rounding = require("../schema/Rounding");
const AppLogger = require("../logger");

module.exports = {
  getAllRoundings: (): Promise<IRoundingSchema> => Rounding.find()
    .sort({ _id: 1 })
    .then((roundings: IRoundingSchema[]) => {
      if (roundings.length === 0) {
        throw new Error();
      }

      return roundings.map((rounding: IRoundingSchema) => ({
        _id: rounding._id,
        label: rounding.label,
        power: rounding.power
      }))
    })
    .catch(() => {
      throw new Error(
        AppLogger.stringifyToThrow(
          AppLogger.messages.documentDoesNotExist(Rounding.modelName)))
    })
}