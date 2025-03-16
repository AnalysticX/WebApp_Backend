import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017", {
      dbName: "analysticx",
    });
    console.log("Database is successfully connected.");
  } catch (error) {
    console.log(error);
  }
};
