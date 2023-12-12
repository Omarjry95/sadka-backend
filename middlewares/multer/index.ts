import * as multer from "multer";

const multerManager = {
  single: (fieldName: string) => multer({ storage: multer.memoryStorage() }).single(fieldName)
}

export default multerManager;