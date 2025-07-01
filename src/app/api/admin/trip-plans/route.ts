// /app/api/admin/trip-plans/route.ts
import { connectDB } from '@/lib/db';
import TripPlan from '../../../../../models/TripPlan';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectDB();
  try {
    const plans = await TripPlan.find({ status: 'pending' });
    return NextResponse.json(plans);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 });
  }
}
