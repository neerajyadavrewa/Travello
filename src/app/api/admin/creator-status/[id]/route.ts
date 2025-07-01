// src/app/api/admin/creator-status/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '../../../../../../models/User'; // or use your relative path if alias doesn't work

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  await connectDB();

  try {
    const { status } = await req.json();

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
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
