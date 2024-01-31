import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        discription: {
            type: String,
            required: true,
        },
        status: {
            type: String,
        },
    },
    { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);
