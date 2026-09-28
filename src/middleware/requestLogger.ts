import type { Request, Response, NextFunction } from "express";

function requestLogger(
    request: Request,
    _response: Response,
    next: NextFunction
): void {
    const timestamp = new Date().toISOString();

    console.log(
        `${timestamp} ${request.method} ${request.path}`
    );

    next();
}

export default requestLogger;