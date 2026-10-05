import requestLogger from "./middleware/requestLogger.js";
import express from "express";
import taskRouter from "./routes/taskRoutes.js";
import projectRouter from "./routes/projectRoutes.js";
import errorHandler from "./middleware/errorHandler.js";



const app = express();

app.use(express.json());
app.use(requestLogger);
app.use("/projects", projectRouter);
app.use(errorHandler);

app.get("/health", (_request, response) => {
    response.status(200).json({
        status: "ok"
    });
});

app.use("/tasks", taskRouter);

export default app;