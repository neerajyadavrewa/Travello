import mongoose, { Schema, Document } from 'mongoose';

export interface ITripPlan extends Document {
  title: string;
  description: string;
  location: string;
  creator: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  price: string;
  duration: string;
  images: string[];
  videos: string[];
}
const TripPlanSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: String, required: true },
    duration: { type: String, required: true },
    images: [{ type: String }],
    videos: [{ type: String }],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastEntryDate: { type: Date, required: true }, // <-- NEW
  },
  { timestamps: true }
);


export default mongoose.models.TripPlan ||
  mongoose.model<ITripPlan>('TripPlan', TripPlanSchema);
