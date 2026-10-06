import {
    BadRequestError,
    NotFoundError,
    UnauthorizedError
} from "../errors/AppError.js";

import {
    findUserById as findUserByIdRepository,
    listUsers as listUsersRepository,
    updateUserRole as updateUserRoleRepository
} from "../repositories/userRepository.js";

import type {
    AuthenticatedUser,
    User,
    UserRole
} from "../models/user.js";

export async function getCurrentUser(
    userId: number
): Promise<User> {
    const user = await findUserByIdRepository(userId);

    if (!user) {
        throw new UnauthorizedError("User account no longer exists");
    }

    return user;
}



export async function listUsers(): Promise<User[]> {
    return listUsersRepository();
}



export async function changeUserRole(
    userId: number,
    role: UserRole,
    actor: AuthenticatedUser
): Promise<User> {
    // Stops the last admin from locking everyone out by demoting themselves.
    if (userId === actor.id) {
        throw new BadRequestError("You cannot change your own role");
    }

    const user = await updateUserRoleRepository(userId, role);

    if (!user) {
        throw new NotFoundError("User not found");
    }

    return user;
}
