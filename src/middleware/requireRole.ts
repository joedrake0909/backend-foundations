import type {
    NextFunction,
    Request,
    Response
} from "express";

import { AppError } from "../errors/AppError.js";
import type { UserRole } from "../models/user.js";

// Must run after authenticate.
function requireRole(...roles: UserRole[]) {
    return (
        request: Request,
        _response: Response,
        next: NextFunction
    ): void => {
        if (!request.user) {
            next(new AppError(401, "Authentication required"));

            return;
        }

        if (!roles.includes(request.user.role)) {
            next(new AppError(
                403,
                "You do not have permission to perform this action"
            ));

            return;
        }

        next();
    };
}

export default requireRole;
