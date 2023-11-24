interface IUpdateUserRequestBody {
    lastName?: string,
    firstName?: string,
    charityName?: string,
    defaultRounding?: string,
    defaultAssociation?: string,
    isPhotoChanged?: "1",
    role: "0" | "1" | "2"
}

export default IUpdateUserRequestBody;