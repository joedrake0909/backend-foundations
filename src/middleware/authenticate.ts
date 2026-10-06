import type {
    NextFunction,
    Request,
    Response
} from "express";

import { AppError } from "../errors/AppError.js";
import type { AuthenticatedUser } from "../models/user.js";
import { verifyAccessToken } from "../services/authService.js";
import { getCurrentUser } from "../services/userService.js";

async function authenticate(
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> {
    const header = request.headers.authorization;

    if (!header) {
        response.set("WWW-Authenticate", "Bearer");
        next(new AppError(401, "Authentication required"));

        return;
    }

    const [scheme, token, ...rest] = header.split(" ");

    if (
        scheme?.toLowerCase() !== "bearer"
        || !token
        || rest.length > 0
    ) {
        response.set("WWW-Authenticate", "Bearer");
        next(new AppError(
            401,
            "Authorization header must be in the format: Bearer <token>"
        ));

        return;
    }

    try {
        const { id } = verifyAccessToken(token);

        // Role comes from the database, so a demotion applies immediately.
        const user = await getCurrentUser(id);

        request.user = {
            id: user.id,
            role: user.role
        };
    } catch (error) {
        response.set("WWW-Authenticate", "Bearer error=\"invalid_token\"");
        next(error);

        return;
    }

    next();
}

export function currentUser(request: Request): AuthenticatedUser {
    if (!request.user) {
        throw new AppError(401, "Authentication required");
    }

    return request.user;
}

export default authenticate;
