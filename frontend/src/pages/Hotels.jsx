import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { MapPin, Wind, Wifi, Waves, Star, Search, Dumbbell, Sparkles, Car, Utensils } from "lucide-react";

const Hotels = () => {
    const [hotels, setHotels] = useState([]);
    const [filters, setFilters] = useState({
        isAC: false, isFan: false, hasBalcony: false, hasWiFi: false, hasPool: false,
        hasGym: false, hasSpa: false, hasParking: false, hasRestaurant: false
    });
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/hotels");
                setHotels(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchHotels();
    }, []);

    const getImageUrl = (path) => {
        const cleanPath = path.replace(/\\/g, '/');
        return `http://localhost:8000/${cleanPath}`;
    };

    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.checked }));
    };

    const filteredHotels = hotels.filter(hotel => {
        if (filters.isAC && !hotel.amenities?.isAC) return false;
        if (filters.isFan && !hotel.amenities?.isFan) return false;
        if (filters.hasBalcony && !hotel.amenities?.hasBalcony) return false;
        if (filters.hasWiFi && !hotel.amenities?.hasWiFi) return false;
        if (filters.hasPool && !hotel.amenities?.hasPool) return false;
        if (filters.hasGym && !hotel.amenities?.hasGym) return false;
        if (filters.hasSpa && !hotel.amenities?.hasSpa) return false;
        if (filters.hasParking && !hotel.amenities?.hasParking) return false;
        if (filters.hasRestaurant && !hotel.amenities?.hasRestaurant) return false;
        
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesName = hotel.name.toLowerCase().includes(query);
            const matchesLocation = hotel.location.toLowerCase().includes(query);
            
            const amenitiesObj = hotel.amenities || {};
            const amenityKeywords = {
                isAC: "air conditioning ac cool",
                isFan: "fan",
                hasBalcony: "balcony view",
                hasWiFi: "wifi internet free network",
                hasPool: "pool swimming water swim",
                hasGym: "gym fitness workout exercise",
                hasSpa: "spa wellness massage relax",
                hasParking: "parking garage car space",
                hasRestaurant: "restaurant food dining eat meal"
            };
            
            let matchesAmenity = false;
            for (const key in amenitiesObj) {
                if (amenitiesObj[key] === true && amenityKeywords[key] && amenityKeywords[key].includes(query)) {
                    matchesAmenity = true;
                    break;
                }
            }
            
            if (!matchesName && !matchesLocation && !matchesAmenity) {
                return false;
            }
        }
        
        return true;
    });

    const staggerContainer = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <div>
            <Navbar />

            <div className="section-padding" style={{ background: 'var(--bg-color)', minHeight: '100vh', paddingTop: '10rem' }}>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="huge-title" style={{ marginBottom: '1rem' }}>The Collection.</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', marginBottom: '2rem', maxWidth: '600px' }}>
                            Explore our exclusive portfolio of properties. Use the search bar or filters below to find exactly what you're looking for.
                        </p>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        style={{ marginBottom: '2rem' }}
                    >
                        <div style={{ position: 'relative', maxWidth: '800px' }}>
                            <Search size={22} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input 
                                type="text" 
                                placeholder="Search by property name, location, or specific amenities (e.g. 'gym', 'spa', 'wifi')..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ width: '100%', padding: '1.25rem 1.25rem 1.25rem 4rem', fontSize: '1.1rem', borderRadius: '100px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-primary)', outline: 'none', boxShadow: 'var(--shadow-sm)', transition: 'border-color 0.3s' }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                            />
                        </div>
                    </motion.div>

                    {/* Filter Categories */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="filters-bar"
                    >
                        <label className="filter-chip">
                            <input type="checkbox" name="isAC" checked={filters.isAC} onChange={handleFilterChange} />
                            <span><Wind size={14} /> Air Conditioning</span>
                        </label>
                        <label className="filter-chip">
                            <input type="checkbox" name="isFan" checked={filters.isFan} onChange={handleFilterChange} />
                            <span>Fan</span>
                        </label>
                        <label className="filter-chip">
                            <input type="checkbox" name="hasBalcony" checked={filters.hasBalcony} onChange={handleFilterChange} />
                            <span>Balcony</span>
                        </label>
                        <label className="filter-chip">
                            <input type="checkbox" name="hasWiFi" checked={filters.hasWiFi} onChange={handleFilterChange} />
                            <span><Wifi size={14} /> Free WiFi</span>
                        </label>
                        <label className="filter-chip">
                            <input type="checkbox" name="hasPool" checked={filters.hasPool} onChange={handleFilterChange} />
                            <span><Waves size={14} /> Swimming Pool</span>
                        </label>
                        <label className="filter-chip">
                            <input type="checkbox" name="hasGym" checked={filters.hasGym} onChange={handleFilterChange} />
                            <span><Dumbbell size={14} /> Fitness Gym</span>
                        </label>
                        <label className="filter-chip">
                            <input type="checkbox" name="hasSpa" checked={filters.hasSpa} onChange={handleFilterChange} />
                            <span><Sparkles size={14} /> Spa & Wellness</span>
                        </label>
                        <label className="filter-chip">
                            <input type="checkbox" name="hasParking" checked={filters.hasParking} onChange={handleFilterChange} />
                            <span><Car size={14} /> Secure Parking</span>
                        </label>
                        <label className="filter-chip">
                            <input type="checkbox" name="hasRestaurant" checked={filters.hasRestaurant} onChange={handleFilterChange} />
                            <span><Utensils size={14} /> Fine Restaurant</span>
                        </label>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={staggerContainer}
                        className="hotel-grid"
                    >
                        {filteredHotels.length === 0 ? (
                            <div style={{ gridColumn: '1 / -1', padding: '5rem 0', color: 'var(--text-secondary)' }}>
                                <h3 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>No matches found</h3>
                                <p>Try adjusting your criteria to see more properties.</p>
                            </div>
                        ) : null}
                        {filteredHotels.map(hotel => (
                            <motion.div variants={fadeInUp} className="hotel-card" key={hotel._id}>
                                <Link to={`/hotel/${hotel._id}`}>
                                    <div className="hotel-img-wrapper">
                                        {hotel.photos && hotel.photos.length > 0 ? (
                                            <img src={getImageUrl(hotel.photos[0])} alt={hotel.name} className="hotel-img" />
                                        ) : (
                                            <div className="hotel-img" style={{ background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333' }}>NO IMAGE</div>
                                        )}
                                    </div>
                                    <div className="hotel-content">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <h3 className="hotel-title">{hotel.name}</h3>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent)' }}>
                                                <Star size={16} fill="currentColor" />
                                                <span style={{ fontWeight: 600 }}>{hotel.reviews && hotel.reviews.length > 0 ? (hotel.reviews.reduce((a, b) => a + b.rating, 0) / hotel.reviews.length).toFixed(1) : "New"}</span>
                                            </div>
                                        </div>
                                        <p className="hotel-location">
                                            <MapPin size={12} style={{ marginRight: '0.5rem', display: 'inline' }} />
                                            {hotel.location}
                                        </p>
                                        <div className="amenities-tags">
                                            {hotel.amenities?.isAC && <span className="tag">AC</span>}
                                            {hotel.amenities?.hasWiFi && <span className="tag">WIFI</span>}
                                            {hotel.amenities?.hasPool && <span className="tag">POOL</span>}
                                            {hotel.amenities?.hasBalcony && <span className="tag">BALCONY</span>}
                                            {hotel.amenities?.hasGym && <span className="tag">GYM</span>}
                                            {hotel.amenities?.hasSpa && <span className="tag">SPA</span>}
                                            {hotel.amenities?.hasParking && <span className="tag">PARKING</span>}
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid var(--border-color)', padding: '4rem 0', textAlign: 'center' }}>
                <div className="container">
                    <h2 className="footer-title">LuxeStay</h2>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        &copy; 2026 LuxeStay
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Hotels;
