import type {
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
    response: Response
): Promise<void> {
    const input = registerSchema.parse(request.body);

    const user = await registerUserService(input);

    response.status(201).json(user);
}

export async function login(
    request: Request,
    response: Response
): Promise<void> {
    const input = loginSchema.parse(request.body);

    const authToken = await loginUserService(input);

    response.status(200).json(authToken);
}
