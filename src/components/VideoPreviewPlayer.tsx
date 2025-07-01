"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function VideoPreviewPlayer({ src, index }: { src: string; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

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

  const seek = (seconds: number) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime += seconds;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="relative group overflow-hidden rounded-xl"
    >
      <video
        ref={videoRef}
        src={src}
        className="rounded-xl h-28 w-full object-cover border border-purple-800/30"
        preload="metadata"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Control Overlay */}
      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between p-2 text-white">
        {/* Rewind */}
        <button
          onClick={() => seek(-10)}
          className="bg-black/50 hover:bg-black/70 rounded-full p-2"
          title="Rewind 10s"
        >
          ⏪
        </button>

        {/* Center Play / Mute */}
        <div className="flex flex-col items-center space-y-2">
          <button
            onClick={togglePlay}
            className="bg-black/50 hover:bg-black/70 rounded-full p-2"
            title="Play/Pause"
          >
            {isPlaying ? "⏸️" : "▶️"}
          </button>

          <button
            onClick={toggleMute}
            className="bg-black/50 hover:bg-black/70 rounded-full p-2"
            title="Mute/Unmute"
          >
            {isMuted ? "🔇" : "🔊"}
          </button>
        </div>

        {/* Forward */}
        <button
          onClick={() => seek(10)}
          className="bg-black/50 hover:bg-black/70 rounded-full p-2"
          title="Forward 10s"
        >
          ⏩
        </button>
      </div>
    </motion.div>
  );
}
