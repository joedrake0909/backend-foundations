import type {
    NextFunction,
    Request,
    Response
} from "express";

import {
    getCurrentUser as getCurrentUserService
} from "../services/userService.js";

export async function getMe(
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> {
    try {
        // The identity comes only from the verified token, never from
        // the body, query string or a route parameter.
        if (!request.user) {
            response.status(401).json({
                error: "Authentication required"
            });

            return;
        }

        const user = await getCurrentUserService(request.user.id);

        response.status(200).json(user);
    } catch (error) {
        next(error);
    }
}
