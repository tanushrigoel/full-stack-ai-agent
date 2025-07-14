import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/user.js";
const app = express();

app.use(cors);
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use("/api/auth", userRoutes);

mongoose
  .connect(
    "mongodb+srv://tanu26goel:3UiXLCHsFRAUlZZU@cluster0.ots4gy2.mongodb.net/"
  )
  .then(() => {
    console.log("MongoDB connected ✔️");
    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("MongoDB error: ", err);
  });
