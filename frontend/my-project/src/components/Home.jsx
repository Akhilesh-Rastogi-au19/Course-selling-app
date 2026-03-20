import React, { useEffect, useState } from "react";
import logo from "../../public/logo.webp";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import axios from "axios";
import Slider from "react-slick";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils.js";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Home() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        setCourses(res.data.courses);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCourses();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    } catch {
      toast.error("Logout failed");
    }
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 400,
    autoplay: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-blue-950 text-white">
      <div className="max-w-6xl mx-auto px-3">

        {/* HEADER */}
        <header className="flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <img src={logo} className="w-7 h-7 rounded-full" />
            <h1 className="text-lg font-semibold text-orange-500">
              CourseHaven
            </h1>
          </div>

          <div className="flex gap-2">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-sm border px-3 py-1 rounded hover:bg-white hover:text-black"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm border px-3 py-1 rounded hover:bg-white hover:text-black"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-sm border px-3 py-1 rounded hover:bg-white hover:text-black"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </header>

        {/* HERO */}
        <section className="text-center py-10">
          <h1 className="text-2xl md:text-3xl font-bold text-orange-500">
            CourseHaven
          </h1>

          <p className="text-gray-400 mt-2 text-sm">
            Sharpen your skills with expert courses.
          </p>

          <div className="flex justify-center gap-3 mt-5 flex-wrap">
            <Link
              to="/courses"
              className="bg-green-500 px-4 py-2 text-sm rounded hover:bg-white hover:text-black"
            >
              Explore
            </Link>

            <Link
              to="https://www.youtube.com/learncodingofficial"
              className="bg-white text-black px-4 py-2 text-sm rounded hover:bg-green-500 hover:text-white"
            >
              Videos
            </Link>
          </div>
        </section>

        {/* COURSES */}
        <section className="py-6">
          <Slider {...settings}>
            {courses.map((course) => (
              <div key={course._id} className="px-2">
                <div className="bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition">

                  <img
                    className="h-28 w-full object-cover"
                    src={course.image?.url || "https://via.placeholder.com/200"}
                  />

                  <div className="p-3 text-center">
                    <h2 className="text-sm font-medium">
                      {course.title}
                    </h2>

                    <Link
                      to={`/buy/${course._id}`}
                      className="inline-block mt-2 text-xs bg-orange-500 px-3 py-1 rounded hover:bg-blue-500"
                    >
                      Enroll
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </section>

        {/* FOOTER */}
        <footer className="py-6 border-t border-gray-700 mt-6 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-center md:text-left">

            <div>
              <h1 className="text-orange-500 font-semibold">CourseHaven</h1>
              <div className="flex justify-center md:justify-start gap-3 mt-2">
                <FaFacebook />
                <FaInstagram />
                <FaTwitter />
              </div>
            </div>

            <div>
              <p className="text-gray-400">YouTube</p>
              <p className="text-gray-400">Telegram</p>
              <p className="text-gray-400">GitHub</p>
            </div>

            <div>
              <p className="text-gray-400">Terms</p>
              <p className="text-gray-400">Privacy</p>
            </div>

          </div>
        </footer>

      </div>
    </div>
  );
}

export default Home;

