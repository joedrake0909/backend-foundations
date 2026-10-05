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

export async function createProject(
    input: CreateProjectInput,
    ownerId: number
): Promise<Project> {
    const trimmedName = input.name.trim();

    if (trimmedName.length === 0) {
        throw new AppError(400, "Project name is required");
    }

    return createProjectRepository(
        {
            name: trimmedName,
            description: input.description
        },
        ownerId
    );
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
    input: UpdateProjectInput
): Promise<Project | null> {
    const updates: UpdateProjectInput = {};

    if (input.name !== undefined) {
        const trimmedName = input.name.trim();

        if (trimmedName.length === 0) {
            throw new AppError(400, "Project name cannot be empty");
        }

        updates.name = trimmedName;
    }

    if (Object.prototype.hasOwnProperty.call(input, "description")) {
        updates.description = input.description ?? null;
    }

    if (Object.keys(updates).length === 0) {
        throw new AppError(400, "At least one project field is required");
    }

    return updateProjectRepository(id, updates);
}


export async function deleteProject(
    id: number
): Promise<Project | null> {
    return deleteProjectRepository(id);
}


