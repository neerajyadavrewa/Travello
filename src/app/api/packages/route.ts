import { NextResponse } from "next/server";
import TripPlan from "../../../../models/TripPlan";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();

    const packagesRaw = await TripPlan.find({
      status: "approved",
      lastEntryDate: { $gte: new Date() },
    })
      .populate("creator", "name image")
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
      creatorImage: pkg.creator?.image || "/default-avatar.jpg",
    }));

    return NextResponse.json(packages);
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 });
  }
}
