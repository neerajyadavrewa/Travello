// app/api/bookings/my/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // adjust import path accordingly
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Booking from "../../../../../models/Booking";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const userEmail = session.user?.email;

  const bookings = await Booking.find({ userEmail }).sort({ createdAt: -1 });

  return NextResponse.json(bookings);
}
