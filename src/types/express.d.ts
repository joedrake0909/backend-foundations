import type { AuthenticatedUser } from "../models/user.js";

declare global {
    namespace Express {
        interface Request {
            user?: AuthenticatedUser;
        }
    }
}

export {};
