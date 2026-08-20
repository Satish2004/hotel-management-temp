import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Key, Mail } from "lucide-react";

const Login = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8000/api/auth/login", credentials, { withCredentials: true });
            setUser(res.data.details); // Store full user details
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
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
                            <Home size={32} color="var(--accent)" />
                        </div>
                        <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Welcome Back</h2>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Sign in to continue to LuxeStay.</p>
                    </div>

                    {error && <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center', fontWeight: '500' }}>{error}</div>}
                    
                    <form onSubmit={handleClick}>
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
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="btn btn-primary" 
                            style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', fontSize: '1.1rem' }} 
                            type="submit"
                        >
                            Sign In
                        </motion.button>
                    </form>
                    
                    <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)' }}>
                        Don't have an account? <Link to="/register" style={{ color: 'var(--accent)', fontWeight: '700', textDecoration: 'none' }}>Register here</Link>
                    </p>
                </motion.div>
            </div>

            {/* Right Side: SVG Animation Banner */}
            <div className="desktop-only" style={{ flex: 1.2, background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                
                {/* Floating Abstract Shapes */}
                <motion.div
                    animate={{ 
                        y: [0, -40, 0],
                        rotate: [0, 10, -10, 0]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    style={{ position: 'absolute', top: '10%', right: '10%', opacity: 0.8 }}
                >
                    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="100" cy="100" r="100" fill="var(--accent)" fillOpacity="0.2" />
                        <circle cx="100" cy="100" r="70" fill="var(--accent)" fillOpacity="0.4" />
                    </svg>
                </motion.div>

                <motion.div
                    animate={{ 
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    style={{ position: 'absolute', bottom: '15%', left: '10%', opacity: 0.6 }}
                >
                    <svg width="300" height="300" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M43.5 156.5C14.5 127.5 14.5 80.5 43.5 51.5C72.5 22.5 119.5 22.5 148.5 51.5C177.5 80.5 177.5 127.5 148.5 156.5C119.5 185.5 72.5 185.5 43.5 156.5Z" fill="white" fillOpacity="0.1" />
                    </svg>
                </motion.div>

                {/* Animated Minimalist Hotel Graphic */}
                <div style={{ position: 'relative', zIndex: 5 }}>
                    <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <motion.rect 
                            initial={{ height: 0, y: 300 }}
                            animate={{ height: 200, y: 100 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            x="100" y="100" width="120" height="200" rx="8" fill="rgba(255,255,255,0.2)" 
                        />
                        <motion.rect 
                            initial={{ height: 0, y: 300 }}
                            animate={{ height: 260, y: 40 }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                            x="240" y="40" width="80" height="260" rx="8" fill="rgba(255,255,255,0.3)" 
                        />
                        
                        {/* Hotel Windows */}
                        {[...Array(6)].map((_, i) => (
                            <motion.rect 
                                key={`w1-${i}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0.3, 0.8, 0.3] }}
                                transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                                x="120" y={120 + i*30} width="20" height="15" rx="4" fill="var(--accent)" 
                            />
                        ))}
                        {[...Array(6)].map((_, i) => (
                            <motion.rect 
                                key={`w2-${i}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0.3, 0.8, 0.3] }}
                                transition={{ duration: 4, repeat: Infinity, delay: i * 0.3 }}
                                x="170" y={120 + i*30} width="20" height="15" rx="4" fill="var(--accent)" 
                            />
                        ))}
                        {[...Array(8)].map((_, i) => (
                            <motion.rect 
                                key={`w3-${i}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }}
                                x="260" y={60 + i*30} width="40" height="15" rx="4" fill="var(--accent)" 
                            />
                        ))}

                        {/* Ground Line */}
                        <motion.path 
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                            d="M 40 300 L 360 300" stroke="white" strokeWidth="4" strokeLinecap="round" 
                        />
                    </svg>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 0.8 }}
                        style={{ textAlign: 'center', marginTop: '2rem' }}
                    >
                        <h3 style={{ color: 'white', fontSize: '2rem', fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>Experience Luxury</h3>
                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>Book the world's most exclusive properties.</p>
                    </motion.div>
                </div>

            </div>
        </div>
    );
};

export default Login;
