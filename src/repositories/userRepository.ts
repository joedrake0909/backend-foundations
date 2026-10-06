import { pool } from "../config/database.js";

import type {
    CreateUserInput,
    User,
    UserRole,
    UserWithPasswordHash
} from "../models/user.js";

interface UserRow {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    created_at: Date;
}

interface UserWithPasswordHashRow extends UserRow {
    password_hash: string;
}

function mapRowToUser(row: UserRow): User {
    return {
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
        createdAt: row.created_at.toISOString()
    };
}

export async function findUserByEmail(
    email: string
): Promise<UserWithPasswordHash | null> {
    const result = await pool.query<UserWithPasswordHashRow>(
        `
        SELECT id, name, email, password_hash, role, created_at
        FROM users
        WHERE email = $1
        `,
        [email]
    );

    const row = result.rows[0];

    if (!row) {
        return null;
    }

    return {
        ...mapRowToUser(row),
        passwordHash: row.password_hash
    };
}



export async function findUserById(
    id: number
): Promise<User | null> {
    const result = await pool.query<UserRow>(
        `
        SELECT id, name, email, role, created_at
        FROM users
        WHERE id = $1
        `,
        [id]
    );

    const row = result.rows[0];

    if (!row) {
        return null;
    }

    return mapRowToUser(row);
}



export async function createUser(
    input: CreateUserInput
): Promise<User> {
    const result = await pool.query<UserRow>(
        `
        INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, role, created_at
        `,
        [
            input.name,
            input.email,
            input.passwordHash
        ]
    );

    const row = result.rows[0];

    if (!row) {
        throw new Error("User insert returned no row");
    }

    return mapRowToUser(row);
}
