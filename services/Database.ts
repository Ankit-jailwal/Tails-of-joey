import mongoose from "mongoose"
import { MONGO_URI } from "../config";

export default async () => {
    
    try {
        console.log("Before connect")
        await mongoose.connect(MONGO_URI)

        console.log("DB connected...")
    } catch (ex) {
        console.log(ex)
    }

}



