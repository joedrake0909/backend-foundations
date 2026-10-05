import type {
    NextFunction,
    Request,
    Response
} from "express";

import {
    createTaskForProject as createTaskForProjectService,
    deleteTask as deleteTaskService,
    findTaskById as findTaskByIdService,
    listTasksForProject as listTasksForProjectService,
    updateTask as updateTaskService
} from "../services/databaseTaskService.js";

import type {
    CreateDatabaseTaskInput,
    UpdateDatabaseTaskInput
} from "../models/databaseTask.js";



function parsePositiveId(
    value: unknown
): number | null {
    if (typeof value !== "string") {
        return null;
    }

    const parsedId = Number(value);

    if (!Number.isInteger(parsedId) || parsedId <= 0) {
        return null;
    }

    return parsedId;
}


export async function createTask(
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> {
    try {
        const projectId = parsePositiveId(request.params.id);

        if (projectId === null) {
            response.status(400).json({
                error: "Project ID must be a positive integer"
            });

            return;
        }

        const body = request.body as Record<string, unknown>;

        if (
            typeof body !== "object"
            || body === null
            || Array.isArray(body)
        ) {
            response.status(400).json({
                error: "Request body must be an object"
            });

            return;
        }

        const {
            title,
            description,
            status,
            assignedTo
        } = body;

        if (typeof title !== "string") {
            response.status(400).json({
                error: "Task title is required"
            });

            return;
        }

        if (
            description !== undefined
            && description !== null
            && typeof description !== "string"
        ) {
            response.status(400).json({
                error: "Task description must be a string or null"
            });

            return;
        }

        if (
            status !== undefined
            && status !== "todo"
            && status !== "in-progress"
            && status !== "done"
        ) {
            response.status(400).json({
                error: "Invalid task status"
            });

            return;
        }

        if (
            assignedTo !== undefined
            && assignedTo !== null
            && (
                typeof assignedTo !== "number"
                || !Number.isInteger(assignedTo)
                || assignedTo <= 0
            )
        ) {
            response.status(400).json({
                error: "Assigned user ID must be a positive integer or null"
            });

            return;
        }

        const input: CreateDatabaseTaskInput = {
            title,
            description,
            status,
            assignedTo
        };

        const task = await createTaskForProjectService(
            input,
            projectId
        );

        response.status(201).json(task);
    } catch (error) {
        next(error);
    }
}


export async function listTasks(
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> {
    try {
        const projectId = parsePositiveId(request.params.id);

        if (projectId === null) {
            response.status(400).json({
                error: "Project ID must be a positive integer"
            });

            return;
        }

        const tasks = await listTasksForProjectService(projectId);

        response.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
}





export async function updateTask(
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> {
    try {
        const taskId = parsePositiveId(request.params.id);

        if (taskId === null) {
            response.status(400).json({
                error: "Task ID must be a positive integer"
            });

            return;
        }

        const body = request.body as Record<string, unknown>;

        if (
            typeof body !== "object"
            || body === null
            || Array.isArray(body)
        ) {
            response.status(400).json({
                error: "Request body must be an object"
            });

            return;
        }

        const updates: UpdateDatabaseTaskInput = {};

        if (Object.prototype.hasOwnProperty.call(body, "title")) {
            if (typeof body.title !== "string") {
                response.status(400).json({
                    error: "Task title must be a string"
                });

                return;
            }

            updates.title = body.title;
        }

        if (Object.prototype.hasOwnProperty.call(body, "description")) {
            if (
                body.description !== null
                && typeof body.description !== "string"
            ) {
                response.status(400).json({
                    error: "Task description must be a string or null"
                });

                return;
            }

            updates.description = body.description;
        }

        if (Object.prototype.hasOwnProperty.call(body, "status")) {
            if (
                body.status !== "todo"
                && body.status !== "in-progress"
                && body.status !== "done"
            ) {
                response.status(400).json({
                    error: "Invalid task status"
                });

                return;
            }

            updates.status = body.status;
        }

        if (Object.prototype.hasOwnProperty.call(body, "assignedTo")) {
            if (
                body.assignedTo !== null
                && (
                    typeof body.assignedTo !== "number"
                    || !Number.isInteger(body.assignedTo)
                    || body.assignedTo <= 0
                )
            ) {
                response.status(400).json({
                    error: "Assigned user ID must be a positive integer or null"
                });

                return;
            }

            updates.assignedTo = body.assignedTo;
        }

        const task = await updateTaskService(taskId, updates);

        if (!task) {
            response.status(404).json({
                error: "Task not found"
            });

            return;
        }

        response.status(200).json(task);
    } catch (error) {
        next(error);
    }
}





export async function deleteTask(
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> {
    try {
        const taskId = parsePositiveId(request.params.id);

        if (taskId === null) {
            response.status(400).json({
                error: "Task ID must be a positive integer"
            });

            return;
        }

        const task = await deleteTaskService(taskId);

        if (!task) {
            response.status(404).json({
                error: "Task not found"
            });

            return;
        }

        response.status(204).send();
    } catch (error) {
        next(error);
    }
}







