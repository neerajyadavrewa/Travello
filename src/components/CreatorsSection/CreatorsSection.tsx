"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import CreatorCard from "../CreatorCard/CreatorCard";

type Creator = {
  _id: string;
  name: string;
  bio: string;
  image: string; // assuming image is stored as "image" not "avatar"
};

const CreatorsSection = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const res = await fetch("/api/creators/all");
        const data = await res.json();
        setCreators(data);
      } catch (error) {
        console.error("Failed to fetch creators", error);
      }
    };

    fetchCreators();
  }, []);

  const displayedCreators = showAll ? creators : creators.slice(0, 4);

  return (
    <section className="px-4 py-16 bg-black relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-transparent to-indigo-900/10 pointer-events-none" />

      <div className="relative z-10">
        <h2 className="text-4xl font-extrabold text-center mb-4 text-gray-400 tracking-tight">
          ✨ Top Travel Creators ✨
        </h2>
        <p className="text-center text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
          Discover top travel creators creating magical travel experiences by Travello.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {displayedCreators.map((creator) => (
            <CreatorCard
              key={creator._id}
              creator={{
                id: creator._id,
                name: creator.name,
                bio: creator.bio,
                avatar: creator.image,
              }}
            />
          ))}
        </div>

        {/* See All / Collapse */}
        {creators.length > 4 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-block px-6 py-2 text-sm font-medium text-white bg-purple-700 hover:bg-purple-800 rounded-full transition"
            >
              {showAll ? "Show Less" : "See All Creators"}
            </button>
          </div>
        )}

        {/* Become a Creator Button */}
        <div className="mt-10 text-center">
          <Link
            href="/becomecreator"
            className="inline-block px-6 py-3 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-700 rounded-full shadow-lg hover:from-purple-700 hover:to-indigo-800 hover:shadow-purple-800/40 transition-all"
          >
            Become a Creator
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CreatorsSection;
