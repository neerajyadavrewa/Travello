"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPaperPlane,
} from "react-icons/fa";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await res.json();

    if (res.ok && result.success) {
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } else {
      console.error("Form error:", result.error);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
};


  return (
    <div className="relative bg-black min-h-screen text-gray-300 flex flex-col items-center px-6 py-20">
      <motion.h1
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-6xl font-extrabold mb-14 text-violet-600 tracking-wide drop-shadow-lg"
      >
        Contact Us
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-16"
      >
        {/* Contact Info */}
        <div className="space-y-12">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-6 bg-gray-900/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg cursor-default"
          >
            <FaMapMarkerAlt className="text-violet-500 w-12 h-12" />
            <div>
              <h3 className="text-2xl font-semibold text-white mb-1">
                Our Address
              </h3>
              <p className="text-gray-400 max-w-xs">
                Rewa, Madhya Pradesh
              </p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-6 bg-gray-900/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg cursor-default"
          >
            <FaPhone className="text-violet-500 w-12 h-12" />
            <div>
              <h3 className="text-2xl font-semibold text-white mb-1">
                Call Us
              </h3>
              <p className="text-gray-400 max-w-xs">+91 8770223682</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-6 bg-gray-900/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg cursor-default"
          >
            <FaEnvelope className="text-violet-500 w-12 h-12" />
            <div>
              <h3 className="text-2xl font-semibold text-white mb-1">
                Email Us
              </h3>
              <p className="text-gray-400 max-w-xs">neerajyadavrewa@gmail.com</p>
            </div>
          </motion.div>
        </div>

        {/* Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-gray-900/70 backdrop-blur-sm rounded-3xl p-10 shadow-xl flex flex-col gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          noValidate
        >
          <div className="flex flex-col md:flex-row gap-6">
            <input
              type="text"
              name="name"
              required
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-200"
            />
            <input
              type="email"
              name="email"
              required
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-200"
            />
          </div>

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-200"
          />

          <textarea
            name="message"
            required
            placeholder="Your Message"
            rows={6}
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-200 resize-none"
          />

          <button
            type="submit"
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-violet-600 to-indigo-700 px-8 py-4 rounded-full font-semibold text-white text-lg hover:scale-105 transition-transform shadow-lg drop-shadow"
          >
            Send Message <FaPaperPlane />
          </button>

          {submitted && (
            <p className="mt-4 text-green-400 font-semibold text-center">
              Thank you for reaching out! We will get back to you soon.
            </p>
          )}
        </motion.form>
      </motion.div>
    </div>
  );
};

export default ContactPage;
