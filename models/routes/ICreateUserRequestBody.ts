interface ICreateUserRequestBody {
    email: string,
    password: string,
    lastName?: string,
    firstName?: string,
    charityName?: string,
    role: string
}

export default ICreateUserRequestBody;