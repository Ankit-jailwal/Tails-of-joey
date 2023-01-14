import express from "express";
import { AdminRoute, CustomerRoute } from "./route";

const app = express();


app.use('/admin', AdminRoute)
app.use('/customer', CustomerRoute)


app.listen(8000, () => {
    console.log("App is listening to the port 8000")
})
