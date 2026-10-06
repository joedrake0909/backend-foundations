import type {
    ErrorRequestHandler
} from "express";
import { ZodError } from "zod";

import { AppError } from "../errors/AppError.js";
import { mapDatabaseError } from "../errors/databaseErrors.js";

function isJsonParseError(error: unknown): boolean {
    return typeof error === "object"
        && error !== null
        && "type" in error
        && error.type === "entity.parse.failed";
}

const errorHandler: ErrorRequestHandler = (
    error,
    request,
    response,
    _next
): void => {
    if (error instanceof ZodError) {
        response.status(400).json({
            error: "Validation failed",
            details: error.issues.map((issue) => ({
                field: issue.path.join(".") || null,
                message: issue.message
            }))
        });

        return;
    }

    if (isJsonParseError(error)) {
        response.status(400).json({
            error: "Request body is not valid JSON"
        });

        return;
    }

    const knownError = error instanceof AppError
        ? error
        : mapDatabaseError(error);

    if (knownError) {
        if (knownError.statusCode === 401) {
            response.set("WWW-Authenticate", "Bearer");
        }

        response.status(knownError.statusCode).json({
            error: knownError.message
        });

        return;
    }

    // Full details stay in the server log only. Headers and body are not
    // logged because they can contain tokens and passwords.
    console.error(
        `${new Date().toISOString()} ${request.method} ${request.originalUrl} failed:`,
        error
    );

    response.status(500).json({
        error: "Internal server error"
    });
};

export default errorHandler;
