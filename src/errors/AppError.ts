export class AppError extends Error {
    public readonly statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.name = "AppError";
        this.statusCode = statusCode;
    }
}

export class BadRequestError extends AppError {
    constructor(message: string) {
        super(400, message);
        this.name = "BadRequestError";
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = "Authentication required") {
        super(401, message);
        this.name = "UnauthorizedError";
    }
}

export class ForbiddenError extends AppError {
    constructor(message = "You do not have permission to perform this action") {
        super(403, message);
        this.name = "ForbiddenError";
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(404, message);
        this.name = "NotFoundError";
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(409, message);
        this.name = "ConflictError";
    }
}
