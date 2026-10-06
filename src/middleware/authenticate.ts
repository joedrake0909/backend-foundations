import type {
    NextFunction,
    Request,
    Response
} from "express";

import { AppError } from "../errors/AppError.js";
import { verifyAccessToken } from "../services/authService.js";

function authenticate(
    request: Request,
    response: Response,
    next: NextFunction
): void {
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
        request.user = verifyAccessToken(token);
    } catch (error) {
        response.set("WWW-Authenticate", "Bearer error=\"invalid_token\"");
        next(error);

        return;
    }

    next();
}

export default authenticate;
