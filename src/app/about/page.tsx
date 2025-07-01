"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaBullseye,
  FaHistory,
  FaHandsHelping,
  FaHeart,
  FaGlobe,
  FaLightbulb,
  FaScroll,
  FaArrowUp,
} from "react-icons/fa";

const teamMembers = [
  {
    id: 1,
    name: "Aarav Sharma",
    role: "Founder & CEO",
    image: "",
    bio: "Passionate traveler and visionary, creating immersive travel experiences.",
  },
  
];

const testimonials = [
  {
    id: 1,
    name: "Simran Kaur",
    role: "Travel Blogger",
    quote:
      "This platform transformed the way I plan trips. The curated experiences are unmatched!",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 2,
    name: "Aditya Singh",
    role: "Adventure Seeker",
    quote:
      "Connecting with creators helped me discover hidden gems and make lasting memories.",
    image: "https://randomuser.me/api/portraits/men/35.jpg",
  },
  {
    id: 3,
    name: "Pooja Reddy",
    role: "Event Enthusiast",
    quote:
      "The events organized by the team made my travels unforgettable and full of fun.",
    image: "https://randomuser.me/api/portraits/women/54.jpg",
  },
];

const values = [
  {
    id: 1,
    icon: <FaHeart className="text-violet-500 w-12 h-12 mb-3" />,
    title: "Passion",
    description:
      "We are fueled by a deep passion for travel and creating meaningful experiences.",
  },
  {
    id: 2,
    icon: <FaGlobe className="text-violet-500 w-12 h-12 mb-3" />,
    title: "Community",
    description:
      "Building a vibrant community where everyone’s travel story matters.",
  },
  {
    id: 3,
    icon: <FaLightbulb className="text-violet-500 w-12 h-12 mb-3" />,
    title: "Innovation",
    description:
      "Constantly innovating to offer fresh, unique travel experiences and solutions.",
  },
  {
    id: 4,
    icon: <FaScroll className="text-violet-500 w-12 h-12 mb-3" />,
    title: "Integrity",
    description:
      "Committed to honesty, transparency, and respect in every interaction.",
  },
];

