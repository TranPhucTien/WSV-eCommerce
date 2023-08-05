import {ReasonPhrases, StatusCodes} from "./httpStatusCode";

export class ErrorResponse extends Error {
    public status;

    constructor(message: string, status?: number) {
        super(message);
        this.status = status;
    }
}

class ConflictError extends ErrorResponse {
    constructor(message = ReasonPhrases.CONFLICT, status = StatusCodes.CONFLICT) {
        super(message, status);
    }
}

class NotFoundError extends ErrorResponse {
    constructor(message = ReasonPhrases.NOT_FOUND, status = StatusCodes.NOT_FOUND) {
        super(message, status);
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.BAD_REQUEST, status = StatusCodes.BAD_REQUEST) {
        super(message, status);
    }
}

class AuthFailureError extends ErrorResponse {
    constructor(message = ReasonPhrases.UNAUTHORIZED, status = StatusCodes.UNAUTHORIZED) {
        super(message, status);
    }
}

class ForBiddenError extends ErrorResponse {
    constructor(message = ReasonPhrases.FORBIDDEN, status = StatusCodes.FORBIDDEN) {
        super(message, status);
    }
}

export {
    ConflictError,
    NotFoundError,
    BadRequestError,
    AuthFailureError,
    ForBiddenError
}