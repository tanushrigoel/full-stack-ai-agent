import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/user.js";
import { serve } from "inngest/express";
import ticketRoutes from "./routes/ticket.js";
import { inngest } from "./inngest/client.js";
import { onUserSignup } from "./inngest/functions/on-signup.js";
import { onTicketCreate } from "./inngest/functions/on-ticket-create.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/api/inngest",
  serve({ client: inngest, functions: [onUserSignup, onTicketCreate] })
);
app.use(cors());

// console.log(process.env.MONGODB_URL);
app.use("/api/auth", userRoutes);

app.use("/api/tickets", ticketRoutes);
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
app.post("/", (req, res) => {
  console.log("received the request");
  res.send("Request received successfully!");
});

