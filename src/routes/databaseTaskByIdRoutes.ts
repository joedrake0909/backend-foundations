import { Router } from "express";

import {
    deleteTask,
    updateTask
} from "../controllers/databaseTaskController.js";

const databaseTaskByIdRouter = Router();

databaseTaskByIdRouter.patch("/:id", updateTask);
databaseTaskByIdRouter.delete("/:id", deleteTask);

export default databaseTaskByIdRouter;