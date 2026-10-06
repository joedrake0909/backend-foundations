import type {
    ErrorRequestHandler
} from "express";
import { ZodError } from "zod";

import { AppError } from "../errors/AppError.js";

const errorHandler: ErrorRequestHandler = (
    error,
    _request,
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

    if (error instanceof AppError) {
        response.status(error.statusCode).json({
            error: error.message
        });

        return;
    }

    console.error(error);

    response.status(500).json({
        error: "Internal server error"
    });
};

export default errorHandler;
