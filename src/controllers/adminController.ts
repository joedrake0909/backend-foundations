import type {
    Request,
    Response
} from "express";

import { currentUser } from "../middleware/authenticate.js";
import {
    changeUserRole as changeUserRoleService,
    listUsers as listUsersService
} from "../services/userService.js";
import { idParamSchema } from "../validators/common.js";
import { updateRoleSchema } from "../validators/userValidators.js";

export async function listUsers(
    _request: Request,
    response: Response
): Promise<void> {
    const users = await listUsersService();

    response.status(200).json(users);
}

export async function changeUserRole(
    request: Request,
    response: Response
): Promise<void> {
    const { id } = idParamSchema.parse(request.params);
    const { role } = updateRoleSchema.parse(request.body);

    const user = await changeUserRoleService(
        id,
        role,
        currentUser(request)
    );

    response.status(200).json(user);
}
