import {ReasonPhrases, StatusCodes} from "./httpStatusCode";
import {Response} from "express";

class SuccessResponse {
    public message;
    public status;
    public metadata;
    public options;

    constructor({
                    message = ReasonPhrases.OK,
                    statusCode = StatusCodes.OK,
                    reasonStatusCode = ReasonPhrases.OK,
                    metadata = {},
                    options = {}
                }) {
        this.message = message;
        this.status = statusCode;
        this.metadata = metadata;
        this.options = options;
    }

    send(res: Response, headers = {}) {
        return res.status(this.status)
            .json(this)
    }
}

class OK extends SuccessResponse {
    constructor({message = ReasonPhrases.OK, statusCode = StatusCodes.OK, metadata = {}, options = {}}) {
        super({message, metadata, options})
    }
}

class CREATED extends SuccessResponse {
    constructor({message = ReasonPhrases.CREATED, statusCode = StatusCodes.OK, metadata = {}, options = {}}) {
        super({message, metadata, options})
    }
}

export {
    OK,
    CREATED
}