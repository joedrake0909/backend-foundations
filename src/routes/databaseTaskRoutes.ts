import { Router } from "express";

import {
    createTask,
    listTasks
} from "../controllers/databaseTaskController.js";
import authenticate from "../middleware/authenticate.js";

const databaseTaskRouter = Router({
    mergeParams: true
});

databaseTaskRouter.use(authenticate);

databaseTaskRouter.post("/", createTask);
databaseTaskRouter.get("/", listTasks);

export default databaseTaskRouter;