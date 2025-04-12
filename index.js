import express from "express";
import dotenv from "dotenv";
import cors from "cors"

dotenv.config();

const app = express();

const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
