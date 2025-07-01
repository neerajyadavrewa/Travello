import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import TripPlan from "../../../../../models/TripPlan";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectDB();

  const trip = await TripPlan.findById(params.id)
    .populate("creator", "name") // <-- Populate name from User
    .select("title price creator");

  if (!trip) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  return NextResponse.json({
    title: trip.title,
    price: trip.price,
    creatorName: trip.creator?.name || "Unknown",
  });
}
