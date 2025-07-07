"use client";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function VideoPreviewPlayer({
  src,
  index,
}: {
  src: string;
  index: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = isMuted;
      video.play().catch(() => setIsPlaying(false));
    }
  }, []);

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      setIsMuted(video.muted);
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, ease: "easeOut" }}
      className="relative group rounded-xl overflow-hidden"
    >
      <video
        ref={videoRef}
        src={src}
        className="h-48 w-full object-cover rounded-xl border border-purple-700/30"
        loop
        muted={isMuted}
        autoPlay
        playsInline
        preload="metadata"
      />

      {/* Overlay Controls */}
      <div className="absolute inset-0 bg-black/40 group-hover:opacity-100 opacity-0 transition-opacity duration-300 flex items-center justify-center gap-3">
        <button
          onClick={togglePlay}
          className="p-2 bg-black/60 hover:bg-black/80 rounded-full text-white"
        >
          {isPlaying ? "⏸" : "▶"}
        </button>
        <button
          onClick={toggleMute}
          className="p-2 bg-black/60 hover:bg-black/80 rounded-full text-white"
        >
          {isMuted ? "🔇" : "🔊"}
        </button>
      </div>
    </motion.div>
  );
}
