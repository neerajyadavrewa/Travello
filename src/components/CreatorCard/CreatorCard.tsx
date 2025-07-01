import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

type Creator = {
  id: string;
  name: string;
  bio: string;
  avatar: string;
};

type CreatorCardProps = {
  creator: Creator;
};

const CreatorCard: React.FC<CreatorCardProps> = ({ creator }) => {
  return (
    <motion.div 
      className="relative w-full max-w-md bg-gradient-to-br from-[#0f0f15] to-[#1d1b2e] rounded-2xl overflow-hidden border border-purple-900/40 shadow-2xl shadow-purple-900/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -10,
        boxShadow: "0 25px 50px -12px rgba(139, 92, 246, 0.25)"
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Glowing background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-700 rounded-full filter blur-[80px] opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-800 rounded-full filter blur-[100px] opacity-15"></div>
      
      {/* Card content */}
      <div className="relative z-10 flex flex-col h-full p-6 backdrop-blur-sm">
        {/* Large circular avatar with floating effect */}
        <motion.div 
          className="flex justify-center -mt-16 mb-6"
          whileHover={{ rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className=" mt-10 relative">
            <div className=" absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-full blur-md opacity-60 animate-pulse"></div>
            <img
              src={creator.avatar}
              alt={`${creator.name} avatar`}
              className="relative w-32 h-32 rounded-full object-cover border-4 border-[#1d1b2e] shadow-lg"
            />
          </div>
        </motion.div>

        {/* Creator details with enhanced layout */}
        <div className="flex flex-col items-center text-center">
          <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-200 mb-3">
            {creator.name}
          </h3>
          <div className="relative w-full mb-5">
            <div className="h-px bg-gradient-to-r from-transparent via-purple-700/30 to-transparent"></div>
          </div>
          <p className="text-sm text-gray-300 mb-6 line-clamp-3 min-h-[3.5rem]">
            {creator.bio}
          </p>
        </div>

        {/* View profile button with subtle animation */}
        <motion.div 
          className="mt-auto"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            href={`/creator/${creator.id}`}
            className="block w-full py-3 text-center bg-gradient-to-r from-purple-700/70 to-indigo-700/70 rounded-xl text-white font-medium hover:from-purple-700 hover:to-indigo-800 transition-all shadow-md shadow-purple-900/20 border border-purple-500/30"
          >
            View Creator Profile
          </Link>
        </motion.div>
      </div>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none group-hover:shadow-[0_0_50px_10px_rgba(139,92,246,0.3)] transition-all duration-300"></div>
    </motion.div>
  );
};

export default CreatorCard;