// components/VideoGallery.tsx
'use client';

import { useState } from 'react';

export default function VideoGallery({ videos }: { videos?: string[] }) {
  const [selectedVideo, setSelectedVideo] = useState(0);
  const [playing, setPlaying] = useState(false);

  if (!videos || videos.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6 text-purple-300 border-b border-purple-800 pb-2">
        Detailed Video 
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Video Player */}
        <div className="md:col-span-2">
          <div className="relative rounded-2xl overflow-hidden bg-black">
            <video
              controls
              autoPlay={playing}
              className="w-full"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            >
              <source src={videos[selectedVideo]} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Video Thumbnails */}
        {videos.length > 1 && (
          <>
            {videos.map((video, index) => (
              <div 
                key={index}
                className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                  selectedVideo === index 
                    ? 'ring-3 ring-purple-500 scale-[1.02]' 
                    : 'opacity-80 hover:opacity-100 hover:scale-[1.02]'
                }`}
                onClick={() => {
                  setSelectedVideo(index);
                  setPlaying(true);
                }}
              >
                <div className="relative aspect-video">
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-purple-700/80 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <video className="w-full h-full object-cover">
                    <source src={video} type="video/mp4" />
                  </video>
                </div>
                <div className="p-3 bg-zinc-900">
                  <p className="text-gray-300 text-sm truncate">Video Preview {index + 1}</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}