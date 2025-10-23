import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>console.log("database connected successfully!!!"));
    await mongoose.connect(`${process.env.MONGODB_URI}/Plixa`);
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;
