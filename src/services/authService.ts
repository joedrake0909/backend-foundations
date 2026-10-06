import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
    JWT_ALGORITHM,
    JWT_EXPIRES_IN,
    JWT_SECRET
} from "../config/auth.js";
import {
    ConflictError,
    UnauthorizedError
} from "../errors/AppError.js";

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

const UNIQUE_VIOLATION = "23505";

const INVALID_CREDENTIALS = "Invalid email or password";

// Keeps unknown-email logins as slow as wrong-password ones.
const DUMMY_PASSWORD_HASH = bcrypt.hashSync(
    "not-a-real-password",
    PASSWORD_SALT_ROUNDS
);



function isUniqueViolation(error: unknown): boolean {
    return typeof error === "object"
        && error !== null
        && "code" in error
        && error.code === UNIQUE_VIOLATION;
}



export async function registerUser(
    input: RegisterUserInput
): Promise<User> {
    const { name, email, password } = input;

    const existingUser = await findUserByEmailRepository(email);

    if (existingUser) {
        throw new ConflictError("Email is already registered");
    }

    const passwordHash = await bcrypt.hash(
        password,
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
            throw new ConflictError("Email is already registered");
        }

        throw error;
    }
}



export async function loginUser(
    input: LoginInput
): Promise<AuthToken> {
    const user = await findUserByEmailRepository(input.email);

    const passwordMatches = await bcrypt.compare(
        input.password,
        user?.passwordHash ?? DUMMY_PASSWORD_HASH
    );

    if (!user || !passwordMatches) {
        throw new UnauthorizedError(INVALID_CREDENTIALS);
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
            throw new UnauthorizedError("Token has expired");
        }

        throw new UnauthorizedError("Invalid token");
    }

    if (typeof payload === "string") {
        throw new UnauthorizedError("Invalid token");
    }

    const id = Number(payload.sub);
    const role: unknown = payload.role;

    if (
        !Number.isInteger(id)
        || id <= 0
        || (role !== "user" && role !== "admin")
    ) {
        throw new UnauthorizedError("Invalid token");
    }

    return { id, role };
}
