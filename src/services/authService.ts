import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
    JWT_ALGORITHM,
    JWT_EXPIRES_IN,
    JWT_SECRET
} from "../config/auth.js";
import { AppError } from "../errors/AppError.js";

import {
    createUser as createUserRepository,
    findUserByEmail as findUserByEmailRepository
} from "../repositories/userRepository.js";

import type {
    AuthenticatedUser,
    AuthToken,
    LoginInput,
    RegisterUserInput,
    User
} from "../models/user.js";

const PASSWORD_SALT_ROUNDS = 10;

const MIN_PASSWORD_LENGTH = 8;

// bcrypt ignores bytes after 72.
const MAX_PASSWORD_BYTES = 72;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UNIQUE_VIOLATION = "23505";

const INVALID_CREDENTIALS = "Invalid email or password";

// Keeps unknown-email logins as slow as wrong-password ones.
const DUMMY_PASSWORD_HASH = bcrypt.hashSync(
    "not-a-real-password",
    PASSWORD_SALT_ROUNDS
);



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
        return await createUserRepository({
            name,
            email,
            passwordHash
        });
    } catch (error) {
        // Concurrent registration that slipped past the lookup.
        if (isUniqueViolation(error)) {
            throw new AppError(409, "Email is already registered");
        }

        throw error;
    }
}



export async function loginUser(
    input: LoginInput
): Promise<AuthToken> {
    const email = normalizeEmail(input.email);

    const user = await findUserByEmailRepository(email);

    const passwordMatches = await bcrypt.compare(
        input.password,
        user?.passwordHash ?? DUMMY_PASSWORD_HASH
    );

    if (!user || !passwordMatches) {
        throw new AppError(401, INVALID_CREDENTIALS);
    }

    // The payload is readable by anyone, so it holds no secrets.
    const token = jwt.sign(
        { role: user.role },
        JWT_SECRET,
        {
            subject: String(user.id),
            expiresIn: JWT_EXPIRES_IN,
            algorithm: JWT_ALGORITHM
        }
    );

    return {
        token,
        tokenType: "Bearer",
        expiresIn: JWT_EXPIRES_IN
    };
}



export function verifyAccessToken(
    token: string
): AuthenticatedUser {
    let payload: string | jwt.JwtPayload;

    try {
        payload = jwt.verify(token, JWT_SECRET, {
            algorithms: [JWT_ALGORITHM]
        });
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new AppError(401, "Token has expired");
        }

        throw new AppError(401, "Invalid token");
    }

    if (typeof payload === "string") {
        throw new AppError(401, "Invalid token");
    }

    const id = Number(payload.sub);
    const role: unknown = payload.role;

    if (
        !Number.isInteger(id)
        || id <= 0
        || (role !== "user" && role !== "admin")
    ) {
        throw new AppError(401, "Invalid token");
    }

    return { id, role };
}
