import type { Request } from "express";

import { NotFoundError } from "../errors/AppError.js";

function notFound(request: Request): never {
    throw new NotFoundError(
        `Route ${request.method} ${request.path} not found`
    );
}

export default notFound;
