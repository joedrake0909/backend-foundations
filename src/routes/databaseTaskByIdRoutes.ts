import { Router } from "express";

import {
    deleteTask,
    updateTask
} from "../controllers/databaseTaskController.js";
import authenticate from "../middleware/authenticate.js";

const databaseTaskByIdRouter = Router();

databaseTaskByIdRouter.patch("/:id", authenticate, updateTask);
databaseTaskByIdRouter.delete("/:id", authenticate, deleteTask);

export default databaseTaskByIdRouter;