import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Booking from "../../../../models/Booking";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
     const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userEmail = session.user?.email;
  const userName = session.user?.name || "User";

  await connectDB();

  const {
    userPhone,
    travelers,
    packageId,
    packageTitle,
    creatorName,
    paymentId,
    orderId,
    amount,
  } = await req.json();

  const booking = new Booking({
    userName,
    userEmail,
    userPhone,
    travelers,
    packageId,
    packageTitle,
    creatorName,
    paymentId,
    orderId,
    amount,
    status: "paid",
    createdAt: new Date(),
  });

  try {
    await booking.save();
    return NextResponse.json({ message: "Booking saved successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to save booking" }, { status: 500 });
  }
}




