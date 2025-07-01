import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  userPhone: String,
  travelers: Number,
  packageId: String,
  packageTitle: String,
  creatorName: String,
  paymentId: String,
  orderId: String,
  amount: Number,
  status: String,
  creatorId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User", 
},
  createdAt: Date,
});

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
export default Booking;
