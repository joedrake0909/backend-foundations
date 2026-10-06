import {
    BadRequestError,
    NotFoundError
} from "../errors/AppError.js";

import {
    findUserById
} from "../repositories/userRepository.js";
import {
    assertCanManageProject,
    findProjectById
} from "./projectService.js";

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
    UpdateDatabaseTaskInput
} from "../models/databaseTask.js";
import type { AuthenticatedUser } from "../models/user.js";



async function assertAssigneeExists(
    assignedTo: number | null | undefined
): Promise<void> {
    if (assignedTo === undefined || assignedTo === null) {
        return;
    }

    if (!await findUserById(assignedTo)) {
        throw new BadRequestError("Assigned user does not exist");
    }
}

async function findManageableTask(
    taskId: number,
    actor: AuthenticatedUser
): Promise<DatabaseTask> {
    const task = await findTaskById(taskId);
    const project = await findProjectById(task.projectId);

    assertCanManageProject(project, actor);

    return task;
}



export async function createTaskForProject(
    input: CreateDatabaseTaskInput,
    projectId: number,
    actor: AuthenticatedUser
): Promise<DatabaseTask> {
    const project = await findProjectById(projectId);

    assertCanManageProject(project, actor);

    await assertAssigneeExists(input.assignedTo);

    return createTaskForProjectRepository(input, projectId);
}



export async function listTasksForProject(
    projectId: number
): Promise<DatabaseTask[]> {
    await findProjectById(projectId);

    return listTasksForProjectRepository(projectId);
}



export async function findTaskById(
    taskId: number
): Promise<DatabaseTask> {
    const task = await findTaskByIdRepository(taskId);

    if (!task) {
        throw new NotFoundError("Task not found");
    }

    return task;
}



export async function updateTask(
    taskId: number,
    input: UpdateDatabaseTaskInput,
    actor: AuthenticatedUser
): Promise<DatabaseTask> {
    await findManageableTask(taskId, actor);
    await assertAssigneeExists(input.assignedTo);

    const task = await updateTaskRepository(taskId, input);

    if (!task) {
        throw new NotFoundError("Task not found");
    }

    return task;
}



export async function deleteTask(
    taskId: number,
    actor: AuthenticatedUser
): Promise<void> {
    await findManageableTask(taskId, actor);

    const task = await deleteTaskRepository(taskId);

    if (!task) {
        throw new NotFoundError("Task not found");
    }
}
