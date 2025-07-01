import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    image: String,

    role: {
      type: String,
      default: 'user', // 'user', 'creator', 'admin'
    },

    creatorRequestStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'none'],
      default: 'none',
    },

    portfolio: String,
    bio: String,

    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    rating: { type: Number, default: 4.5 },

    socialLinks: {
      instagram: String,
      twitter: String,
      youtube: String,
      linkedin: String,
    },

    gallery: [String],

    reviews: [
      {
        name: String,
        rating: Number,
        comment: String,
      },
    ],

    packages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TripPlan' }],
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);
