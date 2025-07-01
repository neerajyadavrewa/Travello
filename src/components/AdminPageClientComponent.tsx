"use client";

import React, { useEffect, useState } from "react";

type User = {
  _id: string;
  name: string;
  email: string;
  creatorRequestStatus: string;
  role: string;
};

type TripPlan = {
  _id: string;
  title: string;
  creator: string;
  price: string;
  duration: string;
  images: string[];
  videos: string[];
  status: string;
};

export default function AdminPageClientComponent() {
  const [creatorRequests, setCreatorRequests] = useState<User[]>([]);
  const [tripPlans, setTripPlans] = useState<TripPlan[]>([]);
  const [loadingCreators, setLoadingCreators] = useState(true);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch creator requests
  async function fetchCreatorRequests() {
    try {
      setLoadingCreators(true);
      const res = await fetch("/api/admin/creator-requests");
      if (!res.ok) throw new Error("Failed to fetch creator requests");
      const data = await res.json();
      setCreatorRequests(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoadingCreators(false);
    }
  }

  // Fetch trip plans
  async function fetchTripPlans() {
    try {
      setLoadingPlans(true);
      const res = await fetch("/api/admin/trip-plans");
      if (!res.ok) throw new Error("Failed to fetch trip plans");
      const data = await res.json();
      setTripPlans(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoadingPlans(false);
    }
  }

  useEffect(() => {
    fetchCreatorRequests();
    fetchTripPlans();
  }, []);

  // Approve or Reject creator request
  async function updateCreatorStatus(userId: string, status: "approved" | "rejected") {
    try {
      const res = await fetch(`/api/admin/creator-status/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update creator status");
      // Refresh the list after update
      fetchCreatorRequests();
    } catch (err) {
      alert((err as Error).message);
    }
  }

  // Approve or Reject trip plan
  async function updateTripPlanStatus(planId: string, status: "approved" | "rejected") {
    try {
      const res = await fetch(`/api/admin/trip-plan-status/${planId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update trip plan status");
      // Refresh trip plans after update
      fetchTripPlans();
    } catch (err) {
      alert((err as Error).message);
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      {/* Creator Requests Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Creator Requests</h2>
        {loadingCreators ? (
          <p>Loading creator requests...</p>
        ) : creatorRequests.length === 0 ? (
          <p>No pending creator requests.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {creatorRequests.map((user) => (
              <div key={user._id} className="border p-4 rounded shadow bg-white">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Status:</strong> {user.creatorRequestStatus}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => updateCreatorStatus(user._id, "approved")}
                    className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateCreatorStatus(user._id, "rejected")}
                    className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Trip Plans Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Pending Trip Plans</h2>
        {loadingPlans ? (
          <p>Loading trip plans...</p>
        ) : tripPlans.length === 0 ? (
          <p>No pending trip plans.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tripPlans.map((plan) => (
              <div key={plan._id} className="border p-4 rounded shadow bg-white">
                <h3 className="font-bold text-lg mb-2">{plan.title}</h3>
                <p><strong>Creator ID:</strong> {plan.creator}</p>
                <p><strong>Price:</strong> {plan.price}</p>
                <p><strong>Duration:</strong> {plan.duration}</p>
                <div className="mt-2">
                  {plan.images.length > 0 && (
                    <img
                      src={plan.images[0]}
                      alt={plan.title}
                      className="w-full h-40 object-cover rounded"
                    />
                  )}
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => updateTripPlanStatus(plan._id, "approved")}
                    className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateTripPlanStatus(plan._id, "rejected")}
                    className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {error && (
        <div className="mt-6 text-red-600 font-semibold">
          Error: {error}
        </div>
      )}
    </div>
  );
}
