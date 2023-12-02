import {FILE_EXTENSIONS_SEPARATOR} from "../constants/app";

const fileService = {
  getFileNameWithExtension: (fileName: string, newName: string): string => {
    let [_, ...extensions] = fileName.split(FILE_EXTENSIONS_SEPARATOR);

    return [newName, ...extensions].join(FILE_EXTENSIONS_SEPARATOR);
  }
}

export default fileService;