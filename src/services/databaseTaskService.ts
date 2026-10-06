import { AppError } from "../errors/AppError.js";

import {
    findProjectById
} from "../repositories/projectRepository.js";
import {
    findUserById
} from "../repositories/userRepository.js";
import { assertCanManageProject } from "./projectService.js";

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
        throw new AppError(400, "Assigned user does not exist");
    }
}

async function assertCanManageTask(
    task: DatabaseTask,
    actor: AuthenticatedUser
): Promise<void> {
    const project = await findProjectById(task.projectId);

    if (!project) {
        throw new AppError(404, "Project not found");
    }

    assertCanManageProject(project, actor);
}



export async function createTaskForProject(
    input: CreateDatabaseTaskInput,
    projectId: number,
    actor: AuthenticatedUser
): Promise<DatabaseTask> {
    const project = await findProjectById(projectId);

    if (!project) {
        throw new AppError(404, "Project not found");
    }

    assertCanManageProject(project, actor);

    await assertAssigneeExists(input.assignedTo);

    return createTaskForProjectRepository(input, projectId);
}



export async function listTasksForProject(
    projectId: number
): Promise<DatabaseTask[]> {
    const project = await findProjectById(projectId);

    if (!project) {
        throw new AppError(404, "Project not found");
    }

    return listTasksForProjectRepository(projectId);
}



export async function findTaskById(
    taskId: number
): Promise<DatabaseTask | null> {
    return findTaskByIdRepository(taskId);
}



export async function updateTask(
    taskId: number,
    input: UpdateDatabaseTaskInput,
    actor: AuthenticatedUser
): Promise<DatabaseTask | null> {
    const task = await findTaskByIdRepository(taskId);

    if (!task) {
        return null;
    }

    await assertCanManageTask(task, actor);
    await assertAssigneeExists(input.assignedTo);

    return updateTaskRepository(taskId, input);
}



export async function deleteTask(
    taskId: number,
    actor: AuthenticatedUser
): Promise<DatabaseTask | null> {
    const task = await findTaskByIdRepository(taskId);

    if (!task) {
        return null;
    }

    await assertCanManageTask(task, actor);

    return deleteTaskRepository(taskId);
}
