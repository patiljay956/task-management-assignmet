import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Task } from "../models/task.model.js";

const createTask = asyncHandler(async (req, res) => {
    const { title, discription } = req.body;

    if (!(title && discription)) {
        throw new ApiError(400, "All fields are required");
    }

    try {
        const checkAllreadyTask = await Task.findOne({ title });

        if (checkAllreadyTask) {
            throw new ApiError(
                400,
                "Title is already defiend change the title"
            );
        }

        const task = await Task.create({
            title,
            discription,
        });

        const checkTaskCreate = await Task.findById(task._id);

        if (!checkTaskCreate) {
            throw new ApiError(500, "Task is not created");
        }
        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    checkTaskCreate,
                    "Task has beens Created Successfully"
                )
            );
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while creating a task",
            error.message
        );
    }
});

const updateTask = asyncHandler(async (req, res) => {
    const { oldTitle, newtitle, discription } = req.body;

    if (!(title || discription)) {
        throw new ApiError(400, "Field is required to update");
    }
    const task = await Task.findOneAndUpdate(
        { oldTitle },
        {
            $set: { title: newtitle, discription: discription },
        },
        { new: true }
    );

    if (!task) {
        throw new ApiError(
            "Something wnet Wrong while updating the Task",
            error.message
        );
    }
    return res
        .status(200)
        .json(new ApiResponse(200, task, "Task has been updated successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
    const { title } = req.body;

    if (!title) {
        throw new ApiError(400, "Title is required to delete the task");
    }

    const checkTask = await Task.findOne({ title });
    if (!checkTask) {
        throw new ApiError(400, "No such a task is avalible to delete");
    }

    const removeTask = await Task.findOneAndDelete({ title });
    if (!removeTask) {
        throw new ApiError(
            500,
            "Something went Wrong while deleteing the task",
            error.message
        );
    }
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Task has been deleted successfully "));
});

const updateStatus = asyncHandler(async (req, res) => {
    const { title, status } = req.body;

    if (!(title && status)) {
        throw new ApiError(400, "fields are required");
    }

    const task = await Task.findOne({ title });

    if (!task) {
        throw new ApiError(400, "no such a task is avalible");
    }

    if (task.status == status) {
        throw new ApiError(400, "Same task  cannot be updated");
    }

    const updateStatus = await Task.findOneAndUpdate(
        { title },
        { $set: { status: status } },
        { new: true }
    );

    if (!updateStatus) {
        throw new ApiError(500, "Something went wrong while updating status");
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, updateStatus, "status of the task is updated")
        );
});

const getAllTasks = asyncHandler(async (req, res) => {
    const allTask = await Task.find();

    if (!allTask) {
        throw new ApiError(500, "Unable to fetch the tasks");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, allTask, "Successfully Fetch all tasks"));
});
export { createTask, updateTask, deleteTask, getAllTasks, updateStatus };
