"use client"
import Link from 'next/link';
import React from 'react'
import ColourfulText from "@/components/ui/colourful-text";
function Footer() {
  const words = `Travello`;
  return (
   
    <footer className="bg-black border-t-2 border-stone-600  text-white py-10">
      
      
      <div className="container mx-autopx-6 md:px-12">
        {/* Main Footer Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
          {/* Left Section: Branding */}
          <div className="flex flex-col items-center md:items-start space-y-4">
           <span className="block text-3xl sm:text-5xl font-bold  "><ColourfulText text={words} /></span>
            <p className="text-sm text-stone-400 text-center md:text-left max-w-sm">
             🎉 Your Gateway to Event-Based Travel Experiences!
             From music festivals to cultural fests — Travello plans it all so you can just live the moment.
            </p>
          </div>

          {/* Center Section: Quick Links */}
         

          {/* Right Section: Social Media Links (Names Only) */}
          
        </div>

        {/* Additional Footer Sections */}
        <div className="flex flex-col md:flex-row justify-between mt-12 space-y-8 md:space-y-0">
          {/* Contact Info */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h3 className="text-xl font-semibold text-white">Contact Us</h3>
            <p className="text-sm text-gray-300">Email: <a href="/contact" className="hover:text-stone-400">neerajyadavrewa@gmail.com</a></p>
            <p className="text-sm text-gray-300">Phone: <a href="/contact" className="hover:text-stone-400">+91-8770223682</a></p>
            <p className="text-sm text-gray-300">Location: REWA MP </p>
          </div>

          {/* Partners & Sponsors Section */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h3 className="text-xl font-semibold text-white">Social Media</h3>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="social-link hover:text-blue-500 transition-all duration-300">
              Facebook
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link hover:text-blue-400 transition-all duration-300">
              Twitter
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link hover:text-blue-700 transition-all duration-300">
              LinkedIn
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link hover:text-pink-500 transition-all duration-300">
              Instagram
            </a>
            </div>
          {/* Sitemap / Additional Links */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h3 className="text-xl font-semibold text-white">Quick Links</h3>
            <Link href="/about">
              <span className="footer-link hover:text-stone-400 transition-all duration-300">About</span>
            </Link>
            <Link href="/contact">
              <span className="footer-link hover:text-stone-400 transition-all duration-300">Contact us</span>
            </Link>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="mt-12 text-center text-md text-gray-300">
          <p>Built with ❤️ by Neeraj </p>
          <p>&copy;2025 Travello. All rights reserved.</p>
        </div>
      </div>
     
    </footer>
  
  );
};

export default Footer;
