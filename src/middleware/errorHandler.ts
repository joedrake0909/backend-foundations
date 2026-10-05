import type {
    ErrorRequestHandler
} from "express";

import { AppError } from "../errors/AppError.js";

const errorHandler: ErrorRequestHandler = (
    error,
    _request,
    response,
    _next
): void => {
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