// /app/api/creator/bookings-summary/route.ts

import { connectDB } from "@/lib/db";
import Booking from "../../../../../models/Booking";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"; // If using NextAuth
import { authOptions } from "@/lib/auth"; // Your auth config

export async function GET() {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const creatorId = session.user.id;

  try {
    const result = await Booking.aggregate([
      { $match: { creatorId: new mongoose.Types.ObjectId(creatorId) } },
      {
        $group: {
          _id: "$packageId",
          packageTitle: { $first: "$packageTitle" },
          totalBookings: { $sum: 1 },
          totalTravelers: { $sum: "$travelers" }
        }
      }
    ]);

    return NextResponse.json({ data: result });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
