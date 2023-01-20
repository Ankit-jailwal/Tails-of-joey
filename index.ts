import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { AdminRoute, ManagerRoute } from "./route";
import { MONGO_URI } from "./config";

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use('/admin', AdminRoute)
app.use('/manager', ManagerRoute)

mongoose.connect(MONGO_URI).then(result => {
    // console.log(result)
    console.log("Connected to DB")
}).catch(err => console.log("error"+ err))

app.listen(8000, () => {
    console.clear()
    console.log("App is listening to the port 8000")
})
