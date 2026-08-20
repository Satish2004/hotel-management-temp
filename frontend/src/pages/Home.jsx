import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Shield, Clock, Coffee, Wifi } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
    // Refs for GSAP
    const heroContentRef = useRef(null);
    const aboutImageRef = useRef(null);
    const aboutTextRef = useRef(null);
    const experiencesRef = useRef(null);
    const amenitiesRef = useRef(null);
    const ctaRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Hero Animation
            gsap.fromTo(heroContentRef.current.children,
                { opacity: 0, y: 60 },
                { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
            );

            // About Animation
            gsap.fromTo(aboutImageRef.current,
                { opacity: 0, scale: 0.9 },
                {
                    opacity: 1, scale: 1, duration: 1.5, ease: "power2.out",
                    scrollTrigger: { trigger: aboutImageRef.current, start: "top 80%" }
                }
            );
            gsap.fromTo(aboutTextRef.current.children,
                { opacity: 0, y: 50 },
                {
                    opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power2.out",
                    scrollTrigger: { trigger: aboutTextRef.current, start: "top 80%" }
                }
            );



            // Experiences Animation
            gsap.fromTo(experiencesRef.current.children,
                { opacity: 0, y: 50 },
                {
                    opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out",
                    scrollTrigger: { trigger: experiencesRef.current, start: "top 85%" }
                }
            );

            // Amenities Animation
            gsap.fromTo(amenitiesRef.current.children,
                { opacity: 0, y: 50 },
                {
                    opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out",
                    scrollTrigger: { trigger: amenitiesRef.current, start: "top 85%" }
                }
            );

            // CTA Animation
            gsap.fromTo(ctaRef.current.children,
                { opacity: 0, y: 40 },
                {
                    opacity: 1, y: 0, duration: 1, ease: "power2.out",
                    scrollTrigger: { trigger: ctaRef.current, start: "top 80%" }
                }
            );
        });

        return () => ctx.revert(); // Cleanup GSAP
    }, []);

    return (
        <div>
            <Navbar />

            {/* Hero Section */}
            <div className="hero">
                <video autoPlay loop muted playsInline className="hero-video">
                    <source src="https://player.vimeo.com/external/403615370.sd.mp4?s=d74b8826d9c6c406085a86d26815c3ecbfae1e69&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
                </video>
                <div className="container" style={{ width: '100%' }}>
                    <div ref={heroContentRef} className="hero-content">
                        <h1>
                            Redefining <br /><span style={{ color: 'var(--accent)' }}>Space & Scale.</span>
                        </h1>
                        <p>
                            Curated architectural masterpieces and premium stays across the globe. Unapologetically bold.
                        </p>
                        <div>
                            <Link to="/hotels" className="btn btn-primary">
                                Explore Architecture
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div className="section-padding" style={{ background: 'var(--card-bg)' }}>
                <div className="container grid-2">
                    <div ref={aboutImageRef}>
                        <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop" alt="Brutalist Interior" style={{ width: '100%', height: '800px', objectFit: 'cover' }} />
                    </div>
                    <div ref={aboutTextRef} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h2 className="huge-title">Design <br />Forward.</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', marginBottom: '2rem', maxWidth: '400px' }}>
                            We reject the ordinary. LuxeStay is a collection of spaces for those who appreciate raw materials, vast scales, and uncompromising luxury.
                        </p>
                        <div className="flex-mobile-col" style={{ marginTop: '2rem' }}>
                            <div>
                                <div style={{ fontSize: '3rem', fontFamily: 'var(--font-display)', fontWeight: 800 }}>100+</div>
                                <div style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>Global Stays</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '3rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--accent)' }}>4.9</div>
                                <div style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>Average Rating</div>
                            </div>
                        </div>
                        <div style={{ marginTop: '3rem' }}>
                            <Link to="/hotels" className="btn btn-outline">View Collection</Link>
                        </div>
                    </div>
                </div>
            </div>


            {/* Curated Experiences Section */}
            <div className="section-padding" style={{ background: 'var(--bg-color)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 className="huge-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Curated Experiences.</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                            Discover tailored stays designed to match your exact mood, from secluded nature retreats to vibrant city penthouses.
                        </p>
                    </div>

                    <div ref={experiencesRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {[
                            { title: 'Oceanfront Villas', img: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=800&auto=format&fit=crop' },
                            { title: 'Urban Penthouses', img: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=800&auto=format&fit=crop' },
                            { title: 'Mountain Retreats', img: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=800&auto=format&fit=crop' }
                        ].map((item, index) => (
                            <div
                                key={index}
                                style={{ position: 'relative', height: '400px', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer' }}
                            >
                                <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
                                    <h3 style={{ color: 'white', fontSize: '1.5rem', margin: 0, fontFamily: 'var(--font-display)' }}>{item.title}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Premium Amenities Section */}
            <div className="section-padding" style={{ background: 'var(--card-bg)' }}>
                <div className="container">
                    <div>
                        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontFamily: 'var(--font-display)', marginBottom: '4rem' }}>Uncompromising Standards</h2>
                        <div ref={amenitiesRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', textAlign: 'center' }}>
                            {[
                                { icon: <Shield size={40} />, title: "Verified Properties", desc: "Every location is strictly vetted by our global curators." },
                                { icon: <Clock size={40} />, title: "24/7 Concierge", desc: "Round-the-clock dedicated support for every guest." },
                                { icon: <Coffee size={40} />, title: "Premium Dining", desc: "Access to world-class private chefs and room service." },
                                { icon: <Wifi size={40} />, title: "High-Speed Connect", desc: "Enterprise-grade internet connectivity everywhere." }
                            ].map((feature, idx) => (
                                <div key={idx} style={{ padding: '2rem', background: 'var(--bg-color)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                                    <div style={{ color: 'var(--accent)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>{feature.icon}</div>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>{feature.title}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Final CTA Banner */}
            <div style={{ position: 'relative', padding: '8rem 0', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
                    <img src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=800&auto=format&fit=crop" alt="Luxury Hotel" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3)' }} />
                </div>
                <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <div ref={ctaRef}>
                        <h2 style={{ color: 'white', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontFamily: 'var(--font-display)', marginBottom: '1.5rem' }}>Ready to escape?</h2>
                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>Join thousands of elite travelers who trust LuxeStay for their extraordinary journeys.</p>
                        <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '1.2rem 3rem' }}>Create Free Account</Link>
                    </div>
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

export default Home;
