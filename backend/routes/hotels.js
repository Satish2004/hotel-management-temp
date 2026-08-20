import express from "express";
import multer from "multer";
import Hotel from "../models/Hotel.js";
import User from "../models/User.js";
import { verifyRole, verifyToken } from "../middleware/auth.js";
import path from "path";

const router = express.Router();

// Multer config for local storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// CREATE HOTEL (Admin or Manager)
router.post("/", verifyRole(["admin", "manager"]), upload.array("photos", 5), async (req, res) => {
    try {
        const photoPaths = req.files.map(file => file.path);
        const { isAC, isFan, hasBalcony, hasWiFi, hasPool, hasGym, hasSpa, hasParking, hasRestaurant, name, description, location, pricePerNight } = req.body;
        
        let customAmenities = [];
        try {
            if (req.body.customAmenities) {
                customAmenities = JSON.parse(req.body.customAmenities);
            }
        } catch(e) {
            console.error("Failed to parse customAmenities", e);
        }
        const newHotel = new Hotel({
            name,
            description,
            location,
            pricePerNight: Number(pricePerNight) || 5000,
            amenities: {
                isAC: isAC === 'true',
                isFan: isFan === 'true',
                hasBalcony: hasBalcony === 'true',
                hasWiFi: hasWiFi === 'true',
                hasPool: hasPool === 'true',
                hasGym: hasGym === 'true',
                hasSpa: hasSpa === 'true',
                hasParking: hasParking === 'true',
                hasRestaurant: hasRestaurant === 'true'
            },
            photos: photoPaths,
            customAmenities,
            managerId: req.user.id
        });

        const savedHotel = await newHotel.save();
        res.status(201).json(savedHotel);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET ALL HOTELS (Public)
router.get("/", async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.status(200).json(hotels);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET SINGLE HOTEL
router.get("/:id", async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id).populate("managerId", "name email");
        res.status(200).json(hotel);
    } catch (err) {
        res.status(500).json(err);
    }
});

// UPDATE HOTEL
router.put("/:id", verifyRole(["admin", "manager"]), async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (req.user.role !== "admin" && hotel.managerId.toString() !== req.user.id) {
            return res.status(403).json("You are not allowed to update this hotel.");
        }
        
        let updateData = { ...req.body };
        try {
            if (req.body.customAmenities) {
                updateData.customAmenities = JSON.parse(req.body.customAmenities);
            }
        } catch(e) {
            console.error("Failed to parse customAmenities on update", e);
        }

        const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
        res.status(200).json(updatedHotel);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE HOTEL
router.delete("/:id", verifyRole(["admin", "manager"]), async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (req.user.role !== "admin" && hotel.managerId.toString() !== req.user.id) {
            return res.status(403).json("You are not allowed to delete this hotel.");
        }
        await Hotel.findByIdAndDelete(req.params.id);
        res.status(200).json("Hotel has been deleted.");
    } catch (err) {
        res.status(500).json(err);
    }
});

// ADD REVIEW
router.post("/:id/reviews", verifyToken, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) return res.status(404).json("Hotel not found");

        // Wait, Hotel model needs User model import? No, Hotel doesn't. 
        // But to get the name, we need User model. I will just import User at the top of hotels.js.
        // Actually, just changing `req.user.name` to `req.user.name || "Anonymous"` is what I did, but req.user.name doesn't exist.
        // Instead of fixing auth, I'll just change the import.

        const alreadyReviewed = hotel.reviews.find(r => r.user.toString() === req.user.id);
        if (alreadyReviewed) return res.status(400).json("You have already reviewed this property");

        const userObj = await User.findById(req.user.id);

        const review = {
            name: userObj ? userObj.name : "Anonymous",
            rating: Number(rating),
            comment,
            user: req.user.id
        };

        hotel.reviews.push(review);
        await hotel.save();

        res.status(201).json("Review added successfully");
    } catch (err) {
        res.status(500).json(err);
    }
});

export default router;
