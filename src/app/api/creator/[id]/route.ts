import { connectDB } from "@/lib/db";
import { User } from "../../../../../models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: any) {
  await connectDB();

  const id = context?.params?.id;

  try {
    const creator = await User.findById(id).populate("packages");

    if (!creator || creator.role !== "creator") {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }

    
    return NextResponse.json(creator);
  } catch (error) {
    console.error("Error fetching creator:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: any) {
  await connectDB();
  const id = context?.params?.id;

  try {
    const body = await req.json();
    const updatedCreator = await User.findByIdAndUpdate(id, body, { new: true });

    if (!updatedCreator) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }

    return NextResponse.json(updatedCreator);
  } catch (error) {
    console.error("Error updating creator:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}




