import type {
    NextFunction,
    Request,
    Response
} from "express";

import { currentUser } from "../middleware/authenticate.js";
import {
    createTaskForProject as createTaskForProjectService,
    deleteTask as deleteTaskService,
    listTasksForProject as listTasksForProjectService,
    updateTask as updateTaskService
} from "../services/databaseTaskService.js";
import { idParamSchema } from "../validators/common.js";
import {
    createTaskSchema,
    updateTaskSchema
} from "../validators/taskValidators.js";

export async function createTask(
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { id: projectId } = idParamSchema.parse(request.params);
        const input = createTaskSchema.parse(request.body);

        const task = await createTaskForProjectService(
            input,
            projectId,
            currentUser(request)
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
        const { id: projectId } = idParamSchema.parse(request.params);

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
        const { id: taskId } = idParamSchema.parse(request.params);
        const updates = updateTaskSchema.parse(request.body);

        const task = await updateTaskService(
            taskId,
            updates,
            currentUser(request)
        );

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
        const { id: taskId } = idParamSchema.parse(request.params);

        const task = await deleteTaskService(
            taskId,
            currentUser(request)
        );

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
