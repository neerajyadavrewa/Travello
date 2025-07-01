// src/app/api/admin/trip-plan-status/[id]/route.ts
import { connectDB } from '@/lib/db';
import TripPlan from '../../../../../../models/TripPlan'; // use alias if configured, otherwise keep your original relative path
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  req: NextRequest,
  context: any
) {
  const { id } = context.params;
  await connectDB();

  try {
    const { status } = await req.json();

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updatedPlan = await TripPlan.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedPlan) {
      return NextResponse.json({ error: "Trip plan not found" }, { status: 404 });
    }

    return NextResponse.json(updatedPlan);
  } catch (error) {
    console.error("Trip plan update error:", error);
    return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 });
  }
}
