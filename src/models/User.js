import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    vehicles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
      },
    ],
    // Optional: save a single vehicle string for registration convenience
    vehicle: { type: String },
    notificationPreferences: {
      bookingConfirmed: { type: Boolean, default: true },
      bookingReminder: { type: Boolean, default: true },
      payment: { type: Boolean, default: true },
      peakHour: { type: Boolean, default: true },
      promotions: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
