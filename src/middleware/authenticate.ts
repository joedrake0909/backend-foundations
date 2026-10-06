import type {
    NextFunction,
    Request,
    Response
} from "express";

import { UnauthorizedError } from "../errors/AppError.js";
import type { AuthenticatedUser } from "../models/user.js";
import { verifyAccessToken } from "../services/authService.js";
import { getCurrentUser } from "../services/userService.js";

async function authenticate(
    request: Request,
    _response: Response,
    next: NextFunction
): Promise<void> {
    const header = request.headers.authorization;

    if (!header) {
        throw new UnauthorizedError();
    }

    const [scheme, token, ...rest] = header.split(" ");

    if (
        scheme?.toLowerCase() !== "bearer"
        || !token
        || rest.length > 0
    ) {
        throw new UnauthorizedError(
            "Authorization header must be in the format: Bearer <token>"
        );
    }

    const { id } = verifyAccessToken(token);

    // Role comes from the database, so a demotion applies immediately.
    const user = await getCurrentUser(id);

    request.user = {
        id: user.id,
        role: user.role
    };

    next();
}

export function currentUser(request: Request): AuthenticatedUser {
    if (!request.user) {
        throw new UnauthorizedError();
    }

    return request.user;
}

export default authenticate;
