import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";

const Navbar = () => {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
    const [isAnimatingTheme, setIsAnimatingTheme] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
        setIsOpen(false);
        navigate("/");
    };

    const toggleMenu = () => setIsOpen(!isOpen);

    const closeMenu = () => setIsOpen(false);

    const toggleTheme = () => {
        if (isAnimatingTheme) return;
        setIsAnimatingTheme(true);

        // Curtain takes 500ms to drop. At 500ms, swap theme and instantly trigger exit.
        setTimeout(() => {
            setTheme(theme === "dark" ? "light" : "dark");
            setIsAnimatingTheme(false);
        }, 600); // 600ms gives a tiny 100ms grace period so it feels smooth, not jerky.
    };

    const curtainColor = theme === "dark" ? "#f8f9fa" : "#050505";

    return (
        <>
            {/* Theme Transition Curtain */}
            <AnimatePresence>
                {isAnimatingTheme && (
                    <motion.div
                        initial={{ top: '-120vh' }}
                        animate={{ top: 0 }}
                        exit={{ top: '120vh' }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        style={{
                            position: 'fixed',
                            left: 0,
                            right: 0,
                            height: '120vh',
                            background: curtainColor,
                            boxShadow: `0 0 150px 150px ${curtainColor}`,
                            zIndex: 99999,
                            pointerEvents: 'none'
                        }}
                    />
                )}
            </AnimatePresence>

            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`navbar ${scrolled ? 'scrolled' : ''}`}
            >
                <div className="container nav-container">
                    <Link to="/" className="nav-brand" onClick={closeMenu}>
                        Luxe<span style={{ color: 'var(--accent)' }}>Stay</span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="nav-links desktop-only">
                        <Link to="/hotels">Hotels</Link>
                        {user ? (
                            <>
                                {(user.role === "admin" || user.role === "manager") && (
                                    <Link to="/dashboard">Dashboard</Link>
                                )}
                                <Link to="/my-trips">My Trips</Link>
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <motion.svg
                                        width="44"
                                        height="44"
                                        viewBox="0 0 44 44"
                                        style={{ position: 'absolute' }}
                                    >
                                        <motion.circle
                                            cx="22"
                                            cy="22"
                                            r="21"
                                            stroke="var(--accent)"
                                            strokeWidth="2"
                                            fill="none"
                                            strokeLinecap="round"
                                            initial={{ pathLength: 0, rotate: -90 }}
                                            animate={{ pathLength: 1, rotate: 270 }}
                                            transition={{ duration: 2, ease: "easeInOut", delay: 0.2 }}
                                        />
                                    </motion.svg>
                                    <div className="profile-circle" title={`${user.role}: ${user.name}`}>
                                        {user.name ? user.name.charAt(0) : "U"}
                                    </div>
                                </div>
                                <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', textTransform: 'uppercase', fontFamily: 'var(--font-display)', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.05em' }}>Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">Login</Link>
                                <Link to="/register" style={{ color: 'var(--accent)' }}>Join Us</Link>
                            </>
                        )}
                        <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>

                    {/* Mobile Toggle Button */}
                    <button className="mobile-toggle" onClick={toggleMenu} aria-label="Toggle menu">
                        <motion.div
                            animate={{ rotate: isOpen ? 90 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </motion.div>
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: '-100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '-100%' }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="mobile-menu"
                    >
                        <div className="mobile-nav-links">
                            <Link to="/hotels" onClick={closeMenu}>Hotels</Link>
                            {user ? (
                                <>
                                    {(user.role === "admin" || user.role === "manager") && (
                                        <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
                                    )}
                                    <Link to="/my-trips" onClick={closeMenu}>My Trips</Link>
                                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1rem', marginBottom: '1rem' }}>
                                        <motion.svg
                                            width="56"
                                            height="56"
                                            viewBox="0 0 56 56"
                                            style={{ position: 'absolute' }}
                                        >
                                            <motion.circle
                                                cx="28"
                                                cy="28"
                                                r="27"
                                                stroke="var(--accent)"
                                                strokeWidth="2"
                                                fill="none"
                                                strokeLinecap="round"
                                                initial={{ pathLength: 0, rotate: -90 }}
                                                animate={{ pathLength: 1, rotate: 270 }}
                                                transition={{ duration: 2, ease: "easeInOut", delay: 0.2 }}
                                            />
                                        </motion.svg>
                                        <div className="profile-circle" title={`${user.role}: ${user.name}`} style={{ width: '48px', height: '48px', fontSize: '1.5rem' }}>
                                            {user.name ? user.name.charAt(0) : "U"}
                                        </div>
                                    </div>
                                    <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: 'var(--accent)', textTransform: 'uppercase', fontFamily: 'var(--font-display)', fontWeight: 800, cursor: 'pointer', letterSpacing: '0.05em', fontSize: 'inherit' }}>Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={closeMenu}>Login</Link>
                                    <Link to="/register" style={{ color: 'var(--accent)' }} onClick={closeMenu}>Join Us</Link>
                                </>
                            )}
                            <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', marginTop: '2rem' }}>
                                {theme === "dark" ? <Sun size={32} /> : <Moon size={32} />}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
