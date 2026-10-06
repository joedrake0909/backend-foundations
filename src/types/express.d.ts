import type { AuthenticatedUser } from "../models/user.js";

// Adds request.user to Express's Request type. It is only set by the
// authenticate middleware after a token has been verified.
declare global {
    namespace Express {
        interface Request {
            user?: AuthenticatedUser;
        }
    }
}

export {};
