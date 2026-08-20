import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true }
}, { timestamps: true });

const hotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    amenities: {
        isAC: { type: Boolean, default: false },
        isFan: { type: Boolean, default: true },
        hasBalcony: { type: Boolean, default: false },
        hasWiFi: { type: Boolean, default: false },
        hasPool: { type: Boolean, default: false },
        hasGym: { type: Boolean, default: false },
        hasSpa: { type: Boolean, default: false },
        hasParking: { type: Boolean, default: false },
        hasRestaurant: { type: Boolean, default: false }
    },
    pricePerNight: { type: Number, required: true, default: 5000 },
    photos: [{ type: String }],
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reviews: [reviewSchema]
}, { timestamps: true });

export default mongoose.model("Hotel", hotelSchema);
