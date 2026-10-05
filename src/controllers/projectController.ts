import type {
    NextFunction,
    Request,
    Response
} from "express";

import {
    createProject as createProjectService,
    deleteProject as deleteProjectService,
    findProjectById as findProjectByIdService,
    listProjects as listProjectsService,
    updateProject as updateProjectService
} from "../services/projectService.js";
import type {
    CreateProjectInput,
    UpdateProjectInput
} from "../models/project.js";

export async function listProjects(
    _request: Request,
    response: Response,
    next: NextFunction
): Promise<void> {
    try {
        const projects = await listProjectsService();

        response.status(200).json(projects);
    } catch (error) {
        next(error);
    }
}

export async function createProject(
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> {
    try {
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
            name,
            description
        } = body;

        if (typeof name !== "string") {
            response.status(400).json({
                error: "Project name is required"
            });

            return;
        }

        if (
            description !== undefined
            && description !== null
            && typeof description !== "string"
        ) {
            response.status(400).json({
                error: "Project description must be a string or null"
            });

            return;
        }

        const input: CreateProjectInput = {
            name,
            description
        };

        const temporaryOwnerId = 1;

        const project = await createProjectService(
            input,
            temporaryOwnerId
        );

        response.status(201).json(project);
    } catch (error) {
        next(error);
    }
}


export async function getProjectById(
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> {
    try {
        const projectId = Number(request.params.id);

        if (!Number.isInteger(projectId) || projectId <= 0) {
            response.status(400).json({
                error: "Project ID must be a positive integer"
            });

            return;
        }

        const project = await findProjectByIdService(projectId);

        if (!project) {
            response.status(404).json({
                error: "Project not found"
            });

            return;
        }

        response.status(200).json(project);
    } catch (error) {
        next(error);
    }
}

export async function updateProject(
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> {
    try {
        const projectId = Number(request.params.id);

        if (!Number.isInteger(projectId) || projectId <= 0) {
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

        const updates: UpdateProjectInput = {};

        if (body.name !== undefined) {
            if (typeof body.name !== "string") {
                response.status(400).json({
                    error: "Project name must be a string"
                });

                return;
            }

            updates.name = body.name;
        }

        if (Object.prototype.hasOwnProperty.call(body, "description")) {
            if (
                body.description !== null
                && typeof body.description !== "string"
            ) {
                response.status(400).json({
                    error: "Project description must be a string or null"
                });

                return;
            }

            updates.description = body.description;
        }

        if (Object.keys(updates).length === 0) {
            response.status(400).json({
                error: "At least one project field is required"
            });

            return;
        }

        const project = await updateProjectService(
            projectId,
            updates
        );

        if (!project) {
            response.status(404).json({
                error: "Project not found"
            });

            return;
        }

        response.status(200).json(project);
    } catch (error) {
        next(error);
    }
}


export async function deleteProject(
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> {
    try {
        const projectId = Number(request.params.id);

        if (!Number.isInteger(projectId) || projectId <= 0) {
            response.status(400).json({
                error: "Project ID must be a positive integer"
            });

            return;
        }

        const project = await deleteProjectService(projectId);

        if (!project) {
            response.status(404).json({
                error: "Project not found"
            });

            return;
        }

        response.status(204).send();
    } catch (error) {
        next(error);
    }
}