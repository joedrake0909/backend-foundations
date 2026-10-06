import {
    createProject as createProjectRepository,
    deleteProject as deleteProjectRepository,
    findProjectById as findProjectByIdRepository,
    listProjects as listProjectsRepository,
    updateProject as updateProjectRepository
} from "../repositories/projectRepository.js";

import {
    ForbiddenError,
    NotFoundError
} from "../errors/AppError.js";

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
        throw new ForbiddenError(
            "You do not have permission to manage this project"
        );
    }
}

async function findManageableProject(
    id: number,
    actor: AuthenticatedUser
): Promise<Project> {
    const project = await findProjectById(id);

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
): Promise<Project> {
    const project = await findProjectByIdRepository(id);

    if (!project) {
        throw new NotFoundError("Project not found");
    }

    return project;
}


export async function updateProject(
    id: number,
    input: UpdateProjectInput,
    actor: AuthenticatedUser
): Promise<Project> {
    await findManageableProject(id, actor);

    const project = await updateProjectRepository(id, input);

    if (!project) {
        throw new NotFoundError("Project not found");
    }

    return project;
}


export async function deleteProject(
    id: number,
    actor: AuthenticatedUser
): Promise<void> {
    await findManageableProject(id, actor);

    const project = await deleteProjectRepository(id);

    if (!project) {
        throw new NotFoundError("Project not found");
    }
}
