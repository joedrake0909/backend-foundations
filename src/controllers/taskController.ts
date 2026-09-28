import type { Request, Response } from "express";

import {
    getTaskById as findTaskById,
    getTasks
} from "../services/taskService.js";

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



