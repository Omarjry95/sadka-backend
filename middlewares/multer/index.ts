import multer, {memoryStorage} from "multer";

module.exports = {
  multerSingle: (fieldName: string) => multer({ storage: memoryStorage() }).single(fieldName)
}