import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { UserPlus, User, Mail, Key, Briefcase } from "lucide-react";

const Register = () => {
    const [info, setInfo] = useState({ name: "", email: "", password: "", role: "user" });
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setInfo(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/auth/register`, info);
            const loginRes = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/auth/login`, { email: info.email, password: info.password }, { withCredentials: true });
            setUser(loginRes.data.details);
            
            if (info.role === "admin" || info.role === "manager") {
                navigate("/dashboard");
            } else {
                navigate("/");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--bg-color)', overflow: 'hidden' }}>
            
            {/* Left Side: Form */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="form-container" 
                    style={{ width: '100%', maxWidth: '450px', background: 'var(--bg-card)', boxShadow: 'var(--shadow-lg)' }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'rgba(234, 179, 8, 0.1)', marginBottom: '1rem' }}>
                            <UserPlus size={32} color="var(--accent)" />
                        </div>
                        <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Create Account</h2>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Join LuxeStay to unlock exclusive bookings.</p>
                    </div>

                    {error && <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center', fontWeight: '500' }}>{error}</div>}
                    
                    <form onSubmit={handleClick}>
                        <div className="form-group" style={{ position: 'relative' }}>
                            <label className="form-label" htmlFor="name">Full Name</label>
                            <User size={18} style={{ position: 'absolute', left: '1rem', top: '2.5rem', color: 'var(--text-light)' }} />
                            <input type="text" id="name" className="form-control" style={{ paddingLeft: '3rem' }} placeholder="John Doe" onChange={handleChange} required />
                        </div>
                        <div className="form-group" style={{ position: 'relative' }}>
                            <label className="form-label" htmlFor="email">Email Address</label>
                            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '2.5rem', color: 'var(--text-light)' }} />
                            <input type="email" id="email" className="form-control" style={{ paddingLeft: '3rem' }} placeholder="you@example.com" onChange={handleChange} required />
                        </div>
                        <div className="form-group" style={{ position: 'relative' }}>
                            <label className="form-label" htmlFor="password">Password</label>
                            <Key size={18} style={{ position: 'absolute', left: '1rem', top: '2.5rem', color: 'var(--text-light)' }} />
                            <input type="password" id="password" className="form-control" style={{ paddingLeft: '3rem' }} placeholder="••••••••" onChange={handleChange} required />
                        </div>
                        <div className="form-group" style={{ position: 'relative' }}>
                            <label className="form-label" htmlFor="role">Role</label>
                            <Briefcase size={18} style={{ position: 'absolute', left: '1rem', top: '2.5rem', color: 'var(--text-light)' }} />
                            <select id="role" className="form-control" style={{ paddingLeft: '3rem' }} onChange={handleChange} value={info.role}>
                                <option value="user">Traveler (User)</option>
                                <option value="manager">Hotel Manager</option>
                                <option value="admin">System Admin</option>
                            </select>
                        </div>
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="btn btn-primary" 
                            style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', fontSize: '1.1rem' }} 
                            type="submit"
                        >
                            Sign Up
                        </motion.button>
                    </form>
                    
                    <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: '700', textDecoration: 'none' }}>Log in here</Link>
                    </p>
                </motion.div>
            </div>

            {/* Right Side: SVG Animation Banner (Inverted for variety) */}
            <div className="desktop-only" style={{ flex: 1.2, background: 'linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                
                {/* Floating Abstract Shapes */}
                <motion.div
                    animate={{ 
                        y: [0, 40, 0],
                        rotate: [0, -10, 10, 0]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    style={{ position: 'absolute', bottom: '10%', right: '10%', opacity: 0.8 }}
                >
                    <svg width="250" height="250" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="100" cy="100" r="100" fill="var(--accent)" fillOpacity="0.2" />
                        <path d="M100 20L120 80H180L130 115L150 180L100 140L50 180L70 115L20 80H80L100 20Z" fill="var(--accent)" fillOpacity="0.3" />
                    </svg>
                </motion.div>

                <motion.div
                    animate={{ 
                        x: [0, -30, 0],
                        y: [0, -40, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    style={{ position: 'absolute', top: '15%', left: '10%', opacity: 0.6 }}
                >
                    <svg width="300" height="300" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M50 50 Q 100 0, 150 50 T 150 150 Q 100 200, 50 150 T 50 50" fill="white" fillOpacity="0.1" />
                    </svg>
                </motion.div>

                {/* Animated Minimalist Destination Graphic */}
                <div style={{ position: 'relative', zIndex: 5 }}>
                    <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <motion.circle 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            cx="200" cy="150" r="100" fill="rgba(255,255,255,0.1)" 
                        />
                        <motion.circle 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                            cx="200" cy="150" r="140" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="10 10" 
                        />
                        
                        {/* Map Marker */}
                        <motion.path
                            initial={{ y: -100, opacity: 0 }}
                            animate={{ y: [0, -15, 0], opacity: 1 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            d="M200 80 C 170 80, 150 100, 150 130 C 150 170, 200 230, 200 230 C 200 230, 250 170, 250 130 C 250 100, 230 80, 200 80 Z" 
                            fill="var(--accent)"
                        />
                        <motion.circle 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 1.5 }}
                            cx="200" cy="125" r="15" fill="white" 
                        />

                        {/* Base Shadow */}
                        <motion.ellipse
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: [1, 0.7, 1], opacity: [0.5, 0.2, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            cx="200" cy="240" rx="40" ry="10" fill="black"
                        />
                    </svg>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 0.8 }}
                        style={{ textAlign: 'center', marginTop: '2rem' }}
                    >
                        <h3 style={{ color: 'white', fontSize: '2rem', fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>Your Next Destination</h3>
                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>Create an account to start your journey.</p>
                    </motion.div>
                </div>

            </div>
        </div>
    );
};

export default Register;
