import mongoose from "mongoose";
import "dotenv/config";

export const connect = async (): Promise<void> => {
  try {
    
    await mongoose.connect(String(process.env.MONGO_DB));
    console.log("connected")
  } catch (error) {
    console.log("MongoDB connection error: ", error);
  }
};

export const disconnect = async (): Promise<void> => {
  try {
    
    await mongoose.disconnect();
    console.log("disconnected")
  } catch (error) {
    console.log("MongoDB disconnection error: ", error);
  }
};