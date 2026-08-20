import { useState, useContext, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import { UploadCloud } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [hotels, setHotels] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [allBookings, setAllBookings] = useState([]);
    const [activeTab, setActiveTab] = useState("properties"); // 'properties', 'analytics', 'users'
    const [view, setView] = useState("list"); // 'list', 'add', 'edit'

    // Form state for managers
    const [editId, setEditId] = useState(null);
    const [files, setFiles] = useState([]);
    const [existingPhotos, setExistingPhotos] = useState([]);
    const [info, setInfo] = useState({ name: "", description: "", location: "", pricePerNight: 5000 });
    const [customAmenities, setCustomAmenities] = useState([]);
    const [customAmenityInput, setCustomAmenityInput] = useState("");
    const [amenities, setAmenities] = useState({
        isAC: false, isFan: true, hasBalcony: false, hasWiFi: false, hasPool: false,
        hasGym: false, hasSpa: false, hasParking: false, hasRestaurant: false
    });

    const fetchHotels = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/hotels`);
            let myHotels = res.data;
            if (user.role === "manager") {
                myHotels = myHotels.filter(h => h.managerId === user._id || h.managerId?._id === user._id);
            }
            setHotels(myHotels);
            return myHotels;
        } catch (err) {
            console.error(err);
            return [];
        }
    };

    const fetchUsersAndBookings = async (loadedHotels) => {
        try {
            const [usersRes, bookingsRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/users`, { withCredentials: true }),
                axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/bookings/all`, { withCredentials: true })
            ]);
            setAllUsers(usersRes.data);

            // If manager, filter bookings to only show bookings for their properties
            let myBookings = bookingsRes.data;
            if (user.role === "manager") {
                const hotelsToUse = loadedHotels || hotels;
                myBookings = myBookings.filter(b => hotelsToUse.some(h => h._id === (b.hotel?._id || b.hotel)));
            }
            setAllBookings(myBookings);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!user || (user.role !== "admin" && user.role !== "manager")) {
            navigate("/");
            return;
        }
        fetchHotels().then(loadedHotels => fetchUsersAndBookings(loadedHotels));
    }, [user, navigate]);

    const handleInfoChange = (e) => setInfo(prev => ({ ...prev, [e.target.id]: e.target.value }));
    const handleAmenitiesChange = (e) => setAmenities(prev => ({ ...prev, [e.target.id]: e.target.checked }));

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append("name", info.name);
            data.append("description", info.description);
            data.append("location", info.location);
            data.append("pricePerNight", info.pricePerNight);
            data.append("isAC", amenities.isAC);
            data.append("isFan", amenities.isFan);
            data.append("hasBalcony", amenities.hasBalcony);
            data.append("hasWiFi", amenities.hasWiFi);
            data.append("hasPool", amenities.hasPool);
            data.append("hasGym", amenities.hasGym);
            data.append("hasSpa", amenities.hasSpa);
            data.append("hasParking", amenities.hasParking);
            data.append("hasRestaurant", amenities.hasRestaurant);
            data.append("customAmenities", JSON.stringify(customAmenities));

            if (files && files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    data.append("photos", files[i]);
                }
            }

            if (view === "add") {
                await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/hotels`, data, { withCredentials: true });
                alert("Hotel Added Successfully!");
            } else if (view === "edit") {
                const updateData = {
                    name: info.name,
                    description: info.description,
                    location: info.location,
                    amenities,
                    customAmenities: JSON.stringify(customAmenities)
                };
                await axios.put(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/hotels/${editId}`, updateData, { withCredentials: true });
                alert("Hotel Updated Successfully!");
            }

            setView("list");
            fetchHotels();
            setInfo({ name: "", description: "", location: "", pricePerNight: 5000 });
            setFiles([]);
            setExistingPhotos([]);
            setCustomAmenities([]);
            setCustomAmenityInput("");
        } catch (err) {
            console.error(err);
            alert("Error saving hotel");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this property?")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/hotels/${id}`, { withCredentials: true });
            fetchHotels();
        } catch (err) {
            console.error(err);
            alert("Error deleting hotel");
        }
    };

    const openEdit = (hotel) => {
        setEditId(hotel._id);
        setInfo({ name: hotel.name, description: hotel.description, location: hotel.location, pricePerNight: hotel.pricePerNight || 5000 });
        setAmenities(hotel.amenities);
        setCustomAmenities(hotel.customAmenities || []);
        setExistingPhotos(hotel.photos || []);
        setView("edit");
    };

    if (!user) return null;

    // Analytics Data Processing for Admin
    const amenityCounts = [
        { name: 'AC', count: hotels.filter(h => h.amenities?.isAC).length },
        { name: 'Fan', count: hotels.filter(h => h.amenities?.isFan).length },
        { name: 'Balcony', count: hotels.filter(h => h.amenities?.hasBalcony).length },
        { name: 'WiFi', count: hotels.filter(h => h.amenities?.hasWiFi).length },
        { name: 'Pool', count: hotels.filter(h => h.amenities?.hasPool).length },
        { name: 'Gym', count: hotels.filter(h => h.amenities?.hasGym).length },
        { name: 'Spa', count: hotels.filter(h => h.amenities?.hasSpa).length },
    ];

    const COLORS = ['#0f172a', '#1e293b', '#ca8a04', '#eab308', '#64748b'];

    // For scatter plot: Number of amenities vs. length of description (just an example of functionality correlation)
    const scatterData = hotels.map((h, i) => {
        let amenityScore = 0;
        if (h.amenities?.isAC) amenityScore++;
        if (h.amenities?.isFan) amenityScore++;
        if (h.amenities?.hasBalcony) amenityScore++;
        if (h.amenities?.hasWiFi) amenityScore++;
        if (h.amenities?.hasPool) amenityScore++;

        return {
            x: amenityScore, // x-axis: total features
            y: h.photos ? h.photos.length : 0, // y-axis: number of photos uploaded
            name: h.name
        }
    });

    const tabStyle = {
        padding: '0.8rem 1.5rem',
        background: 'transparent',
        border: 'none',
        fontSize: '1rem',
        fontWeight: '600',
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        transition: 'all 0.2s',
        outline: 'none'
    };

    const activeTabStyle = {
        ...tabStyle,
        color: 'var(--accent)',
        borderBottom: '3px solid var(--accent)'
    };

    return (
        <div>
            <Navbar />
            <div className="container dashboard-container animate-fade-in">
                <div className="dashboard-header" style={{ marginBottom: "1rem" }}>
                    <div>
                        <h2>{user.role === 'admin' ? 'System Dashboard' : 'Hotel Manager Dashboard'}</h2>
                        <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>
                            {user.role === 'admin' ? 'Manage platform data, users, and properties.' : 'Manage your properties, analytics, and bookings.'}
                        </p>
                    </div>
                    {activeTab === 'properties' && (
                        view === "list" ? (
                            <button className="btn btn-primary" onClick={() => setView("add")}>+ Add New Property</button>
                        ) : (
                            <button className="btn btn-outline" onClick={() => setView("list")}>&larr; Back to List</button>
                        )
                    )}
                </div>

                {/* TABS */}
                <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem', overflowX: 'auto', whiteSpace: 'nowrap', WebkitOverflowScrolling: 'touch', paddingBottom: '0.5rem' }}>
                    <button style={activeTab === 'properties' ? activeTabStyle : tabStyle} onClick={() => { setActiveTab('properties'); setView('list'); }}>Properties</button>
                    <button style={activeTab === 'analytics' ? activeTabStyle : tabStyle} onClick={() => setActiveTab('analytics')}>Analytics</button>
                    <button style={activeTab === 'users' ? activeTabStyle : tabStyle} onClick={() => setActiveTab('users')}>Users & Bookings</button>
                </div>

                {activeTab === 'analytics' && (
                    <div className="admin-analytics animate-fade-in">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-title">Total Properties on Platform</div>
                                <div className="stat-value">{hotels.length}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-title">Active Property Managers</div>
                                <div className="stat-value">{new Set(hotels.map(h => typeof h.managerId === 'object' ? h.managerId?._id : h.managerId)).size}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-title">Avg Amenities per Hotel</div>
                                <div className="stat-value" style={{ color: 'var(--accent)' }}>
                                    {hotels.length > 0 ? (hotels.reduce((acc, h) => acc + Object.values(h.amenities).filter(Boolean).length, 0) / hotels.length).toFixed(1) : 0}
                                </div>
                            </div>
                        </div>

                        <div className="grid-2" style={{ marginBottom: '2rem' }}>
                            <div style={{ background: 'var(--white)', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)', border: '1px solid #e2e8f0' }}>
                                <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Feature Correlation (Scatter)</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1rem' }}>X-Axis: Total Amenities | Y-Axis: Photos Uploaded</p>
                                <ResponsiveContainer width="100%" height={300}>
                                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                        <CartesianGrid />
                                        <XAxis type="number" dataKey="x" name="Amenities Count" />
                                        <YAxis type="number" dataKey="y" name="Photos" />
                                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                        <Scatter name="Properties" data={scatterData} fill="var(--accent)" />
                                    </ScatterChart>
                                </ResponsiveContainer>
                            </div>

                            <div style={{ background: 'var(--white)', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)', border: '1px solid #e2e8f0' }}>
                                <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Amenity Distribution (Bar)</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={amenityCounts}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="var(--primary)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'properties' && (
                    <>
                        {view === "list" && (
                            <div className="hotel-list animate-fade-in animate-delay-1">
                                <div className="responsive-table-wrapper" style={{ background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-md)', border: '1px solid #e2e8f0' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                                        <thead>
                                            <tr style={{ background: '#f8fafc', color: 'var(--primary)', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                                                <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600' }}>Property Name</th>
                                                <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600' }}>Location</th>
                                                <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {hotels.map(h => (
                                                <tr key={h._id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                                    <td style={{ padding: '1.25rem 1.5rem', fontWeight: '500' }}>{h.name}</td>
                                                    <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-light)' }}>{h.location}</td>
                                                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                                        <button className="btn btn-outline" style={{ padding: '0.4rem 1rem', marginRight: '0.5rem', fontSize: '0.9rem' }} onClick={() => openEdit(h)}>Edit</button>
                                                        <button className="btn btn-primary" style={{ padding: '0.4rem 1rem', background: '#ef4444', fontSize: '0.9rem', boxShadow: 'none' }} onClick={() => handleDelete(h._id)}>Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {hotels.length === 0 && (
                                                <tr>
                                                    <td colSpan={3} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)' }}>
                                                        No properties found. Start by adding a new one.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {(view === "add" || view === "edit") && (
                            <div className="form-container animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto', marginTop: '2rem' }}>
                                <h3 className="form-title">{view === "add" ? "Create New Property" : "Edit Property"}</h3>
                                <form onSubmit={handleSave}>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="name">Property Name</label>
                                        <input type="text" id="name" value={info.name} className="form-control" onChange={handleInfoChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="description">Description & Details</label>
                                        <textarea id="description" value={info.description} className="form-control" rows="4" onChange={handleInfoChange} required></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="location">Location</label>
                                        <input type="text" id="location" value={info.location} className="form-control" onChange={handleInfoChange} required />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="pricePerNight">Price Per Night (₹)</label>
                                        <input type="number" id="pricePerNight" min="0" value={info.pricePerNight} className="form-control" onChange={handleInfoChange} required />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Available Amenities (Functionality)</label>
                                        <div className="checkbox-group">
                                            <label className="checkbox-label">
                                                <input type="checkbox" id="isAC" checked={amenities.isAC} onChange={handleAmenitiesChange} /> ❄️ Air Conditioning
                                            </label>
                                            <label className="checkbox-label">
                                                <input type="checkbox" id="isFan" checked={amenities.isFan} onChange={handleAmenitiesChange} /> 🌀 Fan
                                            </label>
                                            <label className="checkbox-label">
                                                <input type="checkbox" id="hasBalcony" checked={amenities.hasBalcony} onChange={handleAmenitiesChange} /> 🌅 Balcony
                                            </label>
                                            <label className="checkbox-label">
                                                <input type="checkbox" id="hasWiFi" checked={amenities.hasWiFi} onChange={handleAmenitiesChange} /> 📶 Free WiFi
                                            </label>
                                            <label className="checkbox-label">
                                                <input type="checkbox" id="hasPool" checked={amenities.hasPool} onChange={handleAmenitiesChange} /> 🏊 Swimming Pool
                                            </label>
                                            <label className="checkbox-label">
                                                <input type="checkbox" id="hasGym" checked={amenities.hasGym} onChange={handleAmenitiesChange} /> 🏋️ Fitness Gym
                                            </label>
                                            <label className="checkbox-label">
                                                <input type="checkbox" id="hasSpa" checked={amenities.hasSpa} onChange={handleAmenitiesChange} /> 💆 Spa & Wellness
                                            </label>
                                            <label className="checkbox-label">
                                                <input type="checkbox" id="hasParking" checked={amenities.hasParking} onChange={handleAmenitiesChange} /> 🅿️ Secure Parking
                                            </label>
                                            <label className="checkbox-label">
                                                <input type="checkbox" id="hasRestaurant" checked={amenities.hasRestaurant} onChange={handleAmenitiesChange} /> 🍽️ Fine Restaurant
                                            </label>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Custom Amenities (Add Manually)</label>
                                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                            <input 
                                                type="text" 
                                                value={customAmenityInput} 
                                                onChange={(e) => setCustomAmenityInput(e.target.value)} 
                                                className="form-control" 
                                                placeholder="e.g. Free Breakfast, Welcome Drink" 
                                                style={{ flex: 1 }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        if(customAmenityInput.trim()) {
                                                            setCustomAmenities(prev => [...prev, customAmenityInput.trim()]);
                                                            setCustomAmenityInput("");
                                                        }
                                                    }
                                                }}
                                            />
                                            <button 
                                                type="button" 
                                                className="btn btn-outline" 
                                                onClick={() => {
                                                    if(customAmenityInput.trim()) {
                                                        setCustomAmenities(prev => [...prev, customAmenityInput.trim()]);
                                                        setCustomAmenityInput("");
                                                    }
                                                }}
                                            >
                                                Add
                                            </button>
                                        </div>
                                        {customAmenities.length > 0 && (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                {customAmenities.map((amenity, index) => (
                                                    <span key={index} style={{ background: 'var(--border-color)', padding: '0.3rem 0.8rem', borderRadius: '15px', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                                                        {amenity}
                                                        <button 
                                                            type="button" 
                                                            onClick={() => setCustomAmenities(prev => prev.filter((_, i) => i !== index))}
                                                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--text-light)', padding: 0 }}
                                                        >
                                                            &times;
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {view === "add" && (
                                        <div className="form-group">
                                            <label className="form-label" style={{ marginBottom: '1rem', display: 'block' }}>Property Gallery (Multiple Images)</label>
                                            <label htmlFor="file" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', border: '2px dashed var(--border-color)', borderRadius: '8px', background: 'var(--card-bg)', cursor: 'pointer', transition: 'all 0.3s' }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--accent)'} onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-color)'}>
                                                <UploadCloud size={48} color="var(--text-secondary)" style={{ marginBottom: '1rem' }} />
                                                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem' }}>Click to Browse Files</span>
                                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Upload High-Res Architecture Photos</span>
                                                <input type="file" id="file" multiple style={{ display: 'none' }} onChange={(e) => { setFiles(prev => [...prev, ...Array.from(e.target.files)]); e.target.value = null; }} />
                                            </label>

                                            {/* Beautiful Image Preview Slider */}
                                            {files.length > 0 && (
                                                <div className="image-slider animate-fade-in" style={{ marginTop: '1.5rem' }}>
                                                    {files.map((f, i) => (
                                                        <div key={i} style={{ flex: '0 0 auto', width: '220px', height: '150px', position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '2px solid var(--border-color)', scrollSnapAlign: 'start', boxShadow: 'var(--shadow-sm)' }}>
                                                            <img src={URL.createObjectURL(f)} alt={`preview-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            <button type="button" onClick={() => setFiles(files.filter((_, index) => index !== i))} style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.75)', color: 'white', border: 'none', borderRadius: '50%', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1rem', backdropFilter: 'blur(4px)' }}>×</button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {view === "edit" && existingPhotos.length > 0 && (
                                        <div className="form-group animate-fade-in">
                                            <label className="form-label" style={{ marginBottom: '1rem', display: 'block' }}>Current Property Gallery</label>
                                            <div className="image-slider">
                                                {existingPhotos.map((photo, i) => (
                                                    <div key={i} style={{ flex: '0 0 auto', width: '220px', height: '150px', position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '2px solid var(--border-color)', scrollSnapAlign: 'start', boxShadow: 'var(--shadow-sm)' }}>
                                                        <img src={`${import.meta.env.VITE_API_URL || "http://localhost:8000"}${photo}`} alt={`existing-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '1rem' }} type="submit">
                                        {view === "add" ? "Publish Property" : "Update Details"}
                                    </button>
                                </form>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'users' && (
                    <div className="animate-fade-in">
                        <h3 style={{ marginBottom: "1rem", color: "var(--primary)" }}>Property Bookings</h3>
                        <div className="responsive-table-wrapper" style={{ background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-md)', border: '1px solid #e2e8f0', marginBottom: '3rem' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc', color: 'var(--primary)', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                                        <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600' }}>Guest Name</th>
                                        <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600' }}>Email</th>
                                        <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600' }}>Property</th>
                                        <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600' }}>Amount</th>
                                        <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600' }}>Dates</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allBookings.map(b => (
                                        <tr key={b._id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                            <td style={{ padding: '1.25rem 1.5rem', fontWeight: '500' }}>{b.user?.name || "Unknown"}</td>
                                            <td style={{ padding: '1.25rem 1.5rem', color: "var(--text-light)" }}>{b.user?.email || "Unknown"}</td>
                                            <td style={{ padding: '1.25rem 1.5rem', fontWeight: '500' }}>{b.hotel?.name || "Deleted Property"}</td>
                                            <td style={{ padding: '1.25rem 1.5rem', color: "#00c853", fontWeight: "bold" }}>₹{b.totalPrice}</td>
                                            <td style={{ padding: '1.25rem 1.5rem', fontSize: "0.85rem", color: "var(--text-light)" }}>{new Date(b.checkIn).toLocaleDateString()} &rarr; {new Date(b.checkOut).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                    {allBookings.length === 0 && <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)' }}>No bookings found for your properties.</td></tr>}
                                </tbody>
                            </table>
                        </div>

                        <h3 style={{ marginBottom: "1rem", color: "var(--primary)" }}>Platform Users</h3>
                        <div className="responsive-table-wrapper" style={{ background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-md)', border: '1px solid #e2e8f0' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc', color: 'var(--primary)', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                                        <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600' }}>Name</th>
                                        <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600' }}>Email</th>
                                        <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600' }}>Role</th>
                                        <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allUsers.map(u => {
                                        const hasBooked = allBookings.some(b => b.user?._id === u._id);
                                        return (
                                            <tr key={u._id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                                <td style={{ padding: '1.25rem 1.5rem', fontWeight: '500' }}>{u.name}</td>
                                                <td style={{ padding: '1.25rem 1.5rem', color: "var(--text-light)" }}>{u.email}</td>
                                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                                    <span style={{ padding: '0.4rem 0.8rem', background: u.role === 'admin' ? 'rgba(239, 68, 68, 0.1)' : u.role === 'manager' ? 'rgba(234, 179, 8, 0.1)' : 'rgba(59, 130, 246, 0.1)', color: u.role === 'admin' ? '#ef4444' : u.role === 'manager' ? '#eab308' : '#3b82f6', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '0.05em' }}>{u.role.toUpperCase()}</span>
                                                </td>
                                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                                    {hasBooked ? (
                                                        <span style={{ color: "#00c853", fontWeight: "bold", fontSize: "0.9rem", display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ width: 8, height: 8, background: '#00c853', borderRadius: '50%', display: 'inline-block' }}></span> Booked</span>
                                                    ) : (
                                                        <span style={{ color: "var(--text-light)", fontSize: "0.9rem", display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ width: 8, height: 8, background: 'var(--border-color)', borderRadius: '50%', display: 'inline-block' }}></span> No Bookings</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
