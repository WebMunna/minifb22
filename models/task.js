
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    task: { type: String, required: true, minlength: 3, maxlength: 200},
    day: String,
    reminder: Boolean,
    date: { type: Date, default: new Date()},
});

const Task = mongoose.model("Task", taskSchema)

export default Task;
