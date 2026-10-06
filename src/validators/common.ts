import { z } from "zod";

// Largest value a PostgreSQL INTEGER / SERIAL column can hold.
const MAX_INTEGER_ID = 2147483647;

export const positiveIdSchema = z
    .number({ error: "ID must be a positive integer" })
    .int("ID must be a positive integer")
    .positive("ID must be a positive integer")
    .max(MAX_INTEGER_ID, "ID is too large");

export const idParamSchema = z.object({
    id: z
        .string()
        .regex(/^\d+$/, "ID must be a positive integer")
        .transform(Number)
        .pipe(positiveIdSchema)
});

export function bodyObject<Shape extends z.ZodRawShape>(shape: Shape) {
    return z.strictObject(shape, {
        error: (issue) => issue.code === "unrecognized_keys"
            ? `Unknown field(s): ${issue.keys.join(", ")}`
            : "Request body must be a JSON object"
    });
}

export function hasAtLeastOneField(value: object): boolean {
    return Object.keys(value).length > 0;
}

export function stringField(label: string) {
    return z.string({
        error: (issue) => issue.input === undefined
            ? `${label} is required`
            : `${label} must be a string`
    });
}
