"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaMoneyBillWave, FaRocket, FaUsers, FaPenFancy } from "react-icons/fa";

type UserData = {
  name: string;
  email: string;
  role: string;
  creatorRequestStatus: string;
  image?: string;
};

const BecomeCreatorPage = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [bio, setBio] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [message, setMessage] = useState("");

  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setUser(data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setMessage("");

  if (!profilePic) {
    setMessage("❌ Profile picture is required.");
    return;
  }

  // 1. Upload to Cloudinary
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";

  const formData = new FormData();
  formData.append("file", profilePic);
  formData.append("upload_preset", uploadPreset);

  let imageUrl = "";

  try {
    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const cloudinaryData = await cloudinaryRes.json();
    imageUrl = cloudinaryData.secure_url;
  } catch (uploadError) {
    setMessage("❌ Failed to upload image. Try again.");
    return;
  }

  // 2. Submit form with image URL
  try {
    const res = await fetch("/api/admin/creator-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profilePic: imageUrl,
        bio,
        instagram,
        youtube,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Something went wrong");

    setMessage("🎉 Application submitted!");
    setBio("");
    setInstagram("");
    setYoutube("");
    setProfilePic(null);
    setPreviewURL("");
    setUser((prev) =>
      prev ? { ...prev, creatorRequestStatus: "pending" } : null
    );
  } catch (err) {
    setMessage("❌ " + (err as Error).message);
  }
};


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const renderContent = () => {
    if (loading) {
      return <p className="text-center text-gray-400">Loading...</p>;
    }

    if (!user) {
      return (
        <p className="text-center text-red-400">
          Please log in to apply as a creator.
        </p>
      );
    }

    if (user.role === "creator") {
      return (
        <p className="text-center text-green-400 text-lg font-semibold">
          ✅ You are already a creator!
        </p>
      );
    }

    if (user.creatorRequestStatus === "pending") {
      return (
        <p className="text-center text-yellow-400 text-lg font-semibold">
          ⏳ Your creator application is pending. Please wait for approval.
        </p>
      );
    }

    return (
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Section 1 */}
        <h3 className="text-xl font-semibold text-white mt-4 mb-2">
          Profile Picture
        </h3>

        <div>
          <label className="block mb-1">Upload Your Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
          />
          {previewURL && (
            <div className="mt-4 flex justify-center">
              <img
                src={previewURL}
                alt="Profile Preview"
                className="w-32 h-32 rounded-full object-cover border-2 border-indigo-500"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block mb-1">Instagram Profile</label>
          <input
            type="url"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
            placeholder="https://instagram.com/yourhandle"
          />
        </div>

        <div>
          <label className="block mb-1">YouTube Channel (optional)</label>
          <input
            type="url"
            value={youtube}
            onChange={(e) => setYoutube(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
            placeholder="https://youtube.com/channel/..."
          />
        </div>

        {/* Section 2 */}
        <h3 className="text-xl font-semibold text-white mt-8 mb-2">
          Your Experience
        </h3>

        <div>
          <label className="block mb-1 font-medium">
            Tell us about your travel experience & why you’d be a great creator
          </label>
          <p className="text-sm text-gray-500 mb-2">
            E.g., What places have you been to? What kind of content do you
            create?
          </p>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
            placeholder="Tell us about your travel experience..."
            required
          />
        </div>

        <div className="flex items-start">
          <input type="checkbox" required className="mr-2 mt-1" />
          <span className="text-sm text-gray-400">
            I agree to the platform's content and community guidelines.
          </span>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold py-2 rounded hover:scale-105 hover:shadow-lg transition-transform"
        >
          Submit Application
        </button>

        {message && (
          <p
            className={`text-center mt-4 text-sm ${
              message.startsWith("🎉") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    );
  };

  return (
    <div className="bg-black text-gray-300 min-h-screen pb-16">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto px-6 py-20 text-center"
      >
        <h1 className="text-5xl font-extrabold text-white mb-6">
          Become a Creator
        </h1>
        <p className="text-lg max-w-2xl mx-auto">
          Turn your travel passion into profit. Share your journeys, build your
          audience, and earn by selling your unique travel packages.
        </p>
      </motion.section>

      {/* Benefits */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-6xl mx-auto px-6 mb-16"
      >
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Why Join Us?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: <FaMoneyBillWave />, label: "Monetize Your Plans" },
            { icon: <FaRocket />, label: "Reach a Global Audience" },
            { icon: <FaUsers />, label: "Build Your Tribe" },
            { icon: <FaPenFancy />, label: "Creative Freedom" },
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 bg-gray-900 rounded-xl shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="text-3xl text-violet-400 mb-3">{item.icon}</div>
              <p className="font-semibold">{item.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Application Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-3xl mx-auto px-6 bg-gray-900 p-8 rounded-xl shadow-xl"
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          {user?.creatorRequestStatus === "none"
            ? "Apply Now"
            : "Creator Status"}
        </h2>
        {renderContent()}
      </motion.div>
    </div>
  );
};

export default BecomeCreatorPage;
