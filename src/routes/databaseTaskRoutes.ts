import { Router } from "express";

import {
    createTask,
    listTasks
} from "../controllers/databaseTaskController.js";

const databaseTaskRouter = Router({
    mergeParams: true
});

databaseTaskRouter.post("/", createTask);
databaseTaskRouter.get("/", listTasks);

export default databaseTaskRouter;