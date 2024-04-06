import {IRoundingSchema} from "../models/schema";
import {IRoundingItem} from "../models/routes";
import {DocumentNotFound} from "../errors/custom";
import {Rounding} from "../schema";

const roundingService = {
  getAllRoundings: (): Promise<IRoundingItem[]> => Rounding.find()
    .sort({ _id: 1 })
    .then((roundings: IRoundingSchema[]) => {
      if (roundings.length === 0)
        throw new Error();

      return roundings.map(({ _id, label, power }: IRoundingSchema) => ({
        _id,
        label,
        power
      }))
    })
    .catch(() => {
      throw new DocumentNotFound(Rounding.modelName);
    }),
  getRoundingById: async (id?: string): Promise<IRoundingSchema | null> => id ? Rounding.findById(id) : null
}

export default roundingService;