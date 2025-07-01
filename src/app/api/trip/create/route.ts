
import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import TripPlan from "../../../../../models/TripPlan";
import { User } from "../../../../../models/User";

export async function POST(req: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findOne({ email: session.user.email });

  if (!user || user.role !== "creator") {
    return NextResponse.json({ error: "Only creators can submit trips" }, { status: 403 });
  }

  const body = await req.json();
  const { title, description, price, duration, location, images, videos, lastEntryDate } = body;

  if (!title || !description || !price || !duration || !location || !lastEntryDate) {
    return NextResponse.json({ error: "All required fields must be filled" }, { status: 400 });
  }

  const newTrip = new TripPlan({
    title,
    description,
    price,
    duration,
    location,
    images,
    videos,
    creator: user._id,
    status: "pending",
    lastEntryDate,
  });

  await newTrip.save();
    await User.findByIdAndUpdate(user._id, {
    $addToSet: { packages: newTrip._id }, // prevents duplicates
  });

  return NextResponse.json({ success: true, message: "Trip submitted successfully" });
}
