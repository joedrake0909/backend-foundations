import { Router } from "express";

import {
    changeUserRole,
    listUsers
} from "../controllers/adminController.js";
import authenticate from "../middleware/authenticate.js";
import requireRole from "../middleware/requireRole.js";

const adminRouter = Router();

adminRouter.use(authenticate, requireRole("admin"));

adminRouter.get("/users", listUsers);
adminRouter.patch("/users/:id/role", changeUserRole);

export default adminRouter;
