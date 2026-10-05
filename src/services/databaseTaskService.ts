import { AppError } from "../errors/AppError.js";

import {
    findProjectById
} from "../repositories/projectRepository.js";

import {
    createTaskForProject as createTaskForProjectRepository,
    deleteTask as deleteTaskRepository,
    findTaskById as findTaskByIdRepository,
    listTasksForProject as listTasksForProjectRepository,
    updateTask as updateTaskRepository
} from "../repositories/taskRepository.js";

import type {
    CreateDatabaseTaskInput,
    DatabaseTask,
    DatabaseTaskStatus,
    UpdateDatabaseTaskInput
} from "../models/databaseTask.js";



function isDatabaseTaskStatus(
    value: unknown
): value is DatabaseTaskStatus {
    return value === "todo"
        || value === "in-progress"
        || value === "done";
}



export async function createTaskForProject(
    input: CreateDatabaseTaskInput,
    projectId: number
): Promise<DatabaseTask> {
    if (!Number.isInteger(projectId) || projectId <= 0) {
        throw new AppError(
            400,
            "Project ID must be a positive integer"
        );
    }

    const project = await findProjectById(projectId);

    if (!project) {
        throw new AppError(
            404,
            "Project not found"
        );
    }

    if (typeof input.title !== "string") {
    throw new AppError(
        400,
        "Task title is required"
    );
}

    const title = input.title.trim();

    if (title.length === 0) {
        throw new AppError(
            400,
            "Task title is required"
        );
    }

    if (
        input.description !== undefined
        && input.description !== null
        && typeof input.description !== "string"
    ) {
        throw new AppError(
            400,
            "Task description must be a string or null"
        );
    }

    if (
        input.status !== undefined
        && !isDatabaseTaskStatus(input.status)
    ) {
        throw new AppError(
            400,
            "Invalid task status"
        );
    }

    if (
        input.assignedTo !== undefined
        && input.assignedTo !== null
        && (
            !Number.isInteger(input.assignedTo)
            || input.assignedTo <= 0
        )
    ) {
        throw new AppError(
            400,
            "Assigned user ID must be a positive integer or null"
        );
    }

    return createTaskForProjectRepository(
        {
            title,
            description: input.description ?? null,
            status: input.status,
            assignedTo: input.assignedTo ?? null
        },
        projectId
    );
}



export async function listTasksForProject(
    projectId: number
): Promise<DatabaseTask[]> {
    if (!Number.isInteger(projectId) || projectId <= 0) {
        throw new AppError(
            400,
            "Project ID must be a positive integer"
        );
    }

    const project = await findProjectById(projectId);

    if (!project) {
        throw new AppError(
            404,
            "Project not found"
        );
    }

    return listTasksForProjectRepository(projectId);
}



export async function findTaskById(
    taskId: number
): Promise<DatabaseTask | null> {
    if (!Number.isInteger(taskId) || taskId <= 0) {
        throw new AppError(
            400,
            "Task ID must be a positive integer"
        );
    }

    return findTaskByIdRepository(taskId);
}



export async function updateTask(
    taskId: number,
    input: UpdateDatabaseTaskInput
): Promise<DatabaseTask | null> {
    if (!Number.isInteger(taskId) || taskId <= 0) {
        throw new AppError(
            400,
            "Task ID must be a positive integer"
        );
    }

    const updates: UpdateDatabaseTaskInput = {};

    if (Object.prototype.hasOwnProperty.call(input, "title")) {
        if (typeof input.title !== "string") {
            throw new AppError(
                400,
                "Task title must be a string"
            );
        }

        const title = input.title.trim();

        if (title.length === 0) {
            throw new AppError(
                400,
                "Task title cannot be empty"
            );
        }

        updates.title = title;
    }

    if (Object.prototype.hasOwnProperty.call(input, "description")) {
        if (
            input.description !== null
            && typeof input.description !== "string"
        ) {
            throw new AppError(
                400,
                "Task description must be a string or null"
            );
        }

        updates.description = input.description;
    }

    if (Object.prototype.hasOwnProperty.call(input, "status")) {
        if (!isDatabaseTaskStatus(input.status)) {
            throw new AppError(
                400,
                "Invalid task status"
            );
        }

        updates.status = input.status;
    }

    if (Object.prototype.hasOwnProperty.call(input, "assignedTo")) {
    if (
        input.assignedTo !== undefined
        && input.assignedTo !== null
        && (
            !Number.isInteger(input.assignedTo)
            || input.assignedTo <= 0
        )
    ) {
        throw new AppError(
            400,
            "Assigned user ID must be a positive integer or null"
        );
    }

    updates.assignedTo = input.assignedTo;
}

    if (Object.keys(updates).length === 0) {
        throw new AppError(
            400,
            "At least one task field is required"
        );
    }

    return updateTaskRepository(taskId, updates);
}





export async function deleteTask(
    taskId: number
): Promise<DatabaseTask | null> {
    if (!Number.isInteger(taskId) || taskId <= 0) {
        throw new AppError(
            400,
            "Task ID must be a positive integer"
        );
    }

    return deleteTaskRepository(taskId);
}



