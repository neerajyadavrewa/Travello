// components/ImageGallery.tsx
'use client';

import { useState } from 'react';


export default function ImageGallery({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomImage, setZoomImage] = useState(false);

  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* Main Image Display */}
      <div 
        className={`relative rounded-3xl overflow-hidden shadow-xl border-2 border-purple-700/50 transition-all duration-300 ${
          zoomImage ? 'cursor-zoom-out' : 'cursor-zoom-in'
        }`}
        onClick={() => setZoomImage(!zoomImage)}
      >
        <img
          src={images[selectedImage]}
          alt={`Featured ${selectedImage + 1}`}
          width={800}
          height={450}
          className={`w-full object-cover transition-all duration-500 ${
            zoomImage ? 'h-auto min-h-[350px] scale-150' : 'h-[350px] scale-100'
          }`}
        />
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((img, index) => (
            <div 
              key={index}
              className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                selectedImage === index 
                  ? 'ring-3 ring-purple-500 scale-105' 
                  : 'opacity-80 hover:opacity-100 hover:scale-105'
              }`}
              onClick={() => {
                setSelectedImage(index);
                setZoomImage(false);
              }}
            >
              <img
                src={img}
                alt={`Thumbnail ${index + 1}`}
                width={200}
                height={120}
                className="h-24 w-full object-cover"
              />
              {selectedImage === index && (
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}