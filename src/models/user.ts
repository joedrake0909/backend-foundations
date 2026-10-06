export type UserRole = "user" | "admin";

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    createdAt: string;
}

// Internal only: never return in a response.
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

export interface AuthenticatedUser {
    id: number;
    role: UserRole;
}

export interface AuthToken {
    token: string;
    tokenType: "Bearer";
    expiresIn: string | number;
}
