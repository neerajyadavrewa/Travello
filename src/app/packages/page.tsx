
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

// const packages = [
//   {
//     image: "https://assets.serenity.co.uk/58000-58999/58779/1296x864.jpg", // Goa Beach
//     title: "Goa Beach Vibes",
//     description: "Experience the vibrant nightlife and serene beaches of Goa.",
//     creatorName: "Rahul Mehta",
//     creatorImage: "https://randomuser.me/api/portraits/men/32.jpg",
//     price: "₹6,999",
//     duration: "4 Days / 3 Nights",
//   },
//   {
//     image: "https://subinsholiday.com/images/shimla-tour-detail-slider-one.jpg", // Manali Hills
//     title: "Manali Hills Escape",
//     description: "Enjoy the snowy mountains and cozy stays in Manali.",
//     creatorName: "Aditi Sharma",
//     creatorImage: "https://randomuser.me/api/portraits/women/44.jpg",
//     price: "₹8,499",
//     duration: "5 Days / 4 Nights",
//   },
//   {
//     image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRobWWjiA2MEEcM15N4f57D6C8wGLSX2Lxy_w&s", // Jaipur City Palace
//     title: "Jaipur Royal Tour",
//     description: "Explore the royal heritage and palaces of Jaipur.",
//     creatorName: "Rohit Jain",
//     creatorImage: "https://randomuser.me/api/portraits/men/65.jpg",
//     price: "₹5,999",
//     duration: "3 Days / 2 Nights",
//   },
//   {
//     image: "https://thumbs.dreamstime.com/b/houseboat-kerala-backwaters-india-panorama-61550403.jpg", // Kerala Backwaters
//     title: "Kerala Backwater Bliss",
//     description: "Relax in houseboats and enjoy the tranquil backwaters of Kerala.",
//     creatorName: "Neha Verma",
//     creatorImage: "https://randomuser.me/api/portraits/women/68.jpg",
//     price: "₹9,999",
//     duration: "5 Days / 4 Nights",
//   },
//   {
//     image: "https://static.toiimg.com/photo/msid-98447982,width-96,height-65.cms", // Rishikesh Rafting
//     title: "Rishikesh Adventure Camp",
//     description: "Experience thrilling rafting and camping in Rishikesh.",
//     creatorName: "Ankit Rawat",
//     creatorImage: "https://randomuser.me/api/portraits/men/24.jpg",
//     price: "₹4,499",
//     duration: "2 Days / 1 Night",
//   },
//   {
//     image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEi3SELcuOVKVl0cmuW8a2jRTT4HhtEukAZg&s", // Kasol Mountains
//     title: "Kasol Chill Getaway",
//     description: "Enjoy the serene landscapes and vibrant culture of Kasol.",
//     creatorName: "Sneha Joshi",
//     creatorImage: "https://randomuser.me/api/portraits/women/25.jpg",
//     price: "₹6,200",
//     duration: "3 Days / 2 Nights",
//   },




//   {
//     image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1",
//     title: "Beachside Bliss in Goa",
//     description: "Enjoy the sun, sea, and sand in Goa with this exclusive 5-day package.",
//     creatorName: "Aman Singh",
//     creatorImage: "https://randomuser.me/api/portraits/men/32.jpg",
//     price: "₹12,999",
//     duration: "5 Days / 4 Nights",
//   },
//   {
//     image: "https://images.unsplash.com/photo-1548013146-72479768bada",
//     title: "Manali Adventure Escape",
//     description: "A thrilling mountain escape full of activities and beautiful landscapes.",
//     creatorName: "Neha Sharma",
//     creatorImage: "https://randomuser.me/api/portraits/women/45.jpg",
//     price: "₹9,499",
//     duration: "4 Days / 3 Nights",
//   },
//   {
//     image: "https://images.unsplash.com/photo-1603133872872-562f95a11f8c",
//     title: "Kerala Backwaters Retreat",
//     description: "Relax on a houseboat and explore the scenic beauty of Kerala.",
//     creatorName: "Ravi Patel",
//     creatorImage: "https://randomuser.me/api/portraits/men/54.jpg",
//     price: "₹14,599",
//     duration: "6 Days / 5 Nights",
//   },
//   {
//     image: "https://images.unsplash.com/photo-1606813074716-63f14a0b4b7e",
//     title: "Rajasthan Royal Tour",
//     description: "Experience the culture, forts, and deserts of royal Rajasthan.",
//     creatorName: "Divya Verma",
//     creatorImage: "https://randomuser.me/api/portraits/women/64.jpg",
//     price: "₹16,000",
//     duration: "5 Days / 4 Nights",
//   },
//   {
//     image: "https://images.unsplash.com/photo-1590490360183-69474f2983ed",
//     title: "Sikkim Serenity Sojourn",
//     description: "Explore the peace and beauty of North-East India with this trip.",
//     creatorName: "Kunal Joshi",
//     creatorImage: "https://randomuser.me/api/portraits/men/28.jpg",
//     price: "₹11,300",
//     duration: "4 Days / 3 Nights",
//   },
//   {
//     image: "https://images.unsplash.com/photo-1560343090-f0409e92791a",
//     title: "Andaman Island Getaway",
//     description: "Crystal clear waters and white sands await in the Andamans.",
//     creatorName: "Sneha Kapoor",
//     creatorImage: "https://randomuser.me/api/portraits/women/78.jpg",
//     price: "₹18,499",
//     duration: "6 Days / 5 Nights",
//   },
// ];

 const packagesRaw = await TripPlan.find({
  status: "approved",
  lastEntryDate: { $gte: new Date() },
})
  .populate("creator", "name image") // populate creator info
  .sort({ createdAt: -1 })
  .lean();

const packages = packagesRaw.map((pkg: any) => ({
  id: pkg._id.toString(),
  title: pkg.title,
  description: pkg.description,
  price: pkg.price,
  duration: pkg.duration,
  image: pkg.images?.[0] || "/default-image.jpg",
  creatorName: pkg.creator?.name || "Unknown",
  creatorImage: pkg.creator?.image|| "/default-avatar.jpg",
}));
const  PackagesPage: React.FC<Props> = () => {

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
