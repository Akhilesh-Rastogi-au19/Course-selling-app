import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaDiscourse, FaDownload } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { RiHome2Fill } from "react-icons/ri";
import { HiMenu, HiX } from "react-icons/hi";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils.js";

const Purchases = () => {

  const [purchases, setPurchases] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  console.log("purchases:", purchases);

  // Check login
  useEffect(() => {
    const token = localStorage.getItem("user");
    setIsLoggedIn(!!token);
  }, []);

  // Fetch purchases
  useEffect(() => {

    const fetchPurchases = async () => {

      const storedData = JSON.parse(localStorage.getItem("user"));
      const token = storedData?.token;

      if (!token) {
        setErrorMessage("Please login first");
        return;
      }

      try {

        const response = await axios.get(
          `${BACKEND_URL}/user/purchases`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("API Response:", response.data);

        // ⭐ IMPORTANT: Adjust key according to backend response
        setPurchases(response.data.courseData || []);

      } catch (error) {
        setErrorMessage("Failed to fetch purchase data");
      }
    };

    fetchPurchases();

  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });

      toast.success("Logged out successfully");
      localStorage.removeItem("user");
      setIsLoggedIn(false);

    } catch (error) {
      toast.error("Error in logging out");
    }
  };

  return (
    <div className="flex h-screen">

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-gray-100 p-5 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out w-64 z-50`}
      >
        <nav>
          <ul className="mt-16 md:mt-0">
            <li className="mb-4">
              <Link to="/" className="flex items-center">
                <RiHome2Fill className="mr-2" /> Home
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/courses" className="flex items-center">
                <FaDiscourse className="mr-2" /> Courses
              </Link>
            </li>
            <li className="mb-4 text-blue-500 flex items-center">
              <FaDownload className="mr-2" /> Purchases
            </li>
            <li className="mb-4">
              <Link to="/settings" className="flex items-center">
                <IoMdSettings className="mr-2" /> Settings
              </Link>
            </li>
            <li>
              {isLoggedIn ? (
                <button onClick={handleLogout} className="flex items-center">
                  <IoLogOut className="mr-2" /> Logout
                </button>
              ) : (
                <Link to="/login" className="flex items-center">
                  <IoLogIn className="mr-2" /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {/* Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-blue-600 text-white p-2 rounded-lg"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
      </button>

      {/* Main Content */}
      <div
        className={`flex-1 p-8 bg-gray-50 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } md:ml-64`}
      >
        <h2 className="text-xl font-semibold mt-6 md:mt-0 mb-6">
          My Purchases
        </h2>

        {errorMessage && (
          <div className="text-red-500 text-center mb-4">
            {errorMessage}
          </div>
        )}

        {purchases.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {purchases.map((purchase) => (
              <div key={purchase._id} className="bg-white rounded-lg shadow-md p-6">
                <img
                  className="rounded-lg w-full h-48 object-cover"
                  src={purchase.image?.url || "https://via.placeholder.com/200"}
                  alt={purchase.title}
                />
                <div className="text-center mt-4">
                  <h3 className="text-lg font-bold">{purchase.title}</h3>
                  <p className="text-gray-500">
                    {purchase.description?.slice(0, 100)}...
                  </p>
                  <span className="text-green-700 font-semibold text-sm">
                    ${purchase.price} only
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You have no purchases yet.</p>
        )}

      </div>
    </div>
  );
};

export default Purchases;