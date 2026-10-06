import {
    createProject as createProjectRepository,
    deleteProject as deleteProjectRepository,
    findProjectById as findProjectByIdRepository,
    listProjects as listProjectsRepository,
    updateProject as updateProjectRepository
} from "../repositories/projectRepository.js";

import { AppError } from "../errors/AppError.js";

import type {
    CreateProjectInput,
    Project,
    UpdateProjectInput
} from "../models/project.js";
import type { AuthenticatedUser } from "../models/user.js";

export function assertCanManageProject(
    project: Project,
    actor: AuthenticatedUser
): void {
    if (actor.role !== "admin" && project.ownerId !== actor.id) {
        throw new AppError(
            403,
            "You do not have permission to manage this project"
        );
    }
}

async function findManageableProject(
    id: number,
    actor: AuthenticatedUser
): Promise<Project | null> {
    const project = await findProjectByIdRepository(id);

    if (!project) {
        return null;
    }

    assertCanManageProject(project, actor);

    return project;
}

export async function createProject(
    input: CreateProjectInput,
    ownerId: number
): Promise<Project> {
    return createProjectRepository(input, ownerId);
}


export async function listProjects(): Promise<Project[]> {
    return listProjectsRepository();
}


export async function findProjectById(
    id: number
): Promise<Project | null> {
    return findProjectByIdRepository(id);
}


export async function updateProject(
    id: number,
    input: UpdateProjectInput,
    actor: AuthenticatedUser
): Promise<Project | null> {
    if (!await findManageableProject(id, actor)) {
        return null;
    }

    return updateProjectRepository(id, input);
}


export async function deleteProject(
    id: number,
    actor: AuthenticatedUser
): Promise<Project | null> {
    if (!await findManageableProject(id, actor)) {
        return null;
    }

    return deleteProjectRepository(id);
}


