import bcrypt from "bcryptjs";

import { AppError } from "../errors/AppError.js";

import {
    createUser as createUserRepository,
    findUserByEmail as findUserByEmailRepository
} from "../repositories/userRepository.js";

import type {
    RegisterUserInput,
    User
} from "../models/user.js";

// Cost factor for bcrypt. Each +1 doubles the hashing work, which slows
// down offline guessing if the users table is ever leaked.
const PASSWORD_SALT_ROUNDS = 10;

const MIN_PASSWORD_LENGTH = 8;

// bcrypt only uses the first 72 bytes of a password.
const MAX_PASSWORD_BYTES = 72;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UNIQUE_VIOLATION = "23505";



function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
}

function isUniqueViolation(error: unknown): boolean {
    return typeof error === "object"
        && error !== null
        && "code" in error
        && error.code === UNIQUE_VIOLATION;
}



export async function registerUser(
    input: RegisterUserInput
): Promise<User> {
    const name = input.name.trim();

    if (name.length === 0 || name.length > 100) {
        throw new AppError(
            400,
            "Name must be between 1 and 100 characters"
        );
    }

    const email = normalizeEmail(input.email);

    if (email.length > 255 || !EMAIL_PATTERN.test(email)) {
        throw new AppError(400, "A valid email is required");
    }

    if (
        input.password.length < MIN_PASSWORD_LENGTH
        || Buffer.byteLength(input.password, "utf8") > MAX_PASSWORD_BYTES
    ) {
        throw new AppError(
            400,
            `Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_BYTES} bytes`
        );
    }

    const existingUser = await findUserByEmailRepository(email);

    if (existingUser) {
        throw new AppError(409, "Email is already registered");
    }

    const passwordHash = await bcrypt.hash(
        input.password,
        PASSWORD_SALT_ROUNDS
    );

    try {
        // The role is never taken from the request; the database default
        // ('user') applies, so nobody can register themselves as admin.
        return await createUserRepository({
            name,
            email,
            passwordHash
        });
    } catch (error) {
        // Two simultaneous registrations can both pass the lookup above.
        // The UNIQUE constraint still rejects the second one.
        if (isUniqueViolation(error)) {
            throw new AppError(409, "Email is already registered");
        }

        throw error;
    }
}
