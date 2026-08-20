import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Star, ArrowLeft, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const HotelDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [hotel, setHotel] = useState(null);
    const [currentImage, setCurrentImage] = useState(0);
    const [review, setReview] = useState({ rating: 5, comment: "" });
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [bookedDates, setBookedDates] = useState([]);

    const fetchHotel = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/hotels/${id}`);
            setHotel(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchBookedDates = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/bookings/hotel/${id}`);
            const dates = [];
            res.data.forEach(booking => {
                let current = new Date(booking.checkIn);
                const end = new Date(booking.checkOut);
                while (current <= end) {
                    dates.push(new Date(current));
                    current.setDate(current.getDate() + 1);
                }
            });
            setBookedDates(dates);
        } catch (err) {
            console.error("Failed to fetch booked dates", err);
        }
    };

    useEffect(() => {
        fetchHotel();
        fetchBookedDates();
    }, [id]);

    const getImageUrl = (path) => {
        const cleanPath = path.replace(/\\/g, '/');
        return `http://localhost:8000/${cleanPath}`;
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:8000/api/hotels/${id}/reviews`, review, { withCredentials: true });
            setReview({ rating: 5, comment: "" });
            setError(null);
            fetchHotel(); // Refresh to show new review
        } catch (err) {
            setError(err.response?.data || "Failed to submit review");
        }
    };

    const nextImage = () => {
        if (hotel && hotel.photos) {
            setCurrentImage((prev) => (prev === hotel.photos.length - 1 ? 0 : prev + 1));
        }
    };

    const prevImage = () => {
        if (hotel && hotel.photos) {
            setCurrentImage((prev) => (prev === 0 ? hotel.photos.length - 1 : prev - 1));
        }
    };

    const handleReserve = async () => {
        if (!startDate || !endDate) return alert("Please select dates first.");
        if (startDate.getTime() === endDate.getTime()) return alert("Check-out must be after check-in.");
        
        try {
            // 1. Check double booking FIRST
            await axios.post("http://localhost:8000/api/bookings/check-availability", {
                hotel: id, checkIn: startDate, checkOut: endDate
            }, { withCredentials: true });

            // 2. If available, proceed to Stripe Checkout
            const res = await axios.post("http://localhost:8000/api/bookings/create-checkout-session", {
                hotel: id,
                name: hotel.name,
                checkIn: startDate,
                checkOut: endDate,
                totalPrice
            }, { withCredentials: true });
            
            // 3. Redirect to Stripe
            window.location.href = res.data.url;
        } catch (err) {
            alert(err.response?.data || "Failed to book. Dates might be unavailable.");
        }
    };

    if (!hotel) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>LOADING...</div>;

    const avgRating = hotel.reviews && hotel.reviews.length > 0 
        ? (hotel.reviews.reduce((a,b)=>a+b.rating,0)/hotel.reviews.length).toFixed(1) 
        : null;

    let nights = 0;
    if (startDate && endDate) {
        const diffTime = Math.abs(endDate - startDate);
        nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    const totalPrice = nights * (hotel.pricePerNight || 5000);

    return (
        <div>
            <Navbar />
            <div className="container section-padding" style={{ paddingTop: '10rem' }}>
                <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '3rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <ArrowLeft size={16} /> Back to Collection
                </Link>
                
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <h1 className="huge-title" style={{ marginBottom: '1rem' }}>{hotel.name}</h1>
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '4rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.9rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} /> {hotel.location}</span>
                        {avgRating && <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)' }}><Star fill="currentColor" size={16} /> {avgRating} RATING</span>}
                    </div>
                </motion.div>

                {/* Interactive Image Slider */}
                {hotel.photos && hotel.photos.length > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1 }} style={{ position: 'relative', width: '100%', height: '65vh', minHeight: '400px', marginBottom: '4rem', backgroundColor: 'var(--card-bg)' }}>
                        <AnimatePresence>
                            <motion.img 
                                key={currentImage}
                                src={getImageUrl(hotel.photos[currentImage])} 
                                alt={`Gallery ${currentImage}`} 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6, ease: "easeInOut" }}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} 
                            />
                        </AnimatePresence>
                        
                        {hotel.photos.length > 1 && (
                            <>
                                <button onClick={prevImage} style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.4)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'background 0.3s' }} onMouseOver={(e) => e.currentTarget.style.background = 'var(--accent)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.4)'}>
                                    <ChevronLeft size={36} />
                                </button>
                                <button onClick={nextImage} style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.4)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'background 0.3s' }} onMouseOver={(e) => e.currentTarget.style.background = 'var(--accent)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.4)'}>
                                    <ChevronRight size={36} />
                                </button>
                                <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.75rem', background: 'rgba(0,0,0,0.4)', padding: '0.75rem 1.25rem', borderRadius: '100px', backdropFilter: 'blur(8px)' }}>
                                    {hotel.photos.map((_, i) => (
                                        <div key={i} onClick={() => setCurrentImage(i)} style={{ width: '12px', height: '12px', borderRadius: '50%', background: currentImage === i ? 'var(--accent)' : 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.3s', transform: currentImage === i ? 'scale(1.2)' : 'scale(1)' }} />
                                    ))}
                                </div>
                            </>
                        )}
                    </motion.div>
                )}

                <div className="grid-2">
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '2rem', textTransform: 'uppercase' }}>About Space</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '3rem' }}>{hotel.description}</p>
                        
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '2rem', textTransform: 'uppercase' }}>Amenities</h3>
                        <div className="amenities-tags" style={{ gap: '1rem' }}>
                            {hotel.amenities?.isAC && <span className="tag" style={{ padding: '0.75rem 1.5rem' }}>Air Conditioning</span>}
                            {hotel.amenities?.isFan && <span className="tag" style={{ padding: '0.75rem 1.5rem' }}>Fan</span>}
                            {hotel.amenities?.hasBalcony && <span className="tag" style={{ padding: '0.75rem 1.5rem' }}>Balcony</span>}
                            {hotel.amenities?.hasWiFi && <span className="tag" style={{ padding: '0.75rem 1.5rem' }}>Free WiFi</span>}
                            {hotel.amenities?.hasPool && <span className="tag" style={{ padding: '0.75rem 1.5rem' }}>Swimming Pool</span>}
                            {hotel.amenities?.hasGym && <span className="tag" style={{ padding: '0.75rem 1.5rem' }}>Fitness Gym</span>}
                            {hotel.amenities?.hasSpa && <span className="tag" style={{ padding: '0.75rem 1.5rem' }}>Spa & Wellness</span>}
                            {hotel.amenities?.hasParking && <span className="tag" style={{ padding: '0.75rem 1.5rem' }}>Secure Parking</span>}
                            {hotel.amenities?.hasRestaurant && <span className="tag" style={{ padding: '0.75rem 1.5rem' }}>Fine Restaurant</span>}
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                        <div style={{ background: 'var(--card-bg)', padding: '3rem', border: '1px solid var(--border-color)', position: 'sticky', top: '120px' }}>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Reserve</h3>
                            <p style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2rem', color: 'var(--accent)' }}>₹{hotel.pricePerNight || 5000} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 400 }}>/ night</span></p>

                            <div style={{ marginBottom: '2rem' }}>
                                <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}><CalendarIcon size={14} style={{ display: 'inline', marginRight: '0.25rem' }}/> Select Dates</label>
                                <div style={{ width: '100%' }} className="date-picker-wrapper">
                                    <DatePicker
                                        selectsRange={true}
                                        startDate={startDate}
                                        endDate={endDate}
                                        onChange={(update) => setDateRange(update)}
                                        excludeDates={bookedDates}
                                        minDate={new Date()}
                                        placeholderText="Check-in → Check-out"
                                        className="form-control"
                                        dateFormat="MMM d, yyyy"
                                        withPortal
                                    />
                                </div>
                            </div>

                            {startDate && endDate && (
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }} className="animate-fade-in">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span>₹{hotel.pricePerNight || 5000} x {nights} nights</span>
                                        <span>₹{totalPrice}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, paddingTop: '1rem', borderTop: '1px solid var(--border-color)', marginTop: '0.5rem' }}>
                                        <span>Total</span>
                                        <span style={{ color: 'var(--accent)' }}>₹{totalPrice}</span>
                                    </div>
                                </div>
                            )}

                            {user ? (
                                <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleReserve} disabled={!startDate || !endDate}>
                                    {startDate && endDate ? "Confirm Booking" : "Select Dates"}
                                </button>
                            ) : (
                                <Link to="/login" className="btn btn-outline" style={{ display: 'block', textAlign: 'center', width: '100%' }}>Login to Reserve</Link>
                            )}

                            <div style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid var(--border-color)' }}>
                                <h4 style={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Manager Contact</h4>
                                <p style={{ fontSize: '1.2rem' }}>{hotel.managerId?.name || 'Unknown'}</p>
                                <p style={{ color: 'var(--text-secondary)' }}>{hotel.managerId?.email || 'Unknown'}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Reviews Section */}
                <div style={{ marginTop: '8rem', paddingTop: '4rem', borderTop: '1px solid var(--border-color)' }}>
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid-2">
                        <div>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', marginBottom: '2rem', textTransform: 'uppercase' }}>Guest Reviews</h2>
                            {hotel.reviews && hotel.reviews.length > 0 ? (
                                hotel.reviews.map(r => (
                                    <div key={r._id} className="review-card">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                            <strong style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>{r.name}</strong>
                                            <div style={{ display: 'flex', color: 'var(--accent)' }}>
                                                {[...Array(r.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                            </div>
                                        </div>
                                        <p style={{ color: 'var(--text-secondary)' }}>"{r.comment}"</p>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: 'var(--text-secondary)' }}>No reviews yet. Be the first to leave one.</p>
                            )}
                        </div>

                        <div>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '2rem', textTransform: 'uppercase' }}>Leave a Review</h2>
                            {user ? (
                                <form onSubmit={handleReviewSubmit} style={{ background: 'var(--card-bg)', padding: '3rem', border: '1px solid var(--border-color)' }}>
                                    {error && <div style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}
                                    <div className="form-group">
                                        <label className="form-label">Rating (1-5)</label>
                                        <input type="number" min="1" max="5" value={review.rating} onChange={(e) => setReview({...review, rating: e.target.value})} className="form-control" required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Comment</label>
                                        <textarea value={review.comment} onChange={(e) => setReview({...review, comment: e.target.value})} className="form-control" rows="4" required></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Submit Review</button>
                                </form>
                            ) : (
                                <div style={{ background: 'var(--card-bg)', padding: '3rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>You must be logged in to leave a review.</p>
                                    <Link to="/login" className="btn btn-outline">Login Now</Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default HotelDetails;
