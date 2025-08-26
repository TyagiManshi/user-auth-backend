import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./utils/db.js";
import cookieParser from "cookie-parser";

// import all routes 
import userRoutes from "./routes/user.routes.js"

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.BASE_URL,
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'], // not case sensitive
    allowedHeaders: ['Content-Type', 'Authorization']  // case sensitive
  })
);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

const port = process.env.PORT || 4000;

// Connect to db
db();

// user routes 
app.use("/api/v1/users/", userRoutes)

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
