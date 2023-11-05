const { fileExtensionsSeparator } = require("../constants/app")

module.exports = {
  getFileNameWithExtension: (file: Express.Multer.File, name: string): string => {
    let originalNameParts: string[] = file.originalname.split(fileExtensionsSeparator);

    originalNameParts[0] = name;

    return originalNameParts.join(fileExtensionsSeparator);
  }
}