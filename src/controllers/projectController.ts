import type {
    NextFunction,
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
        const input = createProjectSchema.parse(request.body);

        const project = await createProjectService(
            input,
            currentUser(request).id
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
        const { id } = idParamSchema.parse(request.params);

        const project = await findProjectByIdService(id);

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
        const { id } = idParamSchema.parse(request.params);
        const updates = updateProjectSchema.parse(request.body);

        const project = await updateProjectService(
            id,
            updates,
            currentUser(request)
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
        const { id } = idParamSchema.parse(request.params);

        const project = await deleteProjectService(
            id,
            currentUser(request)
        );

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
