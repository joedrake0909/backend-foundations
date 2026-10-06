import type {
    Request,
    Response
} from "express";

import { currentUser } from "../middleware/authenticate.js";
import {
    getCurrentUser as getCurrentUserService
} from "../services/userService.js";

export async function getMe(
    request: Request,
    response: Response
): Promise<void> {
    const user = await getCurrentUserService(currentUser(request).id);

    response.status(200).json(user);
}
