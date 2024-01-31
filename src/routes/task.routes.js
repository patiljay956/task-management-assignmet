import { Router } from "express";
import {
    createTask,
    deleteTask,
    getAllTasks,
    updateStatus,
    updateTask,
} from "../controllers/task.controller.js";

const router = Router();
router.route("/create-task").post(createTask);
router.route("/update-task").post(updateTask);
router.route("/delete-task").post(deleteTask);
router.route("/get-all-task").post(getAllTasks);
router.route("/update-status").post(updateStatus);
export default router;
