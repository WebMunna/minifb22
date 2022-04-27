import express from "express";
import Joi from "joi";
import Task from "../models/task.js"
import protect from "../middleware/authMiddleware.js";
import UserModel from "../models/userModel.js";

const router = express.Router();

router.post("/",protect, async (req, res) => {
    const schema =Joi.object({
        name: Joi.string(),
        day: Joi.string(),
        reminder: Joi.boolean(),
        
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const {name, day, reminder } = req.body;

     const user = req.user.id

     console.log(user)

    let tas = new Task({user, name, day, reminder });

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
    router.delete("/:id", protect, async(req, res) => {
        try {
             const task = await Task.findById(req.params.id);
             if(!task) return res.status(404).send("Todo not found...");

             //Check for user
             const user = await UserModel.findById(req.user.id)
             if(!user) {
                 res.status(401).send(
                     'User not found'
                 )
             }
            

             //Make sure the task creater and logged in user are same
             if(task.user.toString() !== user.id) {
                 res.status(401).send('You Can Delete Only Your Post')
             } else {
                const deleteTask = await Task.findByIdAndDelete(req.params.id);
                res.send(deleteTask);
             }
            

            
        } catch (error) {
             console.log(error.message);
            //  res.status(500).send("Error:" + error.message)
        }
    })
    router.put("/:id",protect, async(req, res) => {
        const schema = Joi.object({
           
            day: Joi.string(),
            reminder: Joi.boolean(),
            
        });

        const { error } = schema.validate(req.body);

        if (error) return res.status(400).send(error.details[0].message);

        const tas = await Task.findById(req.params.id);

        if(!tas) return res.status(404).send("Task not found...");



        const { day, reminder} = req.body;
          //Check for user
          const user = await UserModel.findById(req.user.id)
          if(!user) {
              res.status(401).send(
                  'User not found'
              )
          }

           //Make sure the task creater and logged in user are same
           if(tas.user.toString() !== user.id) {
            res.status(401).send('You Can Edit Only Your Post')
        } else {
           
            const updatedTask = await Task.findByIdAndUpdate(
                req.params.id,
                {  day, reminder },
                { new: true }
            );
    
            res.send(updatedTask);
        }
       

       
    })


export default router;