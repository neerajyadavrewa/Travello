
import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";
import { ImagesSlider } from "@/components/ui/images-slider";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { GlareCard } from "@/components/ui/glare-card";
import Footer from "@/components/Footer/Footer";
import ColourfulText from "@/components/ui/colourful-text";
import { motion } from "framer-motion";
import { StickyScroll } from "../components/ui/sticky-scroll-reveal";
import Image from "next/image";
import CreatorsSection from "@/components/CreatorsSection/CreatorsSection";
import PackageCard from "@/components/PackageCard/PackageCard";
import { connectDB } from "@/lib/db";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import TripPlan from "../../models/TripPlan";
import { User } from "../../models/User";
import PopularPackagesSection from "@/components/PopularPackagesSection/PopularPackagesSection";


 export const revalidate = 60 * 60; 



export default async function Home() {
 
const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  await connectDB();
  
    const today = new Date();
  
   const packagesRaw = await TripPlan.find({
  status: "approved",
  lastEntryDate: { $gte: new Date() },
})
  .populate("creator", "name image") // populate creator info
  .sort({ createdAt: -1 })
   .limit(9)
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
//  const packages = [
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
// ];


  
// const creators = [
//   {
//     id: 1,
//     name: "Aditi Explorer",
//     bio:"Aditi is a passionate traveler who loves exploring new cultures and cuisines. She has a knack for finding hidden gems in every city she visits.",
//     avatar: "https://i.pravatar.cc/150?img=3",
//   },
//   {
//     id: 2,
//     name: "Raj Adventurer",
//     bio: "Raj is an adventure seeker who enjoys trekking and outdoor activities. His travel stories are filled with thrilling experiences.",
//     avatar: "https://i.pravatar.cc/150?img=8",
//   },
//   {
//     id: 3,
//     name: "Neha Nomad",
//     bio: "Neha is a digital nomad who travels the world while working remotely. She shares tips on balancing work and travel.",
//     avatar: "https://i.pravatar.cc/150?img=5",
//   },
//   {
//     id: 4,
//     name: "Aman Wanderer",
//     bio: "Aman is a seasoned traveler with a passion for photography. He captures the beauty of each destination through his lens.",
//     avatar: "https://i.pravatar.cc/150?img=9",
//   },
// ];

 


  const words = `Travello`;

  const images = [
    "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?cs=srgb&dl=pexels-souvenirpixels-417074.jpg&fm=jpg",
    "https://i.pinimg.com/originals/9c/b0/70/9cb070d62dc738a0c3a1a408d68e4af5.jpg",
    "https://media.istockphoto.com/id/899087286/photo/waterplants-on-dal-lake-srinagar-kashmir-india.jpg?s=612x612&w=0&k=20&c=eg1bh74yfxt1qi8WdQtQ8VOGpeZjT4Jp4ozay3Rg2IQ=",
    "https://media.istockphoto.com/id/1171962535/photo/srinagar-kashmir.jpg?s=2048x2048&w=is&k=20&c=tYXrKV48_5L1sMrZ_Q7HRXJ9WRdnbhAYtIqt23TgZ_8=",
    "https://media.istockphoto.com/id/1326923769/photo/beautiful-view-of-pahalgam-during-winter-season-kashmir-india.jpg?s=2048x2048&w=is&k=20&c=qumoCMd0OZIDE_bbjkfX86SCl2TySm4NVI40Z9a9pqY="
    
  ];
    
  return (
    <>
    
    
    <div className= "bg-black text-white min-h-screen flex flex-col">
  
     <div className="bg-black text-white py-2 px-3 sm:px-12">
  <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
    
    {/* Text Content */}
    <div className="lg:w-1/2 text-center lg:text-left">
      <h1 className="text-3xl sm:text-5xl font-bold leading-tight tracking-tight mb-6 text-[#D1BFA7]">
        Let’s redefine travel with 
        <span className="block"><ColourfulText text={words} /></span>
      </h1>
      
      <p className="text-lg text-[#AFAFAF] mb-8">
        A platform for travel enthusiasts to explore, create, and share unforgettable travel experiences.
      </p>

      <Link
        href="/becomecreator"
        className="inline-block bg-[#6C63FF] text-white text-lg font-semibold px-6 py-3 rounded-md 
                   shadow-md hover:shadow-lg 
                   transform hover:scale-105 
                   transition duration-300 ease-in-out 
                   hover:bg-[#A46CFF]"
      >
        Become a Creator
      </Link>
    </div>

    {/* Image/Slider Content + Subtitle */}
    <div className="lg:w-1/2 w-full h-[55vh] relative overflow-hidden rounded-xl shadow-2xl flex flex-col items-center">
      <ImagesSlider
        images={images}
        autoplay={true}
        overlay={true}
        direction="up"
        className="h-full w-full object-cover rounded-xl"
      />
       <TextGenerateEffect words="Visit these unforgettable destinations with Travello" className="mt-3 text-xl text-[#3c3c3b] text-center" />
    
    </div>

  </div>
</div>

      
       <PopularPackagesSection packages={packages} />



       
       
     <div>
        <div>
      <CreatorsSection/>
    </div>
     </div>



      {/* Footer */}
      <Footer/>
    </div>
    
    </>
  );
}


