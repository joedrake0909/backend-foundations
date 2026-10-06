import type {
    NextFunction,
    Request,
    Response
} from "express";

import {
    registerUser as registerUserService
} from "../services/authService.js";

export async function register(
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> {
    try {
        const body = request.body as Record<string, unknown>;

        if (
            typeof body !== "object"
            || body === null
            || Array.isArray(body)
        ) {
            response.status(400).json({
                error: "Request body must be an object"
            });

            return;
        }

        const {
            name,
            email,
            password
        } = body;

        if (
            typeof name !== "string"
            || typeof email !== "string"
            || typeof password !== "string"
        ) {
            response.status(400).json({
                error: "Name, email and password are required"
            });

            return;
        }

        const user = await registerUserService({
            name,
            email,
            password
        });

        response.status(201).json(user);
    } catch (error) {
        next(error);
    }
}
