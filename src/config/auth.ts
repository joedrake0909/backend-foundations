import "dotenv/config";
import type { SignOptions } from "jsonwebtoken";

const MIN_SECRET_LENGTH = 32;

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
    throw new Error("JWT_SECRET is required");
}

// A short or guessable secret lets anyone forge valid tokens, so refuse
// to start rather than run with one.
if (jwtSecret.length < MIN_SECRET_LENGTH) {
    throw new Error(
        `JWT_SECRET must be at least ${MIN_SECRET_LENGTH} characters`
    );
}

const jwtExpiresIn = process.env.JWT_EXPIRES_IN ?? "1h";

// Accept either a number of seconds ("3600") or a number with a unit
// ("15m", "1h", "1d").
if (!/^\d+[smhd]?$/.test(jwtExpiresIn)) {
    throw new Error(
        "JWT_EXPIRES_IN must look like 3600, 15m, 1h or 1d"
    );
}

export const JWT_SECRET: string = jwtSecret;

export const JWT_EXPIRES_IN = (
    /^\d+$/.test(jwtExpiresIn)
        ? Number(jwtExpiresIn)
        : jwtExpiresIn
) as NonNullable<SignOptions["expiresIn"]>;

export const JWT_ALGORITHM = "HS256";
