import express from "express";

import cors from "cors";

import dotenv from "dotenv"

import mongoose from "mongoose";

import postRoutes from "./routes/posts.routes.js";

import userRoutes from "./routes/user.routes.js";




dotenv.config();

const PORT = 9080;
const MONGO_URL = process.env.MONGO_URL;




const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use(postRoutes);
app.use(userRoutes);
app.use(express.static("uploads/"));

const start = async () => {
    try {
        if (!MONGO_URL) {
            throw new Error("MONGO_URL is missing from environment variables (.env file).");
        }

        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGO_URL, {
            serverSelectionTimeoutMS: 5000,
        });

        console.log("Connected to MongoDB successfully");

        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        });

    } catch (error) {
        console.error("CRITICAL ERROR: Failed to start server.");
        console.error("Error Detail:", error.message);

        if (error.name === "MongooseServerSelectionError" || error.message.includes("IP that isn't whitelisted")) {
            console.error("\n[ACTION REQUIRED]: Your current IP address is likely not whitelisted in MongoDB Atlas.");
            console.error("Please log in to MongoDB Atlas and add '0.0.0.0/0' (for development only) or your current IP to the Network Access whitelist.");
        }

        process.exit(1);
    }
};

start();


