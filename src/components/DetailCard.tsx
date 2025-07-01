// components/DetailCard.tsx
'use client';

import { FaMapMarkerAlt, FaRupeeSign, FaClock } from 'react-icons/fa';
import { useState } from 'react';

export default function DetailCard({ 
  title, 
  description, 
  location, 
  price, 
  duration 
}: { 
  title: string; 
  description: string; 
  location: string; 
  price: string; 
  duration: string; 
}) {
  const [expanded, setExpanded] = useState(false);
  
  // Function to create paragraphs from new lines
  const renderDescription = () => {
    return description.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-4 last:mb-0">{paragraph}</p>
    ));
  };

  return (
    <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-950 backdrop-blur-sm rounded-2xl p-6 border border-purple-900/30 shadow-2xl">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-300 to-purple-400 bg-clip-text text-transparent mb-6">
        {title}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="flex items-center gap-4 p-4 bg-zinc-800/40 rounded-xl border border-zinc-700/50">
          <div className="p-3 bg-purple-900/30 rounded-xl">
            <FaMapMarkerAlt className="text-2xl text-purple-400" />
          </div>
          <div>
            <h3 className="text-gray-400 text-sm">Destination</h3>
            <p className="text-white font-medium">{location}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-zinc-800/40 rounded-xl border border-zinc-700/50">
          <div className="p-3 bg-purple-900/30 rounded-xl">
            <FaClock className="text-2xl text-purple-400" />
          </div>
          <div>
            <h3 className="text-gray-400 text-sm">Duration</h3>
            <p className="text-white font-medium">{duration}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-zinc-800/40 rounded-xl border border-zinc-700/50">
          <div className="p-3 bg-purple-900/30 rounded-xl">
            <FaRupeeSign className="text-2xl text-purple-400" />
          </div>
          <div>
            <h3 className="text-gray-400 text-sm">Price Per Person</h3>
            <p className="text-2xl text-stone-400 font-bold">₹{price}</p>
          </div>
        </div>
      </div>

      {/* Description with expand/collapse */}
      <div className="border-t border-zinc-800 pt-6">
        <h2 className="text-xl font-bold text-purple-300 mb-4">Journey Details</h2>
        <div className={`prose prose-invert max-w-none text-gray-300 ${expanded ? '' : 'max-h-[200px] overflow-hidden'}`}>
          {renderDescription()}
        </div>
        {description.length > 500 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 text-purple-400 hover:text-purple-300 flex items-center"
          >
            {expanded ? 'Show Less' : 'Read More'}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 ml-1 transition-transform ${expanded ? 'rotate-180' : ''}`}
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}