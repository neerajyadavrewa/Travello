'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      setLoading(true);
      setTimeout(() => {
        router.push('/');
      }, 1000);
    }
  }, [status, router]);

  return (
    <div className="relative flex w-full min-h-screen bg-black justify-center items-center overflow-hidden px-4">
      {/* Background Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none animate-pulse bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:20px_20px] opacity-20" />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(168,85,247,0.4)' }}
        className="relative z-10 bg-white/5 backdrop-blur-md border border-purple-500 rounded-2xl shadow-lg p-8 md:p-10 w-full max-w-sm md:max-w-md text-center transition-all duration-300"
      >
        {/* Branding */}
        <div className="mb-6">
          <h1 className="text-white text-3xl font-bold">Welcome Back</h1>
          <p className="text-gray-400 mt-2">Sign in to come inside the Travello</p>
        </div>

        {/* Sign-in Button */}
        <button
          onClick={() => {
            setLoading(true);
            signIn('google');
          }}
          className="bg-purple-200 text-black flex items-center justify-center gap-3 px-6 py-3 rounded-md hover:bg-gray-100 transition-all w-full font-semibold"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 533.5 544.3"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.3H272v95.3h147.4c-6.4 34.4-25.2 63.5-53.8 83v68h86.8c50.8-46.8 80.1-115.7 80.1-196z"
              fill="#4285f4"
            />
            <path
              d="M272 544.3c72.6 0 133.5-24 178-65.1l-86.8-68c-24.1 16.2-55 25.8-91.2 25.8-70 0-129.3-47.2-150.5-110.4H34.5v69.5c44.4 87.8 135.2 148.2 237.5 148.2z"
              fill="#34a853"
            />
            <path
              d="M121.5 326.6c-10.2-30.1-10.2-62.5 0-92.6V164.5H34.5c-36.4 72.8-36.4 159.6 0 232.4l87-70.3z"
              fill="#fbbc04"
            />
            <path
              d="M272 107.7c39.6-.6 77.4 14 106.4 40.7l79.4-79.4C412.2 25.2 343.4-2.7 272 0 169.7 0 78.9 60.4 34.5 148.2l87 70.3C142.7 154.9 202 107.7 272 107.7z"
              fill="#ea4335"
            />
          </svg>
          Sign in with Google
        </button>

        {/* Note */}
        <p className="text-gray-500 text-sm mt-6">
          Don’t have an account? One will be created automatically.
        </p>

        {/* Loading Spinner */}
        {loading && (
          <div className="mt-6 flex justify-center items-center">
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