const About: React.FC = () => {
  // Scroll-to-top button state
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) setShowTopBtn(true);
      else setShowTopBtn(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="relative bg-black text-gray-300 min-h-screen pb-24 overflow-x-hidden">
      {/* Animated gradient background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black"
        style={{
          animationDuration: "30s",
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationName: "gradientX",
        }}
      />
      <style>
        {`
          @keyframes gradientX {
            0% {background-position: 0% 50%;}
            50% {background-position: 100% 50%;}
            100% {background-position: 0% 50%;}
          }
          .animate-gradient-x {
            background-size: 200% 200%;
          }
        `}
      </style>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative max-w-7xl mx-auto px-6 py-20"
      >
        <h1 className="text-6xl font-extrabold text-violet-600 mb-12 text-center tracking-wide drop-shadow-lg">
          About Us
        </h1>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-14 mb-20">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center text-center p-8 border border-violet-700 rounded-3xl shadow-xl bg-gray-900/60 backdrop-blur-sm hover:shadow-violet-700 transition-shadow"
          >
            <FaBullseye className="text-violet-400 text-7xl mb-5" />
            <h2 className="text-4xl font-bold mb-4 text-white drop-shadow">
              Our Mission
            </h2>
            <p className="text-gray-400 max-w-md leading-relaxed">
              To empower travelers by providing unique, immersive, and
              personalized travel experiences that open new horizons and
              unforgettable memories.
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center text-center p-8 border border-violet-700 rounded-3xl shadow-xl bg-gray-900/60 backdrop-blur-sm hover:shadow-violet-700 transition-shadow"
          >
            <FaUsers className="text-violet-400 text-7xl mb-5" />
            <h2 className="text-4xl font-bold mb-4 text-white drop-shadow">
              Our Vision
            </h2>
            <p className="text-gray-400 max-w-md leading-relaxed">
              To become the leading platform that connects travel creators and
              enthusiasts worldwide, fostering a vibrant and supportive travel
              community.
            </p>
          </motion.div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-5xl font-extrabold mb-12 text-center text-violet-500 drop-shadow-lg tracking-wider">
            Our Core Values
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-12 max-w-6xl mx-auto">
            {values.map(({ id, icon, title, description }) => (
              <motion.div
                key={id}
                whileHover={{ scale: 1.08, boxShadow: "0 0 15px #8b5cf6" }}
                className="bg-gray-900/70 backdrop-blur-sm rounded-3xl p-8 flex flex-col items-center text-center cursor-pointer shadow-md"
              >
                {icon}
                <h3 className="text-2xl font-semibold text-white mb-3">{title}</h3>
                <p className="text-gray-400 leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* History */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex flex-col md:flex-row items-center gap-10 mb-20 p-8 border border-violet-700 rounded-3xl shadow-xl bg-gray-900/60 backdrop-blur-sm hover:shadow-violet-600 transition-shadow"
        >
          <div className="flex-shrink-0 text-violet-500 text-8xl drop-shadow-lg">
            <FaHistory />
          </div>
          <div>
            <h2 className="text-4xl font-bold mb-4 text-white drop-shadow">
              Our Journey
            </h2>
            <p className="text-gray-400 max-w-4xl leading-relaxed">
              Founded in 2023, our platform was born from a desire to make travel
              planning simple, authentic, and inspiring. Starting with a small
              group of passionate travelers, we have grown into a
              community-driven hub where experiences are shared, stories told,
              and dreams realized. 
            </p>
          </div>
        </motion.div>

        {/* Team */}
        {/* <div className="mb-20">
          <h2 className="text-5xl font-extrabold mb-12 text-center text-violet-600 tracking-wide drop-shadow-lg">
            Meet Our Team
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {teamMembers.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * member.id, duration: 0.6 }}
                whileHover={{ scale: 1.07, boxShadow: "0 0 20px #7c3aed" }}
                className="bg-gray-900/90 rounded-3xl shadow-lg p-8 flex flex-col items-center cursor-pointer"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-36 h-36 rounded-full object-cover border-4 border-violet-600 mb-6 shadow-lg"
                  loading="lazy"
                />
                <h3 className="text-2xl font-bold text-white mb-1 drop-shadow">
                  {member.name}
                </h3>
                <p className="text-violet-400 font-semibold mb-3">{member.role}</p>
                <p className="text-gray-400 text-center">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div> */}

        {/* Testimonials */}
        <div className="mb-24">
          <h2 className="text-5xl font-extrabold mb-12 text-center text-violet-600 tracking-wide drop-shadow-lg">
            What Our Users Say
          </h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {testimonials.map(({ id, name, role, quote, image }) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 * id, duration: 0.7 }}
                whileHover={{ scale: 1.04, boxShadow: "0 0 15px #a78bfa" }}
                className="bg-gray-900/75 backdrop-blur-md rounded-3xl p-8 flex flex-col items-center text-center shadow-md cursor-default"
              >
                <img
                  src={image}
                  alt={name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-violet-500 mb-6 shadow-md"
                  loading="lazy"
                />
                <p className="text-gray-300 italic mb-6">"{quote}"</p>
                <h4 className="text-xl font-semibold text-violet-400">{name}</h4>
                <p className="text-gray-500">{role}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Support / Contact */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-3xl mx-auto p-10 border border-violet-700 rounded-3xl shadow-xl bg-gradient-to-r from-violet-700 via-indigo-900 to-black text-center"
        >
          <FaHandsHelping className="text-violet-300 text-8xl mb-6 md:mb-0 md:mr-8 drop-shadow-lg" />
          <div>
            <h2 className="text-4xl font-bold text-white mb-4 drop-shadow">
              Get Involved
            </h2>
            <p className="text-gray-300 max-w-xl leading-relaxed">
              Interested in partnering or contributing? Join us in building
              transformative travel experiences and a community like no other.
              Reach out and be part of the journey!
            </p>
            <a
              href="/contact"
              className="inline-block mt-6 px-10 py-3 bg-gradient-to-r from-violet-600 to-indigo-700 rounded-full font-semibold text-white shadow-lg hover:scale-105 transition-transform drop-shadow"
            >
              Contact Us
            </a>
          </div>
        </motion.div>
      </motion.section>

      {/* Scroll to Top Button */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-8 right-8 p-4 bg-violet-600 rounded-full text-white shadow-lg hover:bg-violet-700 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400"
        >
          <FaArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default About;
