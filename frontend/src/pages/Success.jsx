import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const Success = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("processing");
    const hasCalled = useRef(false);

    useEffect(() => {
        const createBooking = async () => {
            if (hasCalled.current) return;
            hasCalled.current = true;

            const hotel = searchParams.get("hotel_id");
            const checkIn = searchParams.get("checkIn");
            const checkOut = searchParams.get("checkOut");
            const totalPrice = searchParams.get("totalPrice");

            if (!hotel || !checkIn || !checkOut || !totalPrice) {
                setStatus("error");
                return;
            }

            try {
                await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/bookings`, {
                    hotel, checkIn, checkOut, totalPrice
                }, { withCredentials: true });
                setStatus("success");
            } catch (err) {
                setStatus("error");
            }
        };

        createBooking();
    }, [searchParams]);

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)', color: 'var(--text-primary)' }}>
            {status === "processing" && <h1 className="huge-title">Processing Payment...</h1>}
            {status === "error" && (
                <>
                    <h1 className="huge-title" style={{ color: 'red' }}>Payment Error</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>We couldn't confirm your booking. Please try again or contact support.</p>
                    <Link to="/" className="btn btn-outline" style={{ marginTop: '2rem' }}>Back to Home</Link>
                </>
            )}
            {status === "success" && (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center' }}>
                    <CheckCircle size={100} color="var(--accent)" style={{ margin: '0 auto 2rem' }} />
                    <h1 className="huge-title" style={{ marginBottom: '1rem' }}>Booking Confirmed!</h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem' }}>Your payment was successful and your luxury stay is secured.</p>
                    <Link to="/" className="btn btn-primary">Return to Collection</Link>
                </motion.div>
            )}
        </div>
    );
};

export default Success;
