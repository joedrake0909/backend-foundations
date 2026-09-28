import { Router } from "express";

import {
    getTaskById,
    listTasks
} from "../controllers/taskController.js";

const taskRouter = Router();

taskRouter.get("/", listTasks);
taskRouter.get("/:id", getTaskById);

export default taskRouter;


