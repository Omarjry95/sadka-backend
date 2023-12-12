import { Response } from "express";
import * as messages from "../../logger/messages";
import { SuccessResponse } from "../../models/app";

const successHandler = (res: Response, body: Object, path: string) => {

    messages.requestSuccess(path).log();

    res.status(200)
        .send(body);
}

export default successHandler;