import type {
    NextFunction,
    Request,
    Response
} from "express";

import { ForbiddenError } from "../errors/AppError.js";
import type { UserRole } from "../models/user.js";
import { currentUser } from "./authenticate.js";

// Must run after authenticate.
function requireRole(...roles: UserRole[]) {
    return (
        request: Request,
        _response: Response,
        next: NextFunction
    ): void => {
        if (!roles.includes(currentUser(request).role)) {
            throw new ForbiddenError();
        }

        next();
    };
}

export default requireRole;
