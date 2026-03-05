import React from 'react';
import './App.css'
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Courses from "./components/Courses.jsx"
import Buy from "./components/Buy.jsx";
import Purchases from "./components/Purchases.jsx";
import { Toaster } from "react-hot-toast";
import AdminLogin from "./admin/AdminLogin.jsx";
import AdminSignup from './admin/AdminSignup.jsx';
import CourseCreate from './admin/CourseCreate.jsx';
import Dashboard from './admin/Dashboard.jsx';
import UpdateCourse from './admin/UpdateCourse.jsx';
import OurCourses from './admin/OurCourses.jsx';


function App() {
  const  user=JSON.parse(localStorage.getItem('user'))
  const  admin=JSON.parse(localStorage.getItem('admin'))

   return (
    <>
       <Toaster position="top-right" reverseOrder={false} />
       
    <Routes>
 
     <Route path="/" element={<Home />} />
     <Route path="/login" element={<Login />} />
     <Route path="/signup" element={<Signup />} />
     


     {/* otherroute */}
     <Route path="/courses" element={<Courses />} />
     <Route path="/buy/:courseId" element={<Buy />} />
     <Route path="/purchases" element={ user?<Purchases /> :<Navigate to={"/login"} />} />

          {/* // Admin */}

     <Route path="/admin/signup" element={<AdminSignup />} />
     <Route path="/admin/login" element={<AdminLogin />} />
     <Route path="/admin/dashboard" element={ admin?<Dashboard /> : <Navigate to={"/admin/login"} />} />
     <Route path="/admin/create-course" element={<CourseCreate />} />
     <Route path="/admin/update-course/:id" element={<UpdateCourse />} />
     <Route path="/admin/our-courses" element={<OurCourses />} />

     </Routes>

    </>
  )
}

export default App;
