import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.model.js";
import {  User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import config from '../config.js';
import jwt from 'jsonwebtoken';
import { z }  from "zod";



// SignUp

export const signup = async (req, res) => {
   const { firstName, lastName, email, password } = req.body;

   const userSchema=z.object({
     firstName: z.string().min(3,{message:"firstName must be atleast 3 char long"}),
     lastName: z.string().min(3,{message:"lastName mustt be atleast 3 char long"}),
     email: z.string().email(),
     password: z.string().min(6,{message:"password mustt be atleast 6 char long"}),

   })

   //validate
   const validatedData = userSchema.safeParse(req.body);
   if(!validatedData.success){
     return res.status(400).json({errors:validatedData.error.issues.map(err =>err.message)})
   }

   const hasdedPassword = await bcrypt.hash(password , 10)
    
   try {
    const existingUser = await User.findOne({email: email});
    if(existingUser){
        return res.status(400).json({errors: "User already exists"});
    }
 
    const newUser = new  User({ firstName, lastName, email, password:hasdedPassword, });
    await newUser.save();
    res.status(201).json({message: "Signup success", newUser})

   } catch(error) {
       res.status(500).json({errors: "error is signup"})

     console.log("error in signup" , error);
   }

  };


// Login

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(403).json({ message: "valid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(403).json({ errors: "Invalid credentials" });
    }

  
    const token = jwt.sign(
      { 
        id: user._id,
       },
       config .JWT_USER_PASSWORD, 
      { expiresIn: "1d" }
    );

    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    };

    res.cookie("jwt", token, cookieOptions);

    res.status(201).json({
      message: "Login successful",
      user,
      token,
    });

  } catch (error) {
    console.log("error in login", error);
    res.status(500).json({ errors: "Error in login" });
  }
};


// logout

export const logout = (req, res) => {
  try {

    res.clearCookie("jwt", {
      httpOnly: true,
      secure: false,      // production me true
      sameSite: "lax"
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (error) {
    console.log("error in logout", error);
    return res.status(500).json({
      success: false,
      message: "Error while logging out"
    });
  }
};

// purchased course

export const purchases = async (req, res) => {
  const userId = req.userId;

  try {
    const purchased = await  Purchase.find({ userId });

    let purchasedCourseId = [];

   for (let i = 0; i < purchased.length; i++){
     purchasedCourseId.push(purchased[i].courseId)
  }

    const courseData = await Course.find({
      _id: { $in: purchasedCourseId },
    });
     res.status(200).json({ purchased,courseData });
   
  } catch (error) {
   
    res.status(500).json({ errors: "error in purchases" });
    console.log("error in purchase", error);
  }
};
