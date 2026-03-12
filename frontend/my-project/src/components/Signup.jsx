import React, { useState } from "react";
import logo from "../../public/logo.webp";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../utils/utils.js";

function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/user/signup`,
        formData,
        { withCredentials: true }
      );

      setSuccessMessage(response.data.message || "Signup successful!");

      // 1.5 sec baad login page pe redirect
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      if (error.response) {
        setErrorMessage(
          error.response.data.errors || "Signup failed!"
        );
      } else {
        setErrorMessage("Server not responding!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-950 min-h-screen flex items-center justify-center text-white">

      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-[500px]">

        <div className="flex items-center justify-center mb-4">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-full mr-2" />
          <h2 className="text-2xl font-bold">
            Welcome to <span className="text-orange-500">CourseHaven</span>
          </h2>
        </div>

        <p className="text-center text-gray-400 mb-6">
          Create your account to continue
        </p>

        <form onSubmit={handleSubmit}>

          <div className="mb-4">
            <label className="text-gray-400">Firstname</label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full p-3 mt-1 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your firstname"
            />
          </div>

          <div className="mb-4">
            <label className="text-gray-400">Lastname</label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full p-3 mt-1 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your lastname"
            />
          </div>

          <div className="mb-4">
            <label className="text-gray-400">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 mt-1 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500"
              placeholder="name@email.com"
            />
          </div>

          <div className="mb-4">
            <label className="text-gray-400">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 mt-1 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500"
              placeholder="********"
            />
          </div>

          {errorMessage && (
            <div className="text-red-500 text-center mb-3">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="text-green-500 text-center mb-3">
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-blue-600 py-3 rounded-md transition disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Signup"}
          </button>

          <p className="text-center mt-4 text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-500">
              Login
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}

export default Signup;
