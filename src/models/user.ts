export type UserRole = "user" | "admin";

// Safe API shape. It deliberately has no password hash so it can be
// returned in any response.
export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    createdAt: string;
}

// Internal shape used only by the authentication service to verify a
// password. It must never be sent in an API response.
export interface UserWithPasswordHash extends User {
    passwordHash: string;
}

export interface RegisterUserInput {
    name: string;
    email: string;
    password: string;
}

export interface CreateUserInput {
    name: string;
    email: string;
    passwordHash: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

// The identity proven by a verified JWT. Authentication middleware
// attaches it to the request as request.user.
export interface AuthenticatedUser {
    id: number;
    role: UserRole;
}

export interface AuthToken {
    token: string;
    tokenType: "Bearer";
    expiresIn: string | number;
}
