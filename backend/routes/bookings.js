import express from "express";
import Booking from "../models/Booking.js";
import { verifyToken, verifyRole } from "../middleware/auth.js";
import Stripe from "stripe";

const router = express.Router();

// CREATE BOOKING (Called after successful payment)
router.post("/", verifyToken, async (req, res) => {
    try {
        const { hotel, checkIn, checkOut, totalPrice } = req.body;
        
        // Check for double booking (dates overlap)
        const overlappingBookings = await Booking.find({
            hotel,
            status: { $ne: "cancelled" },
            $or: [
                { 
                    checkIn: { $lt: new Date(checkOut) }, 
                    checkOut: { $gt: new Date(checkIn) } 
                }
            ]
        });

        if (overlappingBookings.length > 0) {
            return res.status(400).json("These dates are already booked.");
        }

        const newBooking = new Booking({
            hotel,
            user: req.user.id,
            checkIn,
            checkOut,
            totalPrice
        });

        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking);
    } catch (err) {
        res.status(500).json(err);
    }
});

// CHECK AVAILABILITY
router.post("/check-availability", verifyToken, async (req, res) => {
    try {
        const { hotel, checkIn, checkOut } = req.body;
        const overlappingBookings = await Booking.find({
            hotel,
            status: { $ne: "cancelled" },
            $or: [
                { checkIn: { $lt: new Date(checkOut) }, checkOut: { $gt: new Date(checkIn) } }
            ]
        });
        if (overlappingBookings.length > 0) return res.status(400).json("These dates are already booked.");
        res.status(200).json("Available");
    } catch (err) {
        res.status(500).json(err);
    }
});

// CREATE STRIPE CHECKOUT SESSION
router.post("/create-checkout-session", verifyToken, async (req, res) => {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_51O1...replace_with_real_key");
        const { hotel, name, checkIn, checkOut, totalPrice } = req.body;
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: `Stay at ${name}`,
                            description: `${new Date(checkIn).toLocaleDateString()} to ${new Date(checkOut).toLocaleDateString()}`
                        },
                        unit_amount: totalPrice * 100, // Stripe expects paise
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${req.headers.origin}/success?hotel_id=${hotel}&checkIn=${checkIn}&checkOut=${checkOut}&totalPrice=${totalPrice}`,
            cancel_url: `${req.headers.origin}/hotel/${hotel}`,
        });

        res.status(200).json({ url: session.url });
    } catch (err) {
        res.status(500).json(err.message);
    }
});

// GET BOOKINGS FOR A HOTEL (Public, to disable dates on frontend calendar)
router.get("/hotel/:hotelId", async (req, res) => {
    try {
        const bookings = await Booking.find({ hotel: req.params.hotelId, status: { $ne: "cancelled" } }).select("checkIn checkOut");
        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET BOOKINGS FOR LOGGED IN USER
router.get("/user", verifyToken, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id }).populate("hotel", "name location photos");
        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET ALL BOOKINGS (Manager/Admin only)
router.get("/all", verifyRole(["manager", "admin"]), async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("hotel", "name location")
            .populate("user", "name email");
        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json(err);
    }
});

export default router;
