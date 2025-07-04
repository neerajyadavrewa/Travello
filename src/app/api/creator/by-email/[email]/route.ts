import { connectDB } from "@/lib/db";
import { User } from "../../../../../../models/User"; // Optional: use @ shortcut if configured
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: { email: string } }
) {
  const { email } = context.params;

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  await connectDB();

  const user = await User.findOne({ email }).select("-password");
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}
