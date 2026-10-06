import type {
    NextFunction,
    Request,
    Response
} from "express";

import {
    loginUser as loginUserService,
    registerUser as registerUserService
} from "../services/authService.js";
import {
    loginSchema,
    registerSchema
} from "../validators/authValidators.js";

export async function register(
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> {
    try {
        const input = registerSchema.parse(request.body);

        const user = await registerUserService(input);

        response.status(201).json(user);
    } catch (error) {
        next(error);
    }
}



export async function login(
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> {
    try {
        const input = loginSchema.parse(request.body);

        const authToken = await loginUserService(input);

        response.status(200).json(authToken);
    } catch (error) {
        next(error);
    }
}
