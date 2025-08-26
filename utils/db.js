import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();               
// if we don't write these 2 lines? then -
// undefined    
// Error connecting to mongodb

// Goal - export a function that connects to db

const db = () => {
    mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to mongodb");
    })
    .catch((err) => {
        console.log("Error connecting to mongodb");
    })
}

export default db;
