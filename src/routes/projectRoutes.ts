import { Router } from "express";

import {
    createProject,
    deleteProject,
    getProjectById,
    listProjects,
    updateProject
} from "../controllers/projectController.js";


const projectRouter = Router();

projectRouter.get("/", listProjects);
projectRouter.post("/", createProject);
projectRouter.get("/:id", getProjectById);
projectRouter.patch("/:id", updateProject);
projectRouter.delete("/:id", deleteProject);

export default projectRouter;