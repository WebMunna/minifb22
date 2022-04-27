
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
    name: String,
    day: String,
    reminder: Boolean,
    date: { type: Date, default: new Date()},
}, {
    timestamps: true
});

const Task = mongoose.model("Task", taskSchema)

export default Task;
