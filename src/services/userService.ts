import { AppError } from "../errors/AppError.js";

import {
    findUserById as findUserByIdRepository
} from "../repositories/userRepository.js";

import type { User } from "../models/user.js";

export async function getCurrentUser(
    userId: number
): Promise<User> {
    const user = await findUserByIdRepository(userId);

    // The token can still be valid after its user has been deleted.
    // That identity no longer exists, so treat it as unauthenticated.
    if (!user) {
        throw new AppError(401, "User account no longer exists");
    }

    return user;
}
