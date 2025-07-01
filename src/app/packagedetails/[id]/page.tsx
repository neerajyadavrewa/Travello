import { connectDB } from "@/lib/db";
import TripPlan from "../../../../models/TripPlan";
import { notFound } from "next/navigation";
import ImageGallery from "@/components/ImageGallery";
import VideoGallery from "@/components/VideoGallery";
import DetailCard from "@/components/DetailCard";
import BookingCard from "@/components/BookingCard";
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";

interface TripPlanType {
  title: string;
  description: string;
  location: string;
  price: string;
  duration: string;
  images: string[];
  videos?: string[];
  lastEntryDate: string;
  createdAt: string;
  updatedAt: string;
}

export default async function PackageDetailsPage({ params }: { params: any }) {
  await connectDB();

  const trip = (await TripPlan.findById(params.id).lean()) as TripPlanType | null;

  if (!trip) notFound();

  const packageData: TripPlanType = {
    title: trip.title,
    description: trip.description,
    location: trip.location,
    price: trip.price,
    duration: trip.duration,
    images: trip.images,
    videos: trip.videos,
    lastEntryDate: trip.lastEntryDate,
    createdAt: trip.createdAt,
    updatedAt: trip.updatedAt,
  };

  return (
    <section className="min-h-screen bg-black text-white px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
            {packageData.title}
          </h1>
          <div className="flex justify-center items-center gap-4 text-gray-400">
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-1 text-purple-400" />
              {packageData.location}
            </div>
            <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
            <div className="flex items-center">
              <FaClock className="mr-1 text-purple-400" />
              {packageData.duration}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image Gallery */}
          <div className="lg:col-span-2">
            <ImageGallery images={packageData.images} />
          </div>

          {/* Right Column - Booking Card */}
          <div>
            <BookingCard
              packageId={params.id}
              lastEntryDate={packageData.lastEntryDate}
              price={packageData.price}
            />
          </div>
        </div>

        {/* Video Gallery - Below image gallery */}
        <div className="lg:col-span-2 mt-12">
          <VideoGallery videos={packageData.videos} />
        </div>

        {/* Details Card - Full width below */}
        <div className="mt-8">
          <DetailCard
            title={packageData.title}
            description={packageData.description}
            location={packageData.location}
            price={packageData.price}
            duration={packageData.duration}
          />
        </div>
      </div>
    </section>
  );
}
