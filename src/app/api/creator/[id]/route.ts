import { connectDB } from "@/lib/db";
import { User } from "../../../../../models/User";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const creator = await User.findById(params.id).populate("packages");

    if (!creator || creator.role !== "creator") {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }

    return NextResponse.json(creator);
  } catch (error) {
    console.error("Error fetching creator:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const body = await req.json();
    const updatedCreator = await User.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    );

    if (!updatedCreator) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }

    return NextResponse.json(updatedCreator);
  } catch (error) {
    console.error("Error updating creator:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}