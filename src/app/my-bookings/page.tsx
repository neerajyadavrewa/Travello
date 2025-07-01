"use client";
import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaPhone,
  FaRupeeSign,
  FaRegCalendarAlt,
  FaTag,
} from "react-icons/fa";

interface BookingType {
  _id: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  travelers: number;
  packageId: string;
  packageTitle: string;
  creatorName: string;
  paymentId: string;
  orderId: string;
  amount: number;
  status: string;
  createdAt: string;
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch("/api/bookings/my");
        if (!res.ok) throw new Error("Unauthorized or error fetching");
        const data = await res.json();
        setBookings(data);
      } catch {
        setBookings([]);
      }
      setLoading(false);
    }
    fetchBookings();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-black text-purple-400 text-xl">
        Loading your bookings...
      </div>
    );

  if (bookings.length === 0)
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-black text-purple-400 text-xl">
        You have no bookings yet.
      </div>
    );

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-gray-900 to-black text-white px-4 py-12">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-purple-400 mb-10">
        My Bookings
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8 max-w-7xl mx-auto">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-gradient-to-tr from-[#2e1065] via-[#4c1d95] to-black border border-purple-700/40 rounded-3xl p-5 sm:p-6 md:p-7 shadow-2xl hover:shadow-purple-700/40 transition-all hover:scale-[1.03]"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-purple-300 mb-4">
              {booking.packageTitle}
            </h2>

            <div className="space-y-3 text-sm sm:text-base text-purple-200 leading-relaxed break-words">
              <p>
                <FaUser className="inline mr-2 text-purple-400" />
                <strong>Creator:</strong> {booking.creatorName}
              </p>

              <p>
                <FaRegCalendarAlt className="inline mr-2 text-purple-400" />
                <strong>Booked On:</strong>{" "}
                {new Date(booking.createdAt).toLocaleDateString()}
              </p>

              <p>
                <FaTag className="inline mr-2 text-purple-400" />
                <strong>Travelers:</strong> {booking.travelers}
              </p>

              <p>
                <FaRupeeSign className="inline mr-2 text-purple-400" />
                <strong>Amount Paid:</strong>{" "}
                <span className="text-green-300 font-semibold">
                  ₹{booking.amount}
                </span>
              </p>

              <p>
                <strong>Payment ID:</strong>{" "}
                <span className="text-purple-300 break-all">
                  {booking.paymentId}
                </span>
              </p>

              <p>
                <strong>Order ID:</strong>{" "}
                <span className="text-purple-300 break-all">
                  {booking.orderId}
                </span>
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                    booking.status === "confirmed"
                      ? "bg-green-600 text-white"
                      : booking.status === "cancelled"
                      ? "bg-red-600 text-white"
                      : "bg-yellow-400 text-black"
                  }`}
                >
                  {booking.status || "pending"}
                </span>
              </p>

              <p>
                <FaPhone className="inline mr-2 text-purple-400" />
                <strong>Contact:</strong>{" "}
                <span className="text-purple-100">
                  {booking.userName} ({booking.userPhone})
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
