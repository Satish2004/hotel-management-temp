import { useEffect, useState } from "react";
import axios from "axios";
import { format, differenceInDays } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, CreditCard, MapPin, CheckCircle, Clock, Plane, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const MyTrips = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/bookings/user", { withCredentials: true });
                setBookings(res.data);
            } catch (err) {
                console.error("Failed to fetch bookings");
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const getImageUrl = (path) => {
        if (!path) return "";
        let cleanPath = path.replace(/\\/g, '/');
        if (!cleanPath.startsWith('/')) {
            cleanPath = '/' + cleanPath;
        }
        return `http://localhost:8000${cleanPath}`;
    };

    if (loading) return <div className="page-container"><h1 className="huge-title">Loading your trips...</h1></div>;

    return (
        <div className="page-container" style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--bg-color)' }}>
            <div className="container">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <button 
                        onClick={() => navigate(-1)} 
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-card)', color: 'var(--text-primary)', padding: '0.6rem 1.2rem', border: '1px solid var(--border-color)', borderRadius: '30px', marginBottom: '2rem', cursor: 'pointer', fontWeight: 'bold', boxShadow: 'var(--shadow-sm)', transition: 'all 0.3s' }} 
                        onMouseOver={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'var(--accent)'; }} 
                        onMouseOut={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ marginBottom: "3rem", display: 'flex', alignItems: 'center', gap: '1rem' }}
                >
                    <div style={{ padding: '1rem', background: 'rgba(234, 179, 8, 0.1)', borderRadius: '50%' }}>
                        <Plane size={32} color="var(--accent)" />
                    </div>
                    <div>
                        <h1 className="huge-title" style={{ margin: 0 }}>My Trips</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '0.2rem' }}>Manage your upcoming and past adventures.</p>
                    </div>
                </motion.div>

                {bookings.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ textAlign: 'center', padding: '5rem 2rem', background: 'var(--bg-card)', borderRadius: '24px', border: '1px dashed var(--border-color)' }}
                    >
                        <Plane size={64} color="var(--text-light)" style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
                        <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>No trips booked yet</h2>
                        <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", marginBottom: "2rem", maxWidth: '500px', margin: '0 auto 2rem auto' }}>
                            It looks like you haven't reserved any properties. Your next great adventure is just a click away.
                        </p>
                        <Link to="/hotels" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>Explore Collection</Link>
                    </motion.div>
                ) : (
                    <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))" }}>
                        {bookings.map((booking, index) => {
                            const nights = differenceInDays(new Date(booking.checkOut), new Date(booking.checkIn));
                            return (
                                <motion.div 
                                    key={booking._id} 
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    whileHover={{ y: -8, boxShadow: "var(--shadow-lg)" }}
                                    style={{ 
                                        border: "1px solid var(--border-color)", 
                                        borderRadius: "20px", 
                                        background: "var(--bg-card)", 
                                        overflow: "hidden",
                                        boxShadow: "var(--shadow-sm)",
                                        display: "flex",
                                        flexDirection: "column",
                                        transition: "all 0.3s ease"
                                    }}
                                >
                                    {/* Image Header */}
                                    <div style={{ height: "220px", position: "relative", backgroundColor: "var(--border-color)" }}>
                                        {booking.hotel && booking.hotel.photos && booking.hotel.photos.length > 0 ? (
                                            <img src={getImageUrl(booking.hotel.photos[0])} alt="hotel" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        ) : (
                                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-light)" }}>No Image</div>
                                        )}
                                        <div style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)", color: "white", padding: "0.5rem 1rem", borderRadius: "30px", fontSize: "0.85rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.4rem", border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <CheckCircle size={14} color="#00c853" /> Confirmed
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div style={{ padding: "1.8rem", flex: 1, display: "flex", flexDirection: "column" }}>
                                        <h2 style={{ fontSize: "1.6rem", marginBottom: "0.5rem", color: "var(--text-primary)", fontFamily: "var(--font-display)", lineHeight: 1.2 }}>{booking.hotel?.name || "Deleted Property"}</h2>
                                        
                                        {booking.hotel?.city && (
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-secondary)", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
                                                <MapPin size={16} />
                                                <span>{booking.hotel.city}</span>
                                            </div>
                                        )}

                                        <div style={{ background: "var(--bg-color)", padding: "1.2rem", borderRadius: "12px", marginBottom: "1.5rem", border: '1px solid var(--border-color)' }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
                                                <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Check-in</span>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-primary)", fontWeight: 500 }}>
                                                        <Calendar size={16} color="var(--accent)" />
                                                        <span>{format(new Date(booking.checkIn), "MMM dd, yyyy")}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.8rem 0' }}></div>
                                            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                                                <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Check-out</span>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-primary)", fontWeight: 500 }}>
                                                        <Calendar size={16} color="var(--accent)" />
                                                        <span>{format(new Date(booking.checkOut), "MMM dd, yyyy")}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ marginTop: "auto", borderTop: "2px dashed var(--border-color)", paddingTop: "1.5rem", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)", background: 'var(--bg-color)', padding: '0.5rem 1rem', borderRadius: '20px' }}>
                                                <Clock size={16} />
                                                <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{nights} {nights === 1 ? 'Night' : 'Nights'}</span>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--primary)", fontSize: "1.4rem", fontWeight: "bold", fontFamily: 'var(--font-display)' }}>
                                                <CreditCard size={20} color="var(--accent)" />
                                                <span>₹{booking.totalPrice}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyTrips;
