
import React, { useEffect, useState } from "react";
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

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/packages")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setPackages(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load packages");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading packages...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="px-4 py-12 bg-black">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-10 text-white tracking-wide">
        ✨ All Packages ✨
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {packages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            id={pkg.id}
            image={pkg.image}
            title={pkg.title}
            description={pkg.description}
            creatorName={pkg.creatorName}
            creatorImage={pkg.creatorImage}
            price={pkg.price}
            duration={pkg.duration}
          />
        ))}
      </div>
    </section>
  );
}
