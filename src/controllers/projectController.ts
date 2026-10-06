import type {
    Request,
    Response
} from "express";

import { currentUser } from "../middleware/authenticate.js";
import {
    createProject as createProjectService,
    deleteProject as deleteProjectService,
    findProjectById as findProjectByIdService,
    listProjects as listProjectsService,
    updateProject as updateProjectService
} from "../services/projectService.js";
import { idParamSchema } from "../validators/common.js";
import {
    createProjectSchema,
    updateProjectSchema
} from "../validators/projectValidators.js";

// Express 5 forwards errors thrown in async handlers to errorHandler.

export async function listProjects(
    _request: Request,
    response: Response
): Promise<void> {
    const projects = await listProjectsService();

    response.status(200).json(projects);
}

export async function createProject(
    request: Request,
    response: Response
): Promise<void> {
    const input = createProjectSchema.parse(request.body);

    const project = await createProjectService(
        input,
        currentUser(request).id
    );

    response.status(201).json(project);
}

export async function getProjectById(
    request: Request,
    response: Response
): Promise<void> {
    const { id } = idParamSchema.parse(request.params);

    const project = await findProjectByIdService(id);

    response.status(200).json(project);
}

export async function updateProject(
    request: Request,
    response: Response
): Promise<void> {
    const { id } = idParamSchema.parse(request.params);
    const updates = updateProjectSchema.parse(request.body);

    const project = await updateProjectService(
        id,
        updates,
        currentUser(request)
    );

    response.status(200).json(project);
}

export async function deleteProject(
    request: Request,
    response: Response
): Promise<void> {
    const { id } = idParamSchema.parse(request.params);

    await deleteProjectService(id, currentUser(request));

    response.status(204).send();
}
