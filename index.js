import cors from "cors";
import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import tasks from "./router/tasks.js";
import path from "path"

import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
console.log(__filename);
console.log(__dirname);





dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/tasks", tasks);



//serving static assets if in production

if(process.env.NODE_ENV === 'production') {
    //set static folder
    app.use(express.static(path.join(__dirname + "/public")));

    // app.get('*', (req, res) => {
    //   res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
    // })
} else {
    app.get("/", (req, res) => {
        res.send("welcome to task api...")
    })
}

const uri = process.env.DATABASE_URL;
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server running on the port: ${port}...`)
});

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()  => console.log("MongoDB connection established..."))
.catch((error) => console.error("MongoDB connection failed:", error.message));