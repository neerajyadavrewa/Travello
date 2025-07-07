"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VideoPreviewPlayer from "@/components/VideoPreviewPlayer";

interface TripFormData {
  title: string;
  description: string;
  price: string;
  duration: string;
  location: string;
  images: string; // comma separated URLs pasted by user
  videos: string; // comma separated URLs pasted by user
  lastEntryDate: string;
}

const initialForm: TripFormData = {
  title: "",
  description: "",
  price: "",
  duration: "",
  location: "",
  images: "",
  videos: "",
  lastEntryDate: "",
};

export default function TripForm() {
  const [formData, setFormData] = useState<TripFormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof TripFormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [particles, setParticles] = useState<Array<{id: number, size: number, x: number, y: number, duration: number}>>([]);
  const [isClient, setIsClient] = useState(false);

  // Uploaded media URLs
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);

  // Uploading states
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Generate particles only on client side
    const generatedParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: Math.random() * 5 + 2,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 10 + 10
    }));
    
    setParticles(generatedParticles);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0)
      newErrors.price = "Valid price required";
    if (!formData.duration || isNaN(Number(formData.duration)) || Number(formData.duration) <= 0)
      newErrors.duration = "Valid duration required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.lastEntryDate) newErrors.lastEntryDate = "Last entry date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Cloudinary info from env variables
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";

  // Handle image upload input (device files)
  const handleImageFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingImages(true);
    setMessage(null);

    try {
      const files = Array.from(e.target.files);
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        } else {
          setMessage({ type: "error", text: "Failed to upload some images." });
        }
      }

      setUploadedImages(prev => [...prev, ...uploadedUrls]);
    } catch (error) {
      setMessage({ type: "error", text: "Image upload failed. Try again." });
    } finally {
      setUploadingImages(false);
      e.target.value = "";
    }
  };

  // Handle video upload input (device files)
  const [videoProgress, setVideoProgress] = useState(0);

const handleVideoFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files || e.target.files.length === 0) return;
  setUploadingVideos(true);
  setMessage(null);
  setVideoProgress(0);

  try {
    const files = Array.from(e.target.files);
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`);

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setVideoProgress(percent);
        }
      });

      xhr.onload = () => {
        const response = JSON.parse(xhr.responseText);
        if (response.secure_url) {
          uploadedUrls.push(response.secure_url);
          setUploadedVideos(prev => [...prev, response.secure_url]);
        } else {
          setMessage({ type: "error", text: "Some videos failed to upload." });
        }
      };

      xhr.onerror = () => {
        setMessage({ type: "error", text: "Video upload failed. Try again." });
      };

      xhr.send(formData);
    }
  } catch (err) {
    setMessage({ type: "error", text: "Something went wrong with video upload." });
  } finally {
    setUploadingVideos(false);
    e.target.value = "";
    setVideoProgress(0);
  }
};

  // Remove uploaded image by index
  const handleRemoveUploadedImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Remove pasted image URL by index
  const handleRemovePastedImage = (index: number) => {
    const pastedUrls = formData.images.split(",").map(i => i.trim()).filter(Boolean);
    pastedUrls.splice(index, 1);
    setFormData(prev => ({ ...prev, images: pastedUrls.join(", ") }));
  };

  // Remove uploaded video by index
  const handleRemoveUploadedVideo = (index: number) => {
    setUploadedVideos(prev => prev.filter((_, i) => i !== index));
  };

  // Remove pasted video URL by index
  const handleRemovePastedVideo = (index: number) => {
    const pastedUrls = formData.videos.split(",").map(i => i.trim()).filter(Boolean);
    pastedUrls.splice(index, 1);
    setFormData(prev => ({ ...prev, videos: pastedUrls.join(", ") }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage(null);

    try {
      // Merge pasted URLs + uploaded URLs for images and videos
      const pastedImageUrls = formData.images.split(",").map(i => i.trim()).filter(Boolean);
      const pastedVideoUrls = formData.videos.split(",").map(i => i.trim()).filter(Boolean);

      const allImages = [...pastedImageUrls, ...uploadedImages];
      const allVideos = [...pastedVideoUrls, ...uploadedVideos];

      const res = await fetch("/api/trip/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          duration: parseInt(formData.duration),
          images: allImages,
          videos: allVideos,
        }),
      });

      const json = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: json.message });
        setFormData(initialForm);
        setUploadedImages([]);
        setUploadedVideos([]);
      } else {
        setMessage({ type: "error", text: json.error || "Submission failed." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error. Try again." });
    } finally {
      setLoading(false);
    }
  };

  // Prepare arrays for media previews
  const pastedImagePreviews = formData.images.split(",").map(i => i.trim()).filter(Boolean);
  const pastedVideoPreviews = formData.videos.split(",").map(i => i.trim()).filter(Boolean);

  const formItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-10 overflow-hidden relative">
      {/* Animated particles - client only */}
      {isClient && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                background: "linear-gradient(135deg, #8b5cf6, #4f46e5)",
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                top: `${particle.y}%`,
                left: `${particle.x}%`,
                opacity: 0.15
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0]
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}

      {/* Glowing background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900 rounded-full filter blur-[120px] opacity-20"></div>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-800 rounded-full filter blur-[100px] opacity-15"></div>

      {/* Page Heading */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-center max-w-2xl relative z-10 mb-16"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="inline-block mb-6"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center border-2 border-purple-500/30 shadow-xl shadow-purple-900/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300 mb-4">
          Plan Your Adventure
        </h1>
        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
          Share a unique trip experience with the world — create a personalized package including details, photos, and more.
        </p>
      </motion.div>

      {/* Trip Form Section */}
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-[#0a0a0a]/90 backdrop-blur-xl border border-purple-900/20 p-8 md:p-10 rounded-2xl shadow-2xl shadow-purple-900/10 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        {/* Form header */}
        <div className="flex items-center justify-center mb-10">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-700/20 to-transparent"></div>
          <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300 px-4">
            ✨ Create a Trip Plan
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-700/20 to-transparent"></div>
        </div>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-lg text-center font-medium mb-6 flex items-center justify-center ${
                message.type === "success" 
                  ? "bg-green-900/30 border border-green-800/30" 
                  : "bg-red-900/30 border border-red-800/30"
              }`}
            >
              {message.type === "success" ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Fields */}
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            { label: "Trip Title", name: "title", type: "text", placeholder: "Trip to the Alps", icon: "✏️" },
            { label: "Price (INR)", name: "price", type: "number", placeholder: "499.99", icon: "💰" },
            { label: "Duration (Days)", name: "duration", type: "number", placeholder: "7", icon: "⏳" },
            { label: "Location", name: "location", type: "text", placeholder: "Switzerland", icon: "📍" },
            { label: "Images (URLs)", name: "images", type: "text", placeholder: "https://img1.jpg, https://img2.jpg", icon: "🖼️" },
            { label: "Videos (URLs)", name: "videos", type: "text", placeholder: "https://video1.mp4", icon: "🎬" },
            { label: "Last Entry Date", name: "lastEntryDate", type: "date", placeholder: "", icon: "📅" },
          ].map(({ label, name, type, placeholder, icon }) => (
            <motion.div 
              key={name}
              variants={formItemVariants}
              initial="hidden"
              animate="visible"
              className="relative"
            >
              <label htmlFor={name} className="text-purple-300 mb-2 font-medium flex items-center">
                <span className="mr-2 text-purple-400">{icon}</span>
                {label}
              </label>
              <div 
                className={`relative rounded-lg transition-all duration-300 ${
                  activeField === name 
                    ? "bg-gradient-to-r from-purple-900/20 to-indigo-900/20 p-[1px]" 
                    : ""
                }`}
              >
                <input
                  id={name}
                  name={name}
                  type={type}
                  placeholder={placeholder}
                  value={formData[name as keyof TripFormData]}
                  onChange={handleChange}
                  onFocus={() => setActiveField(name)}
                  onBlur={() => setActiveField(null)}
                  className={`w-full p-3.5 bg-black/60 border rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all outline-none ${
                    errors[name as keyof TripFormData] 
                      ? "border-red-500/50" 
                      : "border-purple-700/20"
                  } ${activeField === name ? "ring-2 ring-purple-500/30" : ""}`}
                />
              </div>
              {errors[name as keyof TripFormData] && (
                <p className="text-red-400 text-sm mt-1.5 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors[name as keyof TripFormData]}
                </p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Description */}
        <motion.div 
          variants={formItemVariants}
          initial="hidden"
          animate="visible"
          className="mt-6"
        >
          <label htmlFor="description" className="text-purple-300 mb-2 font-medium flex items-center">
            <span className="mr-2 text-purple-400">📝</span>
            Description
          </label>
          <div className={`relative rounded-lg transition-all duration-300 ${
            activeField === "description" 
              ? "bg-gradient-to-r from-purple-900/20 to-indigo-900/20 p-[1px]" 
              : ""
          }`}>
            <textarea
              id="description"
              name="description"
              placeholder="Tell us about this trip..."
              value={formData.description}
              onChange={handleChange}
              onFocus={() => setActiveField("description")}
              onBlur={() => setActiveField(null)}
              className={`w-full p-3.5 bg-black/60 border rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all outline-none min-h-[140px] ${
                errors.description 
                  ? "border-red-500/50" 
                  : "border-purple-700/20"
              } ${activeField === "description" ? "ring-2 ring-purple-500/30" : ""}`}
            />
          </div>
          {errors.description && (
            <p className="text-red-400 text-sm mt-1.5 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.description}
            </p>
          )}
        </motion.div>

        {/* Image Upload Input */}
        <motion.div
          variants={formItemVariants}
          initial="hidden"
          animate="visible"
          className="mt-6"
        >
          <label className="text-purple-300 mb-2 font-medium flex items-center">
            <span className="mr-2 text-purple-400">📤</span>
            Upload Images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageFilesChange}
            disabled={uploadingImages}
            className="w-full text-sm text-gray-200 file:bg-gradient-to-r file:from-purple-700 file:to-indigo-700 file:text-white file:px-4 file:py-2 file:rounded-lg file:border-0 cursor-pointer bg-black/60 border border-purple-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
          {uploadingImages && (
            <p className="mt-1 text-sm text-purple-300">Uploading images...</p>
          )}
        </motion.div>

        {/* Video Upload Input */}
        <motion.div
          variants={formItemVariants}
          initial="hidden"
          animate="visible"
          className="mt-6"
        >
          <label className="text-purple-300 mb-2 font-medium flex items-center">
            <span className="mr-2 text-purple-400">📤</span>
            Upload Videos
          </label>
          <input
            type="file"
            accept="video/*"
            multiple
            onChange={handleVideoFilesChange}
            disabled={uploadingVideos}
            className="w-full text-sm text-gray-200 file:bg-gradient-to-r file:from-purple-700 file:to-indigo-700 file:text-white file:px-4 file:py-2 file:rounded-lg file:border-0 cursor-pointer bg-black/60 border border-purple-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
          {uploadingVideos && (
            <p className="mt-1 text-sm text-purple-300">Uploading videos...</p>
          )}
        </motion.div>

        {/* Media Previews */}
        {(pastedImagePreviews.length > 0 || uploadedImages.length > 0 || pastedVideoPreviews.length > 0 || uploadedVideos.length > 0) && (
          <motion.div 
            variants={formItemVariants}
            initial="hidden"
            animate="visible"
            className="mt-10"
          >
            <div className="flex items-center mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-700/20 to-transparent"></div>
              <h3 className="text-lg font-semibold text-purple-300 px-4">Media Previews</h3>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-700/20 to-transparent"></div>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {/* Pasted Image URLs */}
              {pastedImagePreviews.map((src, idx) => (
                <motion.div
                  key={"pasted-img-" + idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="relative group overflow-hidden rounded-xl"
                >
                  <img
                    src={src}
                    alt={`preview-${idx}`}
                    className="rounded-xl h-28 w-full object-cover border border-purple-800/30 group-hover:opacity-80 transition-opacity"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePastedImage(idx)}
                    title="Remove"
                    className="absolute top-1 right-1 bg-red-600 bg-opacity-80 rounded-full p-1 text-white opacity-80 hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-xs text-white truncate">Image {idx + 1} (URL)</span>
                  </div>
                </motion.div>
              ))}

              {/* Uploaded Images */}
              {uploadedImages.map((src, idx) => (
                <motion.div
                  key={"uploaded-img-" + idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (pastedImagePreviews.length + idx) * 0.05 }}
                  className="relative group overflow-hidden rounded-xl"
                >
                  <img
                    src={src}
                    alt={`uploaded-preview-${idx}`}
                    className="rounded-xl h-28 w-full object-cover border border-purple-800/30 group-hover:opacity-80 transition-opacity"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveUploadedImage(idx)}
                    title="Remove"
                    className="absolute top-1 right-1 bg-red-600 bg-opacity-80 rounded-full p-1 text-white opacity-80 hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-xs text-white truncate">Image {pastedImagePreviews.length + idx + 1} (Uploaded)</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Videos Grid */}
            {(pastedVideoPreviews.length > 0 || uploadedVideos.length > 0) && (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Pasted Video URLs */}
                {pastedVideoPreviews.map((src, idx) => (
                  <div key={"pasted-video-" + idx} className="relative group rounded-xl overflow-hidden border border-purple-800/30">
                    <VideoPreviewPlayer src={src} index={pastedImagePreviews.length + idx} />
                    <button
                      type="button"
                      onClick={() => handleRemovePastedVideo(idx)}
                      title="Remove"
                      className="absolute top-1 right-1 bg-red-600 bg-opacity-80 rounded-full p-1 text-white opacity-80 hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {/* Uploaded Videos */}
                {uploadedVideos.map((src, idx) => (
                  <div key={"uploaded-video-" + idx} className="relative group rounded-xl overflow-hidden border border-purple-800/30">
                    <VideoPreviewPlayer src={src} index={pastedImagePreviews.length + pastedVideoPreviews.length + idx} />
                    <button
                      type="button"
                      onClick={() => handleRemoveUploadedVideo(idx)}
                      title="Remove"
                      className="absolute top-1 right-1 bg-red-600 bg-opacity-80 rounded-full p-1 text-white opacity-80 hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
                                       {uploadingVideos && (
                  <div className="mt-2 w-full bg-purple-800/20 rounded-full h-3 overflow-hidden">
                    <div
                className="bg-purple-500 h-3 rounded-full transition-all duration-300 ease-in-out"
                 style={{ width: `${videoProgress}%` }}
                    ></div>
                    </div>
                                        )}

              </div>
            )}
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.div
          variants={formItemVariants}
          initial="hidden"
          animate="visible"
          className="mt-12"
        >
          <motion.button
            type="submit"
            disabled={loading || uploadingImages || uploadingVideos}
            className="w-full py-4 bg-gradient-to-r from-purple-700/90 to-indigo-700/90 hover:from-purple-700 hover:to-indigo-800 text-white font-medium rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed group relative overflow-hidden border border-purple-500/20 shadow-lg shadow-purple-900/20"
            whileHover={{ scale: loading || uploadingImages || uploadingVideos ? 1 : 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            {(loading || uploadingImages || uploadingVideos) ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              <>
                <span className="relative z-10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                  Submit Trip Package
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </>
            )}
          </motion.button>
        </motion.div>
      </motion.form>
    </div>
  );
}
