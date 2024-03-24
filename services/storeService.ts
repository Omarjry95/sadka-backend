import {IStoreItem} from "../models/routes";
import {Store} from "../schema";

const storeService = {
  getAllStores: (): Promise<IStoreItem[]> => Store.find()
    .sort({ name: 1 })
    .then((stores) => stores
      .map(({ _id, name, photo }) => ({
        _id,
        label: name,
        photo
      })))
}

export default storeService;