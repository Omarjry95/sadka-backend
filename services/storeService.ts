import {IStoreItem} from "../models/routes";
import {Store} from "../schema";
import {IStoreSchema} from "../models/schema";

const storeService = {
  getAllStores: (): Promise<IStoreItem[]> => Store.find()
    .sort({ name: 1 })
    .then((stores) => stores
      .map(({ _id, name, photo }) => ({
        _id,
        label: name,
        photo
      }))),
  getStoreById: async (id?: string): Promise<IStoreSchema | null> => id ? Store.findById(id) : null
}

export default storeService;