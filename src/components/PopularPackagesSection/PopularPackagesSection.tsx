"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import PackageCard from "@/components/PackageCard/PackageCard";

type Package = {
  id: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  image: string;
  creatorName: string;
  creatorImage: string;
};

const PopularPackagesSection: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/packages")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch packages");
        return res.json();
      })
      .then((data) => {
        setPackages(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Error loading packages");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-white text-center py-8">Loading packages...</p>;
  if (error) return <p className="text-red-500 text-center py-8">{error}</p>;

  return (
    <section className="px-4 py-12 bg-black">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-10 text-white tracking-wide">
        ✨ Popular Packages ✨
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {packages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            id={pkg.id}
            image={pkg.image || "/default-image.jpg"}
            title={pkg.title}
            description={pkg.description}
            creatorName={pkg.creatorName || "Unknown Creator"}
            creatorImage={pkg.creatorImage || "/default-avatar.jpg"}
            price={pkg.price}
            duration={pkg.duration}
          />
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link href="/packages">
          <button className="inline-block px-6 py-3 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-700 rounded-full shadow-lg hover:from-purple-700 hover:to-indigo-800 hover:shadow-purple-800/40 transition-all">
            Explore All Packages
          </button>
        </Link>
      </div>
    </section>
  );
};

export default PopularPackagesSection;
