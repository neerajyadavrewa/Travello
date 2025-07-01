import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import TripPlan from "../../../../../models/TripPlan";

export async function GET(req: NextRequest, context: any) {
  await connectDB();
  const id = context?.params?.id;

  const trip = await TripPlan.findById(id)
    .populate("creator", "name") // Populate name from User
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
