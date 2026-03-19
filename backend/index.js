import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from "cors";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from 'cloudinary';
import cookieParser from 'cookie-parser';

import courseRoute from './routes/course.route.js';
import userRoute from './routes/user.route.js';
import adminRoute from "./routes/admin.route.js";
import orderRoute from "./routes/order.route.js";

const app = express();

// ✅ CORS fix
app.use(cors({
  origin: "https://course-selling-app-x3kg-hig7i1pbf-akhileshs-projects-0cad3b8e.vercel.app",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
}));

// routes
app.use('/api/v1/course', courseRoute);
app.use('/api/v1/user', userRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/order", orderRoute);

// cloudinary
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

app.get('/', (req, res) => {
  res.send('Backend running');
});

const port = process.env.PORT || 3000;
const DB_URI = process.env.MONGO_URI;

// ✅ Start server only after DB connect
const startServer = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("✅ Connected to MongoDB");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

  } catch (error) {
    console.log("❌ DB connection error:", error);
  }
};

startServer();