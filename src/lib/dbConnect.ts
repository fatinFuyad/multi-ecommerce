import mongoose from "mongoose";

let isConnected = false; // Variable to track the connection status
let initialized = false;

export const dbConnect = async () => {
  if (!process.env.DATABASE_URL) return console.log("Missing MongoDB URL");

  // If the connection is already established, return without creating a new connection.
  if (mongoose.connection.readyState === 1) {
    console.log("Mongoose connnection state: 1");
    return;
  }
  if (isConnected) {
    console.log("MongoDB connection already established");
    return;
  }

  try {
    await mongoose.connect(process.env.DATABASE_URL);

    isConnected = true; // Set the connection status to true
    console.log("MongoDB connected");
    if (!initialized) {
      await import("@/models/index");
      initialized = true;
      console.log("Models initialized");
    }
  } catch (error) {
    console.log(error);
  }
};
