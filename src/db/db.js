import { DB_Name } from "../constant.js";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      `${process.env.mongoDB_URL}${DB_Name}`
    );
    console.log(
      `\n MONGODB connected !! DB HOST:${connection.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection FAILD  !!", error);
    process.exit(1);
  }
};
export default connectDB;
