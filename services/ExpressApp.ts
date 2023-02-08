import { Application } from "express";
import bodyParser from "body-parser";
import { AdminRoute, CustomerRoute, ManagerRoute } from "../route";
import { ShoppingRoute } from "../route/ShoppingRoute";


export default async (app: Application) => { 
    
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: true}))
    
    app.use('/admin', AdminRoute)
    app.use('/manager', ManagerRoute)
    app.use('/user', CustomerRoute)
    app.use(ShoppingRoute)
}

