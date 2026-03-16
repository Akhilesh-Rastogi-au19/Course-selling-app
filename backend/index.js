import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cousreRoute from './routes/course.route.js'
import userRoute from './routes/user.route.js'
import adminRoute from "./routes/admin.route.js";
import orderRoute from "./routes/order.route.js"
import cors from "cors";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from 'cloudinary'
import cookieParser from 'cookie-parser';




const app = express();

//middleware json ko parser karne k liye
// app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.use(cors({
    origin: "https://course-selling-app-kohl-theta.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));
  

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));



const port = process.env.PORT || 3000;
const DB_URI = process.env.MONGO_URI

try {
  await mongoose.connect(DB_URI)
   console.log("Connect to MongoDB")

} catch(error) {
    console.log(error)
}

// definig routes

app.use('/api/v1/course', cousreRoute)
app.use('/api/v1/user', userRoute)
app.use("/api/v1/admin" , adminRoute)
app.use("/api/v1/order" , orderRoute)

// cloudnary config code

   cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.api_key, 
    api_secret: process.env.api_secert,
});


app.get('/' , (req ,res) => {
    res.send("Hi im bakcend ")
})

app.listen(port, () =>{
    console.log(`server is running  on port ${port}`)
})