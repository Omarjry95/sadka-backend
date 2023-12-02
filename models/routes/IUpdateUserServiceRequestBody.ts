import IUpdateUserRequestBody from "./IUpdateUserRequestBody";

interface IUpdateUserServiceRequestBody extends IUpdateUserRequestBody {
    id: string,
    file?: Express.Multer.File
}

export default IUpdateUserServiceRequestBody;