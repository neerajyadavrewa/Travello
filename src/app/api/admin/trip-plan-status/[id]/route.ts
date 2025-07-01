// /app/api/admin/trip-plan-status/[id]/route.ts
import { connectDB } from '@/lib/db';
import TripPlan from '../../../../../../models/TripPlan';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const { status } = await req.json();
  const planId =  params.id;
   // "approved" or "rejected"

  try {
    const updatedPlan = await TripPlan.findByIdAndUpdate(
      planId,
      { status },
      { new: true }
    );
    return NextResponse.json(updatedPlan);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 });
  }
}
