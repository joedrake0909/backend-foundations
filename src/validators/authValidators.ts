import { z } from "zod";

import {
    bodyObject,
    stringField
} from "./common.js";

const emailSchema = stringField("Email")
    .trim()
    .toLowerCase()
    .max(255, "Email must be at most 255 characters")
    .pipe(z.email("Email must be a valid email address"));

export const registerSchema = bodyObject({
    name: stringField("Name")
        .trim()
        .min(1, "Name is required")
        .max(100, "Name must be at most 100 characters"),
    email: emailSchema,
    password: stringField("Password")
        .min(8, "Password must be at least 8 characters")
        // bcrypt ignores bytes after 72.
        .refine(
            (password) => Buffer.byteLength(password, "utf8") <= 72,
            "Password must be at most 72 bytes"
        )
});

// Login only checks shape; format rules would hint at which accounts exist.
export const loginSchema = bodyObject({
    email: stringField("Email")
        .trim()
        .toLowerCase()
        .min(1, "Email is required")
        .max(255, "Email must be at most 255 characters"),
    password: stringField("Password")
        .min(1, "Password is required")
});
