import mongoose from "mongoose";
import logger from "../config/logger.js";
import env from "../config/env.js";

const connectDB = async () => {

    try {
        await mongoose.connect(env.MONGO_URL);
        logger.info("MongoDB connected successfully");

    } catch (error) {
        logger.error("Error connecting to MongoDB", error);
    }

};

export default connectDB;