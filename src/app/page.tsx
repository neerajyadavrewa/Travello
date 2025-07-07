
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


 



export default async function Home() {
 
const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  await connectDB();
  

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
       <PopularPackagesSection />
     <div>
        <div>
      <CreatorsSection/>
    </div>
     </div>
    </div>
    </>
  );
}


