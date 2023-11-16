import {HydratedDocument} from "mongoose";
import {IRoundingSchema} from "../../models/schema";
import * as messages from "../../logger/messages";

const { Rounding } = require('../../schema');

const defaultRoundingsSeeder = () => {
  const roundings: HydratedDocument<IRoundingSchema>[] = [
    new Rounding({ label: "Au centième", power: 1 }),
    new Rounding({ label: "Au dixième", power: 2 }),
    new Rounding({ label: "À l'unité", power: 3 }),
    new Rounding({ label: "À la dizaine", power: 4 }),
    new Rounding({ label: "À la centaine", power: 5 }),
    new Rounding({ label: "Au millier", power: 6 })
  ];

  return Rounding.deleteMany({})
    .then(() => Rounding.insertMany(roundings))
    .then(() => messages.seedsInserted(Rounding.modelName)
      .log());
}

export default defaultRoundingsSeeder;