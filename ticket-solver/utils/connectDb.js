import mongoose from "mongoose";

let isConnected;

async function connectDB() {
  if (isConnected) {
    console.log("Already connected");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URL || "", {});
    isConnected = db.connections[0].readyState;
    console.log("DB connected successfully");
  } catch (err) {
    console.log("DB connection failed ", err);

    process.exit(1);
  }
}
export default connectDB;