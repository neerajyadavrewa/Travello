  "use client";
import React, { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLinkedin,
  FaCheckCircle,
  FaPlusCircle,
  FaTrashAlt,
  FaEdit,
  FaTimes,
  FaSave,
  FaGlobe,
  FaCamera,
  FaUser,
  FaRocket,
} from "react-icons/fa";
import PackageCard from "../../../components/PackageCard/PackageCard";
import { motion, AnimatePresence } from "framer-motion";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "";
const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || "";

import { useParams } from "next/navigation";

const CreatorProfilePage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const params = useParams();
  const creatorId = params?.id as string | undefined;

  type Creator = {
    _id: string;
    image: string;
    name: string;
    bio: string;
    verified?: boolean;
    gallery?: string[];
    packages?: any[];
    socialLinks?: {
      instagram?: string;
      youtube?: string;
      twitter?: string;
      linkedin?: string;
    };
  };

  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);
  const [newGalleryImages, setNewGalleryImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editProfileMode, setEditProfileMode] = useState(false);
  const [editedCreator, setEditedCreator] = useState<Partial<Creator>>({});
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [newProfileImage, setNewProfileImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [bookingSummary, setBookingSummary] = useState<
    { _id: string; packageTitle: string; totalBookings: number; totalTravelers: number }[]
  >([]);

  
  useEffect(() => {
    if (!creatorId) return;
    setLoading(true);
    const fetchCreatorById = async () => {
      try {
        const res = await fetch(`/api/creator/${creatorId}`);
        if (!res.ok) throw new Error("Creator not found");
        const data = await res.json();
        setCreator(data);
        setEditedCreator(data);
        setEditMode(false);
      } catch (err) {
        setMessage("❌ Failed to load creator profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchCreatorById();
  }, [creatorId]);


  useEffect(() => {
    fetch("/api/creator/bookings-summary")
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) setBookingSummary(data.data);
      })
      .catch(() => console.error("Failed to load booking summary"));
  }, []);

   const isOwner = session?.user?.id === creator?._id;

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const uploadedUrls: string[] = [];

    for (let file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();
        if (data.secure_url) uploadedUrls.push(data.secure_url);
      } catch {
        setMessage("❌ Image upload failed.");
      }
    }

    setNewGalleryImages((prev) => [...prev, ...uploadedUrls]);
    setUploading(false);
  };

  const handleRemoveImage = async (url: string) => {
    if (newGalleryImages.includes(url)) {
      setNewGalleryImages((prev) => prev.filter((img) => img !== url));
    } else if (creator?.gallery && creator.gallery.includes(url)) {
      if (
        !confirm(
          "Are you sure you want to delete this image permanently from gallery?"
        )
      )
        return;

      try {
        const res = await fetch(`/api/creator/${creator?._id}/gallery`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: url }),
        });

        if (!res.ok) throw new Error("Delete failed");

        const updatedGallery = creator.gallery.filter((img) => img !== url);
        setCreator({ ...creator, gallery: updatedGallery });
        setMessage("✅ Image deleted successfully!");

        if (updatedGallery.length === 0) setEditMode(false);
      } catch {
        setMessage("❌ Failed to delete image.");
      }
    }
  };

  const handleSaveGallery = async () => {
    if (!creator) return;
    const updatedGallery = [...(creator.gallery || []), ...newGalleryImages];
    try {
      const res = await fetch(`/api/creator/${creator?._id}/gallery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gallery: updatedGallery }),
      });

      if (!res.ok) throw new Error("Save failed");
      setCreator({ ...creator, gallery: updatedGallery });
      setNewGalleryImages([]);
      setMessage("✅ Gallery saved successfully!");
      setEditMode(false);
    } catch {
      setMessage("❌ Failed to save gallery.");
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedCreator((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialLinkChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    platform: string
  ) => {
    const { value } = e.target;
    setEditedCreator((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  const uploadProfileImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    return data.secure_url;
  };

  const handleSaveProfile = async () => {
    if (!creator) return;
    setIsSavingProfile(true);
    
    try {
      let imageUrl = creator.image;
      // Upload new profile image if changed
      if (profileImageFile) {
        imageUrl = await uploadProfileImage(profileImageFile);
      }

      // Prepare updated data
      const updatedData = {
        ...editedCreator,
        image: imageUrl,
      };

      // Save to backend
      const res = await fetch(`/api/creator/${creator?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error("Failed to save profile");

      const data = await res.json();
      setCreator(data);
      setEditedCreator(data);
      setEditProfileMode(false);
      setMessage("✅ Profile updated successfully!");
    } catch (error) {
      setMessage("❌ Failed to update profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCreatePackage = () => {
    router.push("/trip/create");
  };

  const galleryToShow = [...(creator?.gallery || []), ...newGalleryImages];

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center h-screen">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-gray-800 h-24 w-24 mb-6"></div>
              <div className="h-8 bg-gray-800 rounded w-64 mb-4"></div>
              <div className="h-4 bg-gray-800 rounded w-80 mb-2"></div>
              <div className="h-4 bg-gray-800 rounded w-72"></div>
            </div>
          </div>
        </div>
      </div>
    );
    if (!creator)
    return (
      <div className="min-h-screen flex justify-center items-center text-red-400">
        Creator not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Creator Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-12"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-900/30 to-indigo-900/20 rounded-2xl blur-xl -z-10"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50">
            <div className="relative">
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="relative group"
              >
                <img
                  src={newProfileImage || creator?.image || ""}
                  alt={creator?.name || "Creator"}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-indigo-500/80 object-cover shadow-lg"
                />
                {isOwner && editProfileMode && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white p-2 rounded-full hover:bg-indigo-600 transition-all shadow-lg"
                    title="Change photo"
                  >
                    <FaCamera size={18} />
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfileImageChange}
                    />
                  </motion.button>
                )}
                {isOwner && creator?.verified && !editProfileMode && (
                  <div className="absolute bottom-2 right-2 bg-indigo-600 rounded-full p-1">
                    <FaCheckCircle className="text-white" size={20} />
                  </div>
                )}
              </motion.div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex justify-between items-start">
                {isOwner && editProfileMode ? (
                  <div className="w-full">
                    <input
                      type="text"
                      name="name"
                      value={editedCreator.name || ""}
                      onChange={handleInputChange}
                      className="text-4xl md:text-5xl font-bold bg-transparent border-b border-indigo-500/50 w-full mb-4 focus:outline-none focus:border-indigo-400"
                    />
                    <textarea
                      name="bio"
                      value={editedCreator.bio || ""}
                      onChange={handleInputChange}
                      className="text-gray-300 text-lg bg-transparent border-b border-gray-700/50 w-full mb-6 focus:outline-none focus:border-indigo-400 resize-none"
                      rows={3}
                    />
                  </div>
                ) : (
                  <div>
                    <motion.h1 
                      className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-violet-300 mb-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {creator?.name}
                    </motion.h1>
                    <p className="text-gray-300 text-lg max-w-2xl mb-6">
                      {creator?.bio}
                    </p>
                  </div>
                )}
                {isOwner && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (editProfileMode) {
                      // Reset changes when canceling
                      setEditedCreator(creator || {});
                      setNewProfileImage(null);
                      setProfileImageFile(null);
                    }
                    setEditProfileMode(!editProfileMode);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    editProfileMode 
                      ? "bg-gray-700/50 hover:bg-gray-600/50 text-gray-300" 
                      : "bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400"
                  } transition-all`}
                >
                  {editProfileMode ? <FaTimes /> : <FaEdit />}
                  <span>{editProfileMode ? "Cancel" : "Edit Profile"}</span>
                </motion.button>
                )}
              </div>
              
            
              
              {/* Social Links */}
              <div className="flex flex-wrap gap-5">
                { isOwner && editProfileMode ? (
                  <>
                    <div className="flex items-center gap-2 bg-gray-700/50 rounded-lg px-3 py-2">
                      <FaInstagram className="text-pink-500" />
                      <input
                        type="text"
                        placeholder="Instagram URL"
                        value={editedCreator.socialLinks?.instagram || ""}
                        onChange={(e) => handleSocialLinkChange(e, "instagram")}
                        className="bg-transparent focus:outline-none placeholder-gray-500 w-40"
                      />
                    </div>
                    <div className="flex items-center gap-2 bg-gray-700/50 rounded-lg px-3 py-2">
                      <FaTwitter className="text-blue-400" />
                      <input
                        type="text"
                        placeholder="Twitter URL"
                        value={editedCreator.socialLinks?.twitter || ""}
                        onChange={(e) => handleSocialLinkChange(e, "twitter")}
                        className="bg-transparent focus:outline-none placeholder-gray-500 w-40"
                      />
                    </div>
                    <div className="flex items-center gap-2 bg-gray-700/50 rounded-lg px-3 py-2">
                      <FaYoutube className="text-red-500" />
                      <input
                        type="text"
                        placeholder="YouTube URL"
                        value={editedCreator.socialLinks?.youtube || ""}
                        onChange={(e) => handleSocialLinkChange(e, "youtube")}
                        className="bg-transparent focus:outline-none placeholder-gray-500 w-40"
                      />
                    </div>
                    <div className="flex items-center gap-2 bg-gray-700/50 rounded-lg px-3 py-2">
                      <FaLinkedin className="text-blue-300" />
                      <input
                        type="text"
                        placeholder="LinkedIn URL"
                        value={editedCreator.socialLinks?.linkedin || ""}
                        onChange={(e) => handleSocialLinkChange(e, "linkedin")}
                        className="bg-transparent focus:outline-none placeholder-gray-500 w-40"
                      />
                    </div>
                  </>
                ) : (
                  creator?.socialLinks && (
                    <>
                      {creator.socialLinks.instagram && (
                        <motion.a
                          whileHover={{ y: -3, scale: 1.1 }}
                          href={creator.socialLinks.instagram}
                          target="_blank"
                          rel="noreferrer"
                          className="text-gray-400 hover:text-pink-500 transition-colors"
                        >
                          <FaInstagram size={24} />
                        </motion.a>
                      )}
                      {creator.socialLinks.twitter && (
                        <motion.a
                          whileHover={{ y: -3, scale: 1.1 }}
                          href={creator.socialLinks.twitter}
                          target="_blank"
                          rel="noreferrer"
                          className="text-gray-400 hover:text-blue-400 transition-colors"
                        >
                          <FaTwitter size={24} />
                        </motion.a>
                      )}
                      {creator.socialLinks.youtube && (
                        <motion.a
                          whileHover={{ y: -3, scale: 1.1 }}
                          href={creator.socialLinks.youtube}
                          target="_blank"
                          rel="noreferrer"
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <FaYoutube size={24} />
                        </motion.a>
                      )}
                      {creator.socialLinks.linkedin && (
                        <motion.a
                          whileHover={{ y: -3, scale: 1.1 }}
                          href={creator.socialLinks.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="text-gray-400 hover:text-blue-300 transition-colors"
                        >
                          <FaLinkedin size={24} />
                        </motion.a>
                      )}
                    </>
                  )
                )}
              </div>
            </div>
          </div>

          {isOwner && editProfileMode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end mt-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveProfile}
                disabled={isSavingProfile}
                className="flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold shadow-lg shadow-indigo-500/20 transition-all"
              >
                {isSavingProfile ? (
                  <>
                    <div className="h-4 w-4 border-t-2 border-white rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FaSave />
                    <span>Save Changes</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Gallery Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <div className="flex flex-wrap justify-between items-center mb-8">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400 mb-4 md:mb-0">
              Gallery
            </h2>
            
            <div className="flex gap-4">
              {isOwner && creator?.gallery && creator.gallery.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEditMode((prev) => !prev)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    editMode 
                      ? "bg-red-500/20 hover:bg-red-500/30 text-red-400" 
                      : "bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400"
                  } transition-all`}
                  title={editMode ? "Cancel Edit" : "Edit Gallery"}
                >
                  {editMode ? <FaTimes /> : <FaEdit />}
                  <span>{editMode ? "Cancel" : "Edit"}</span>
                </motion.button>
              )}

              {isOwner && ( <motion.label
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 transition-all"
              >
                <FaPlusCircle />
                <span>Add Images</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleGalleryUpload}
                />
              </motion.label>)}
            </div>
          </div>

          <AnimatePresence>
            {message && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`text-sm mb-6 px-4 py-3 rounded-lg ${
                  message.includes("❌") 
                    ? "bg-red-500/20 text-red-300" 
                    : "bg-green-500/20 text-green-300"
                }`}
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>

          {uploading && (
            <div className="flex items-center gap-3 mb-6 text-indigo-400">
              <div className="h-8 w-8 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
              <span>Uploading images...</span>
            </div>
          )}

         {galleryToShow.length > 0 ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {galleryToShow.map((img, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ y: -5 }}
        className="relative group overflow-hidden rounded-xl border border-gray-700/50 shadow-lg"
      >
        <img
          src={img}
          alt={`gallery-${i}`}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Show remove button ONLY if owner and in edit mode or new images */}
        {isOwner && (newGalleryImages.includes(img) || editMode) && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => handleRemoveImage(img)}
            className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-white p-2 rounded-full hover:bg-red-600 transition-all shadow-lg"
            title="Remove"
          >
            <FaTrashAlt size={18} />
          </motion.button>
        )}
      </motion.div>
    ))}
  </div>
) : (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-16 border-2 border-dashed border-gray-700/50 rounded-2xl bg-gray-900/20"
  >
    <div className="mb-4">
      <div className="inline-block p-4 rounded-full bg-gray-800/50 mb-3">
        <FaCamera className="text-indigo-500 text-3xl" />
      </div>
    </div>
    <p className="text-gray-500 text-xl mb-3">No images in gallery yet</p>
    <p className="text-gray-600 max-w-md mx-auto mb-6">
      Add images to showcase your work and attract more travelers
    </p>

    {/* Show upload button ONLY if owner */}
    {isOwner && (
      <motion.label
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="cursor-pointer inline-flex items-center gap-2 px-6 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all"
      >
        <FaPlusCircle />
        <span>Upload Images</span>
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleGalleryUpload}
        />
      </motion.label>
    )}
  </motion.div>
)}


          {newGalleryImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center mt-10"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveGallery}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold shadow-lg shadow-indigo-500/20 transition-all"
              >
                Save Gallery Images
              </motion.button>
            </motion.div>
          )}
        </motion.section>

        {/* Packages Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
              Trip Packages
            </h2>
            {isOwner? (<motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreatePackage}
              className="px-4 py-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 transition-all flex items-center gap-2"
            >
              <FaPlusCircle />
              <span>Create New Package</span>
            </motion.button>) : null}
          </div>
          
          {creator?.packages && creator.packages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {creator.packages.map((pkg: any) => (
                <PackageCard
                  id={pkg._id}
                  key={pkg._id}
                  image={pkg.images[0]}
                  title={pkg.title}
                  description={pkg.description}
                  creatorName={creator.name}
                  creatorImage={creator.image}
                  price={pkg.price}
                  duration={pkg.duration}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 border-2 border-dashed border-gray-700/50 rounded-2xl bg-gray-900/20"
            >
              <div className="mb-4">
                <div className="inline-block p-4 rounded-full bg-gray-800/50 mb-3">
                  <FaRocket className="text-indigo-500 text-3xl" />
                </div>
              </div>
              <p className="text-gray-500 text-xl mb-3">No packages created yet</p>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                Create exciting travel packages to showcase your expertise and attract travelers
              </p>
            </motion.div>
          )}
        </motion.section>
        {isOwner && bookingSummary.length > 0 && (
  <motion.section
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.5 }}
    className="mb-16"
  >
    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400 mb-6">
      Booking Summary
    </h2>

    <div className="overflow-x-auto rounded-lg border border-gray-700/50">
      <table className="min-w-full bg-gray-800/30 text-left text-sm text-white">
        <thead className="bg-gray-700/50 text-indigo-400 uppercase text-xs">
          <tr>
            <th className="px-6 py-4">Package Title</th>
            <th className="px-6 py-4">Total Bookings</th>
            <th className="px-6 py-4">Total Travelers</th>
          </tr>
        </thead>
        <tbody>
          {bookingSummary.map((entry) => (
            <tr key={entry._id} className="border-t border-gray-700 hover:bg-gray-800/50">
              <td className="px-6 py-4">{entry.packageTitle}</td>
              <td className="px-6 py-4">{entry.totalBookings}</td>
              <td className="px-6 py-4">{entry.totalTravelers}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.section>
)}

      </div>
    </div>
  );
};

export default CreatorProfilePage;