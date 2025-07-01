import React from "react";
import PackageCard from "@/components/PackageCard/PackageCard";
import TripPlan from "../../../models/TripPlan";

export const revalidate = 3600;

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

type Props = {
  packages: Package[];
};

const fetchPackages = async (): Promise<Package[]> => {
  const packagesRaw = await TripPlan.find({
    status: "approved",
    lastEntryDate: { $gte: new Date() },
  })
    .populate("creator", "name image") // populate creator info
    .sort({ createdAt: -1 })
    .lean();

  return packagesRaw.map((pkg: any) => ({
    id: pkg._id.toString(),
    title: pkg.title,
    description: pkg.description,
    price: pkg.price,
    duration: pkg.duration,
    image: pkg.images?.[0] || "/default-image.jpg",
    creatorName: pkg.creator?.name || "Unknown",
    creatorImage: pkg.creator?.image || "/default-avatar.jpg",
  }));
};

const PackagesPage: React.FC = async () => {
  const packages = await fetchPackages();

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
    </section>
  );
};

export default PackagesPage;
