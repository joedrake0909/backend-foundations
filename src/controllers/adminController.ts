import type {
    NextFunction,
    Request,
    Response
} from "express";

import { currentUser } from "../middleware/authenticate.js";
import {
    changeUserRole as changeUserRoleService,
    listUsers as listUsersService
} from "../services/userService.js";

export async function listUsers(
    _request: Request,
    response: Response,
    next: NextFunction
): Promise<void> {
    try {
        const users = await listUsersService();

        response.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

export async function changeUserRole(
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> {
    try {
        const userId = Number(request.params.id);

        if (!Number.isInteger(userId) || userId <= 0) {
            response.status(400).json({
                error: "User ID must be a positive integer"
            });

            return;
        }

        const body = request.body as Record<string, unknown> | undefined;
        const role = body?.role;

        if (role !== "user" && role !== "admin") {
            response.status(400).json({
                error: "Role must be 'user' or 'admin'"
            });

            return;
        }

        const user = await changeUserRoleService(
            userId,
            role,
            currentUser(request)
        );

        response.status(200).json(user);
    } catch (error) {
        next(error);
    }
}
