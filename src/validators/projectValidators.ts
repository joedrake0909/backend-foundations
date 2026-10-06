import { z } from "zod";

import {
    bodyObject,
    hasAtLeastOneField,
    stringField
} from "./common.js";

const nameSchema = stringField("Project name")
    .trim()
    .min(1, "Project name is required")
    .max(150, "Project name must be at most 150 characters");

const descriptionSchema = z
    .string({ error: "Project description must be a string or null" })
    .trim()
    .max(2000, "Project description must be at most 2000 characters")
    .nullable();

export const createProjectSchema = bodyObject({
    name: nameSchema,
    description: descriptionSchema.optional()
});

export const updateProjectSchema = bodyObject({
    name: nameSchema.optional(),
    description: descriptionSchema.optional()
}).refine(
    hasAtLeastOneField,
    "At least one project field is required"
);
