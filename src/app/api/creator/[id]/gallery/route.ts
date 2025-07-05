import { connectDB } from '@/lib/db';
import { User } from '../../../../../../models/User';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST handler
export async function POST(req: NextRequest, context: any) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = context?.params?.id;
  const { gallery } = await req.json();

  if (!Array.isArray(gallery)) {
    return NextResponse.json({ error: 'Invalid gallery data' }, { status: 400 });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.email !== session.user.email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    user.gallery = gallery;
    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gallery save error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE handler
export async function DELETE(req: NextRequest, context: any) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = context?.params?.id;
  const { imageUrl } = await req.json();

  if (!imageUrl) {
    return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.email !== session.user.email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Extract public_id from Cloudinary URL
    const urlParts = imageUrl.split('/');
    const uploadIndex = urlParts.findIndex((part:any) => part === 'upload');
    if (uploadIndex === -1) {
      return NextResponse.json({ error: 'Invalid image URL' }, { status: 400 });
    }
    const publicIdWithExt = urlParts.slice(uploadIndex + 1).join('/');
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, '');

    // Delete image from Cloudinary
    await cloudinary.v2.uploader.destroy(publicId);

    // Remove image URL from user's gallery array
    user.gallery = user.gallery.filter((img:any) => img !== imageUrl);
    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
