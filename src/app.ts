import express from "express";

import requestLogger from "./middleware/requestLogger.js";
import errorHandler from "./middleware/errorHandler.js";

import authRouter from "./routes/authRoutes.js";
import projectRouter from "./routes/projectRoutes.js";
import databaseTaskRouter from "./routes/databaseTaskRoutes.js";
import databaseTaskByIdRouter from "./routes/databaseTaskByIdRoutes.js";
import taskRouter from "./routes/taskRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

app.use(express.json());
app.use(requestLogger);

app.get("/health", (_request, response) => {
    response.status(200).json({
        status: "ok"
    });
});

app.use("/auth", authRouter);
app.use("/users", userRouter);

app.use("/projects", projectRouter);

app.use(
    "/projects/:id/tasks",
    databaseTaskRouter
);

app.use(
    "/tasks",
    databaseTaskByIdRouter
);

app.use("/tasks", taskRouter);

app.use(errorHandler);

export default app;