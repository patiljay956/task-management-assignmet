import express from "express";
import cors from "cors";

const app = express();

// Configurations and middlwares

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(express.json({ limit: "16kb" }));

import userRouter from "./routes/user.routes.js";
import taskRouter from "./routes/task.routes.js";
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tasks", taskRouter);
export default app;
