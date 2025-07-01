import { connectDB } from "@/lib/db";
import { User } from "../../../../../models/User";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  try {
    const creators = await User.find({ role: "creator" }).select("name image bio _id");
    return NextResponse.json(creators);
  } catch (error) {
    console.error("Error fetching creators:", error);
    return NextResponse.json({ error: "Failed to load creators" }, { status: 500 });
  }
}
