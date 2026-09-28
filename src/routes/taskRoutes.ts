import { Router } from "express";

import {
    updateTask,
    createTask,
    getTaskById,
    listTasks
} from "../controllers/taskController.js";

const taskRouter = Router();

taskRouter.get("/", listTasks);
taskRouter.get("/:id", getTaskById);
taskRouter.post("/", createTask);
taskRouter.patch("/:id", updateTask);

export default taskRouter;


