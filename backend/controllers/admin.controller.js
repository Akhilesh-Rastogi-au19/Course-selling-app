import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.model.js";
import {  User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import config from '../config.js';
import jwt from 'jsonwebtoken';
import { z }  from "zod";
import { Admin } from "../models/admin.model.js";


export const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
 
    const adminSchema = z.object({
      firstName: z.string().min(3,{message:"firstName must be atleast 3 char long"}),
      lastName: z.string().min(3,{message:"lastName mustt be atleast 3 char long"}),
      email: z.string().email(),
      password: z.string().min(6,{message:"password mustt be atleast 6 char long"}),
 
    })
 
    //validate
    const validatedData = adminSchema.safeParse(req.body);
    if(!validatedData.success){
      return res.status(400).json({errors:validatedData.error.issues.map(err =>err.message)})
    }
 
    const hasdedPassword = await bcrypt.hash(password , 10)
     
    try {
     const existingAdmin = await Admin.findOne({email: email});

     if(existingAdmin){
         return res.status(400).json({errors: "Admin already exists"});
     }
  
     const newAdmin = new  Admin({ firstName, lastName, email, password:hasdedPassword, });
     await newAdmin.save();
     res.status(201).json({message: "Signup success", newAdmin})
 
    } catch(error) {
        res.status(500).json({errors: "error is signup"})
 
      console.log("error in signup" , error);
    }
 
   };
 
 
 // Login
 
 export const login = async (req, res) => {
   const { email, password } = req.body;
   

   try {
     const admin = await Admin.findOne({ email: email });
     const isPasswordCorrect = await bcrypt.compare(password, admin.password);
 
     if (!admin || !isPasswordCorrect) {
       return res.status(403).json({ message: "invalid credentials" });
     }

    //jwt token
     const token = jwt.sign(
       { 
         id: admin._id,
        },
        config.JWT_ADMIN_PASSWORD, 
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
       admin,
       token,
     });
 
   } catch (error) {
     console.log("error in login", error);
     res.status(500).json({ errors: "Error in login" });
   }
 };
 
 
 // logout
 
 export const logout =  (req, res) => {
   try {
       if(!req.cookies?.jwt) {
           return res.status(401).json({errors: 'kindly login first '})
       }
     res.clearCookie("jwt");
 
     res.status(200).json({message: "Logged out sucessfully"})
 
   } catch(error){
     res.status(500).json({errors: "error to logout"})
     console.log('error in logout', error)
 
   }
 
 };