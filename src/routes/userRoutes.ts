import { Router } from "express";

import { getMe } from "../controllers/userController.js";
import authenticate from "../middleware/authenticate.js";

const userRouter = Router();

userRouter.get("/me", authenticate, getMe);

export default userRouter;
