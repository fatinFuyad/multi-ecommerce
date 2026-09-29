import mongoose from "mongoose";

// let isConnected = false; // Variable to track the connection status
let initialized = false;

export const dbConnect = async () => {
  try {
    if (!process.env.DATABASE_URL) return console.log("Missing MongoDB URL");
    if (!initialized) {
      await import("@/models/register");
      initialized = true;
      console.log("Models initialized");
    }

    // If the connection is already established, return without creating a new connection.
    if (mongoose.connection.readyState === 1) {
      // console.log("Mongoose connnection state: 1");
      return;
    }
    // if (isConnected) {
    //   // console.log("MongoDB connection already established");
    //   return;
    // }

    await mongoose.connect(process.env.DATABASE_URL);
    // console.log("MongoDB connected");

    // Set the connection status to true
    // isConnected = true;
  } catch (error) {
    console.log(error);
  }
};
