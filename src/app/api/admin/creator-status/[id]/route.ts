// /app/api/admin/creator-status/[id]/route.ts
import { connectDB } from '@/lib/db';
import { User } from '../../../../../../models/User';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const userId = params.id;

  try {
    const { status } = await req.json();

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        creatorRequestStatus: status,
        role: status === 'approved' ? 'creator' : 'user',
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      creatorRequestStatus: updatedUser.creatorRequestStatus,
    });
  } catch (error) {
    console.error("Status update error:", error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
