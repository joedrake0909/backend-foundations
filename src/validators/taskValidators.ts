import { z } from "zod";

import {
    bodyObject,
    hasAtLeastOneField,
    positiveIdSchema,
    stringField
} from "./common.js";

export const taskStatusSchema = z.enum(
    ["todo", "in-progress", "done"],
    "Status must be one of: todo, in-progress, done"
);

const titleSchema = stringField("Task title")
    .trim()
    .min(1, "Task title is required")
    .max(200, "Task title must be at most 200 characters");

const descriptionSchema = z
    .string({ error: "Task description must be a string or null" })
    .trim()
    .max(2000, "Task description must be at most 2000 characters")
    .nullable();

const assignedToSchema = positiveIdSchema.nullable();

export const createTaskSchema = bodyObject({
    title: titleSchema,
    description: descriptionSchema.optional(),
    status: taskStatusSchema.optional(),
    assignedTo: assignedToSchema.optional()
});

export const updateTaskSchema = bodyObject({
    title: titleSchema.optional(),
    description: descriptionSchema.optional(),
    status: taskStatusSchema.optional(),
    assignedTo: assignedToSchema.optional()
}).refine(
    hasAtLeastOneField,
    "At least one task field is required"
);
