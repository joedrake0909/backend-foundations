import {
    AppError,
    BadRequestError,
    ConflictError
} from "./AppError.js";

// PostgreSQL error codes: https://www.postgresql.org/docs/current/errcodes-appendix.html
const DATABASE_ERRORS: Record<string, () => AppError> = {
    "23505": () => new ConflictError("Resource already exists"),
    "23503": () => new BadRequestError("Related resource does not exist"),
    "23502": () => new BadRequestError("A required value is missing"),
    "22001": () => new BadRequestError("A value is too long"),
    "22P02": () => new BadRequestError("A value has an invalid format"),
    "22003": () => new BadRequestError("A number is out of range")
};

// Returns a safe client error for known constraint/format failures, or null
// when the error should stay a 500. Raw PostgreSQL messages never leave here.
export function mapDatabaseError(error: unknown): AppError | null {
    if (
        typeof error !== "object"
        || error === null
        || !("code" in error)
        || typeof error.code !== "string"
    ) {
        return null;
    }

    return DATABASE_ERRORS[error.code]?.() ?? null;
}
