"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams,useRouter } from "next/navigation";

export default function BookNow() {
  const searchParams = useSearchParams();
  const packageId = searchParams.get("packageId") || "";
  const router = useRouter();

  const [packageData, setPackageData] = useState<{
    title: string;
    creatorName: string;
    price: string;
  } | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    travelers: 1,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
  // Fetch logged-in user info
  fetch("/api/user")
    .then((res) => res.json())
    .then((user) => {
      setForm((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    })
    .catch(() => {
      console.error("Failed to fetch user info");
    });

  // Fetch package data
  if (packageId) {
    fetch(`/api/package/${packageId}`)
      .then((res) => res.json())
      .then((data) => setPackageData(data))
      .catch(() => setPackageData(null));
  }
}, [packageId]);


  const pricePerPerson = packageData ? Number(packageData.price) : 0;
  const totalAmount = pricePerPerson * Number(form.travelers);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isValidPhone = (phone: string) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handlePayment = async () => {
    if (!form.name || !form.email || !form.phone || !form.travelers) {
      alert("Please fill in all fields.");
      return;
    }

    if (!isValidPhone(form.phone)) {
      alert("Please enter a valid 10-digit Indian phone number.");
      return;
    }

    if (!packageData) {
      alert("Package data not loaded.");
      return;
    }

    setLoading(true);

    try {
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.orderId) {
        alert("Failed to create Razorpay order.");
        setLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: totalAmount * 100,
        currency: "INR",
        name: "Travel Startup",
        description: packageData.title,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          alert("Payment successful!");

          // Save booking
          await fetch("/api/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userName: form.name,
              userEmail: form.email,
              userPhone: form.phone,
              travelers: form.travelers,
              packageId,
              packageTitle: packageData.title,
              creatorName: packageData.creatorName,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              amount: totalAmount,
            }),
          });
          router.push("/my-bookings");
        },
        
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: "#8b5cf6",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white">
      <div className="max-w-md w-full bg-zinc-900 p-8 rounded-xl shadow-2xl border border-purple-600/20">
        <h2 className="text-3xl font-bold mb-6 text-purple-400">Book Your Trip</h2>

        {packageData ? (
          <div className="mb-6 space-y-1 text-sm text-gray-400">
            <p><span className="text-purple-300 font-semibold">Package:</span> {packageData.title}</p>
            <p><span className="text-purple-300 font-semibold">Creator:</span> {packageData.creatorName}</p>
            <p><span className="text-purple-300 font-semibold">Price Per Person:</span> ₹{pricePerPerson}</p>
          </div>
        ) : (
          <p className="text-gray-500">Loading package info...</p>
        )}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          disabled
          className="w-full p-3 mb-4 rounded text-white bg-zinc-800 border border-purple-600/40 cursor-not-allowed"
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          disabled
          className="w-full p-3 mb-4 rounded text-white bg-zinc-800 border border-purple-600/40 cursor-not-allowed"
         />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded text-black"
          maxLength={10}
        />
        <input
          type="number"
          name="travelers"
          placeholder="Number of Travelers"
          value={form.travelers}
          min={1}
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded text-black"
        />

        <p className="mb-4 text-purple-400 font-semibold">
          Total Amount: ₹{totalAmount}
        </p>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 py-3 text-lg font-bold rounded-lg shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02] transition-all"
        >
          {loading ? "Processing..." : "Pay & Book Now"}
        </button>
      </div>
    </div>
  );
}
