"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import ColourfulText from "./colourful-text";
const words = `Travello`;

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();

  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      let direction = current! - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() < 0.05) {
        setVisible(false);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "w-full bg-gray-950 text-stone-500 py-4 px-8 flex items-center justify-between shadow-lg border-b border-gray-700 fixed top-0 left-0 right-0 z-50", // Fixed positioning at the top
          className
        )}
      >
        {/* Left side - Logo */}
        <div className="flex items-center space-x-4">
           <span className="block text-3xl sm:text-5xl font-bold  "><ColourfulText text={words} /></span>
        </div>

        {/* Right side - Navigation items */}
        <div className="flex space-x-8 ml-auto">
          {navItems.map((navItem: any, idx: number) => (
            <Link
              key={`link=${idx}`}
              href={navItem.link}
              className={cn(
                "relative text-lg hover:text-purple-400 transition duration-300 ease-in-out", // Enhanced hover effect
                "dark:text-neutral-50 dark:hover:text-neutral-300 text-neutral-200"
              )}
            >
              <span className="block sm:hidden">{navItem.icon}</span>
              <span className="hidden sm:block">{navItem.name}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
