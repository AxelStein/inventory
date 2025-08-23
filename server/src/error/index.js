export class ApiError extends Error {
    constructor(
        message, 
        statusCode = 500,
        details
    ) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message = 'Unauthorized') {
        super(message, 401)
    }
}

export class ForbiddenError extends ApiError {
    constructor(message = 'Forbidden') {
        super(message, 403)
    }
}

export class NotFoundError extends ApiError {
    constructor(message = 'Not found') {
        super(message, 404)
    }
}

export class ValidationError extends ApiError {
    constructor(message = 'Validation error', data) {
        super(message, 400, data);
    }
}

export class ConflictError extends ApiError {
    constructor(message = 'Conflict') {
        super(message, 409);
    }
}

export class GoneError extends ApiError {
    constructor(message = 'Gone') {
        super(message, 410);
    }
}