import {HydratedDocument} from "mongoose";
import {IStoreSchema} from "../../models/schema";
import {Store} from "../../schema";
import * as messages from "../../logger/messages";
import {SeedsInsertionFailed} from "../../errors/custom";

const testStores = () => {
  const stores: HydratedDocument<IStoreSchema>[] = [
    new Store({ name: 'Birdhouse' }),
    new Store({ name: 'Habibi' })
  ];

  return Store.deleteMany({})
    .then(() => Store.insertMany(stores))
    .then(() => messages.seedsInserted(Store.modelName)
      .log())
    .catch((e) => {
      throw new SeedsInsertionFailed(Store.modelName);
    });
}

export default testStores;