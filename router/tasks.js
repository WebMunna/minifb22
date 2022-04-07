import express from "express";
import Joi from "joi";
import Task from "../models/task.js"

const router = express.Router();

router.post("/", async (req, res) => {
    const schema =Joi.object({
        task: Joi.string().min(3).max(300).required(),
        day: Joi.string(),
        reminder: Joi.boolean(),
        
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { task, day, reminder } = req.body;

    let tas = new Task({ task, day, reminder });

    tas = await tas.save();
    res.send(tas)

});

    router.get("/", async(req, res) => {
        try {
             const tasks = await Task.find().sort({ date: -1});
             res.send(tasks)
        } catch (error) {
             console.log(error.message);
             res.status(500).send("Error:" + error.message)
        }
    })
    router.delete("/:id", async(req, res) => {
        try {
             const task = await Task.findById(req.params.id);
             if(!task) return res.status(404).send("Todo not found...");

             const deleteTask = await Task.findByIdAndDelete(req.params.id);

             res.send(deleteTask);
        } catch (error) {
             console.log(error.message);
             res.status(500).send("Error:" + error.message)
        }
    })
    router.put("/:id", async(req, res) => {
        const schema = Joi.object({
            task: Joi.string().min(3).max(300).required(),
            day: Joi.string(),
            reminder: Joi.boolean(),
            
        });

        const { error } = schema.validate(req.body);

        if (error) return res.status(400).send(error.details[0].message);

        const tas = await Task.findById(req.params.id);

        if(!tas) return res.status(404).send("Task not found...");

        const { task, day, reminder} = req.body;

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { task, day, reminder },
            { new: true }
        );

        res.send(updatedTask);
    })


export default router;