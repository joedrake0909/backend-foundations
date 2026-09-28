import requestLogger from "./middleware/requestLogger.js";
import express from "express";

const app = express();
app.use(requestLogger);
app.use(express.json());
app.use(requestLogger);

app.get("/health", (_request, response) => {
    response.status(200).json({
        status: "ok"
    });
});

export default app;