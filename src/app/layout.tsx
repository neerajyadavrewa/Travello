import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";
import ColourfulText from "@/components/ui/colourful-text";
import { useSession } from "next-auth/react";
import SessionWrapper from '@/components/SessionWrapper';
import StaticNavbar from "../components/StaticNavbar/StaticNavbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Travello",
  description: " A platform to redefine the travel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionWrapper>
          <Navbar />
          <StaticNavbar />

        {children}
        </SessionWrapper>
      </body>
    </html>
  );
}
