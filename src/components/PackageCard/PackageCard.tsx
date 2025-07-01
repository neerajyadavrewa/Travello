"use client";

import React from "react";
import Link from "next/link";

type PackageCardProps = {
  id:string,
  image: string;
  title: string;
  description: string;
  creatorName: string;
  creatorImage: string;
  price: string;
  duration: string;
};

const PackageCard: React.FC<PackageCardProps> = ({
  id,
  image,
  title,
  description,
  creatorName,
  creatorImage,
  price,
  duration,
}) => {
  return (
    <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-zinc-800 rounded-2xl w-full max-w-sm h-[420px] flex flex-col overflow-hidden shadow-xl hover:shadow-violet-800/40 transition-transform duration-300 transform hover:scale-[1.02] group">
      
      {/* Image Section */}
      <div className="h-48 w-full overflow-hidden relative">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition" />
      </div>

      {/* Content Section */}
      <div className="flex flex-col justify-between flex-grow p-5 space-y-4 text-gray-300">
        
        {/* Title & Description */}
        <div>
          <h3 className="text-2xl font-semibold text-white truncate mb-1">{title}</h3>
          <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">{description}</p>
        </div>

        {/* Creator Info */}
        <div className="flex items-center gap-3 pt-2">
          <img
            src={creatorImage}
            alt={creatorName}
            className="w-9 h-9 rounded-full border-2 border-violet-600 shadow-sm"
          />
          <span className="text-sm font-medium text-gray-200">{creatorName}</span>
        </div>

        {/* Price & Button */}
        <div className="flex justify-between items-center pt-1">
          <div>
            <p className="text-lg font-bold text-stone-500">₹{price}</p>
            <p className="text-xs text-gray-500">{duration} days</p>
          </div>
                          
          <Link
            href={`/packagedetails/${id}`}
            className="px-4 py-1.5 rounded-md bg-gradient-to-tr from-violet-600 to-indigo-700 text-white text-sm font-medium shadow-md  hover:from-stone-500 hover:to-indigo-800 transition-all duration-300"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
