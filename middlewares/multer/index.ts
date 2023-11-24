import multer, {memoryStorage} from "multer";

const multerManager = {
  single: (fieldName: string) => multer({ storage: memoryStorage() }).single(fieldName)
}

export default multerManager;