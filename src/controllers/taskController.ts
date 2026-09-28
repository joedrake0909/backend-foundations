import type { Request, Response } from "express";

import type {
    UpdateTaskInput,
    CreateTaskInput,
    TaskPriority,
    TaskStatus
} from "../models/task.js";

import {
    deleteTask as deleteTaskService,
    updateTask as updateTaskService,
    createTask as createTaskService,
    getTaskById as findTaskById,
    getTasks
} from "../services/taskService.js";


function isTaskStatus(value: unknown): value is TaskStatus {
    return value === "todo"
        || value === "in-progress"
        || value === "done";
}

function isTaskPriority(value: unknown): value is TaskPriority {
    return value === "low"
        || value === "medium"
        || value === "high";
}


export function listTasks(
    _request: Request,
    response: Response
): void {
    const tasks = getTasks();

    response.status(200).json(tasks);
}

export function getTaskById(
    request: Request,
    response: Response
): void {
    const taskId = Number(request.params.id);

    if (!Number.isInteger(taskId)) {
        response.status(400).json({
            error: "Task ID must be a number"
        });

        return;
    }

    const task = findTaskById(taskId);

    if (!task) {
        response.status(404).json({
            error: "Task not found"
        });

        return;
    }

    response.status(200).json(task);
}



export function createTask(
    request: Request,
    response: Response
): void {
    const body = request.body as Partial<CreateTaskInput>;

    const {
        title,
        description,
        status,
        priority,
        assignee
    } = body;

    if (
        typeof title !== "string"
        || typeof description !== "string"
        || !isTaskStatus(status)
        || !isTaskPriority(priority)
        || typeof assignee !== "string"
    ) {
        response.status(400).json({
            error: "Invalid task data"
        });

        return;
    }

    const task = createTaskService({
        title,
        description,
        status,
        priority,
        assignee
    });

    response.status(201).json(task);
}



export function updateTask(
    request: Request,
    response: Response
): void {
    const taskId = Number(request.params.id);

    if (!Number.isInteger(taskId)) {
        response.status(400).json({
            error: "Task ID must be a number"
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
        priority,
        assignee
    } = body;

    if (
        title !== undefined
        && typeof title !== "string"
    ) {
        response.status(400).json({
            error: "Title must be a string"
        });

        return;
    }

    if (
        description !== undefined
        && typeof description !== "string"
    ) {
        response.status(400).json({
            error: "Description must be a string"
        });

        return;
    }

    if (
        status !== undefined
        && !isTaskStatus(status)
    ) {
        response.status(400).json({
            error: "Invalid status"
        });

        return;
    }

    if (
        priority !== undefined
        && !isTaskPriority(priority)
    ) {
        response.status(400).json({
            error: "Invalid priority"
        });

        return;
    }

    if (
        assignee !== undefined
        && typeof assignee !== "string"
    ) {
        response.status(400).json({
            error: "Assignee must be a string"
        });

        return;
    }

    const updates: UpdateTaskInput = {};

    if (title !== undefined) {
        updates.title = title;
    }

    if (description !== undefined) {
        updates.description = description;
    }

    if (status !== undefined) {
        updates.status = status;
    }

    if (priority !== undefined) {
        updates.priority = priority;
    }

    if (assignee !== undefined) {
        updates.assignee = assignee;
    }

    if (Object.keys(updates).length === 0) {
        response.status(400).json({
            error: "At least one update field is required"
        });

        return;
    }

    const task = updateTaskService(taskId, updates);

    if (!task) {
        response.status(404).json({
            error: "Task not found"
        });

        return;
    }

    response.status(200).json(task);
}



export function deleteTask(
    request: Request,
    response: Response
): void {
    const taskId = Number(request.params.id);

    if (!Number.isInteger(taskId)) {
        response.status(400).json({
            error: "Task ID must be a number"
        });

        return;
    }

    const deletedTask = deleteTaskService(taskId);

    if (!deletedTask) {
        response.status(404).json({
            error: "Task not found"
        });

        return;
    }

    response.status(204).send();
}