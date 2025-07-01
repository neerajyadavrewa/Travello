// /app/api/admin/creator-requests/route.ts
import { connectDB } from '@/lib/db';
import { User } from '../../../../../models/User';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';



export async function GET() {
  await connectDB();
  try {
    const pendingCreators = await User.find({ creatorRequestStatus: 'pending' });
    return NextResponse.json(pendingCreators);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
  }
}
export async function POST(req: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { bio, instagram = '', youtube = '', profilePic } = body;

  if (!bio || !profilePic) {
    return NextResponse.json({ error: 'Bio and image URL are required' }, { status: 400 });
  }

  try {
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.creatorRequestStatus && user.creatorRequestStatus !== 'none') {
      return NextResponse.json(
        { error: 'You have already applied or are already a creator.' },
        { status: 400 }
      );
    }

    user.bio = bio;
    user.image = profilePic; // ✅ from frontend Cloudinary upload
    user.socialLinks = {
      ...(user.socialLinks || {}),
      instagram,
      youtube,
    };
    user.creatorRequestStatus = 'pending';

    await user.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error saving user:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
