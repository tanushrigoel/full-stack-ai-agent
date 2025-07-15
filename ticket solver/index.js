import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/user.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// console.log(process.env.MONGODB_URL);
app.use("/api/auth", userRoutes);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("MongoDB connected ✔️");
    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("MongoDB error: ", err);
  });
