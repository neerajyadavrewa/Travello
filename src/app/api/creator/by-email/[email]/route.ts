// /api/creator/by-email/[email]/route.ts
import { connectDB } from "@/lib/db";
import { User } from "../../../../../../models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { email: string } }) {
  const { email } = params;
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  await connectDB();

  const user = await User.findOne({ email }).select("-password"); // exclude sensitive fields
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}
