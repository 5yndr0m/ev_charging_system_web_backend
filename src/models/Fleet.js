import mongoose from "mongoose";

const fleetSchema = new mongoose.Schema(
    {
        company: { type: String, required: true },
        contact: { type: String, required: true },
        email: { type: String, required: true },
        vehicles: { type: Number, default: 0 },
        activeVehicles: { type: Number, default: 0 },
        monthlySpend: { type: String, default: "LKR 0" },
        discount: { type: String, default: "0%" },
        status: { type: String, enum: ["Active", "Inactive", "Suspended"], default: "Active" },
        contract: { type: String, default: "Monthly" },
        billingAddress: { type: String },
        taxId: { type: String },
    },
    { timestamps: true }
);

const Fleet = mongoose.model("Fleet", fleetSchema);
export default Fleet;
