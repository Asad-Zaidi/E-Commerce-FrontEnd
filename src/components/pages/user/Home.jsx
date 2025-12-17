import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "../../../styles/Home.css";
import ProductCard from "../../cards/ProductCard.jsx";
import api from "../../../api/api";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight, FaStar, FaStarHalfAlt, FaRegStar, FaUsers, FaTrophy, FaClock } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import OrganizationSchema from "../../SEO/OrganizationSchema";

const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) stars.push(<FaStar key={i} color="#FFD700" />);
        else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} color="#FFD700" />);
        else stars.push(<FaRegStar key={i} color="#FFD700" />);
    }
    return stars;
};

const Home = () => {
    const [banners, setBanners] = useState([]);
    const [popularProducts, setPopularProducts] = useState([]);
    const productsRef = useRef(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await api.get("/banners/active");
                setBanners(res.data);
            } catch (err) {
                console.error("Error fetching banners:", err);
            }
        };
        fetchBanners();
    }, []);

    useEffect(() => {
        const fetchPopular = async () => {
            try {
                const res = await api.get("/products/popular");
                const sorted = res.data.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
                setPopularProducts(sorted);
            } catch (err) {
                console.error("Error fetching popular products:", err);
            }
        };
        fetchPopular();
        fetchPopular();
    }, []);

    const scrollToProducts = () => {
    };

    const scroll = (direction, ref) => {
        if (ref.current && ref.current.firstChild) {
            const style = window.getComputedStyle(ref.current.firstChild);
            const gap = parseInt(style.marginRight) || 20;
            const cardWidth = ref.current.firstChild.offsetWidth + gap;
            const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
            ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    const sliderSettings = {
        dots: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        pauseOnHover: true,
    };

    const trustIndicators = [
        { icon: <FaUsers />, label: "Active Users", value: "50K+" },
        { icon: <FaTrophy />, label: "Products", value: "500+" },
        { icon: <FaStar />, label: "Avg Rating", value: "4.8★" },
        { icon: <FaClock />, label: "Support", value: "24/7" }
    ];

    const testimonials = [
        { id: 1, name: "Sarah Johnson", title: "Business Owner", text: "ServiceHub has revolutionized how I manage my digital subscriptions. The interface is intuitive and the support team is always ready to help!", avatar: "👩‍💼" },
        { id: 2, name: "Michael Chen", title: "Freelancer", text: "Best platform for managing multiple tools in one place. Saved me hours every week. Highly recommended!", avatar: "👨‍💻" },
        { id: 3, name: "Emma Davis", title: "Startup Founder", text: "The analytics and reporting features are incredible. We've optimized our workflow significantly with ServiceHub.", avatar: "👩‍🔬" },
        { id: 4, name: "John Smith", title: "Consultant", text: "Excellent platform with competitive pricing. Customer service is responsive and helpful. A game-changer for our business!", avatar: "👨‍💼" }
    ];

    return (
        <>
            <OrganizationSchema />
            <Helmet>
                <title>ServiceHub | Smart Digital Tools & Subscription Services</title>
                <meta name="description" content="Discover powerful digital tools and flexible subscription plans at ServiceHub. Simplify your workflow, boost productivity, and manage everything from one smart platform." />
                <meta name="keywords" content="ServiceHub, digital tools, online subscriptions, productivity software, SaaS platform, digital services, business tools, subscription plans, workflow automation, online tools" />
                <meta property="og:title" content="ServiceHub | Smart Digital Tools & Subscription Services" />
                <meta property="og:description" content="Explore powerful digital tools and flexible subscription plans to simplify your workflow and grow your business." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://subscription-service-mu.vercel.app/" />
                <meta property="og:image" content="https://subscription-service-mu.vercel.app/assets/preview-image.png" />
                <meta property="og:site_name" content="ServiceHub" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="ServiceHub | Smart Digital Tools & Subscription Services" />
                <meta name="twitter:description" content="Discover powerful digital tools and subscription plans to boost productivity and simplify your work." />
                <meta name="twitter:image" content="https://yourwebsite.com/assets/preview-image.jpg" />
                <meta name="twitter:site" content="@ServiceHub" />
            </Helmet>

            <div className="home-page">
                <div className="banner-slider">
                    <Slider {...sliderSettings}>
                        {banners.length > 0 ? banners.map(b => (
                            <div key={b._id} className="banner-slide">
                                <img src={b.imageUrl} alt={b.title} />
                                <div className="banner-text">
                                    <h2>{b.title}</h2>
                                    <p>{b.subtitle}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="banner-placeholder"><h3>No banners available</h3></div>
                        )}
                    </Slider>
                </div>

                <section className="intro-section">
                    <h1>ServiceHub - Smart Digital Tools & Subscription Services</h1>
                    <p>Explore trending subscriptions and tools tailored for you!</p>
                </section>

                <section className="pricing-cta">
                    <h2>Affordable Plans for Everyone</h2>
                    <p>Choose from our wide range of digital services.</p>
                    <button className="cta-btn" onClick={scrollToProducts}>View Plans</button>
                </section>

                <section className="popular-products" ref={productsRef}>
                    <h2>Popular Products</h2>
                    <p>Our most viewed and loved digital services.</p>

                    <div className="scroll-controls">
                        <button className="scroll-btn" onClick={() => scroll("left", scrollRef)}><FaChevronLeft /></button>

                        <div className="product-scroll-container" ref={scrollRef}>
                            {popularProducts.length > 0 ? popularProducts.map(p => (
                                <Link
                                    to={`/products/${p.category.toLowerCase().replace(/[\s\W-]+/g, '-')}/${p.name.toLowerCase().replace(/[\s\W-]+/g, '-')}`}
                                    className="product-card-link"
                                    key={p._id}
                                >
                                    <ProductCard product={p} />
                                </Link>
                            )) : <p className="no-products">No popular products found.</p>}
                        </div>

                        <button className="scroll-btn" onClick={() => scroll("right", scrollRef)}><FaChevronRight /></button>
                    </div>
                </section>

                <section className="trust-indicators">
                    <div className="section-header">
                        <h2>Why Trust ServiceHub?</h2>
                        <p>Industry-leading metrics and commitment to excellence</p>
                    </div>

                    <div className="indicators-grid">
                        {trustIndicators.map((indicator, idx) => (
                            <div className="indicator-card" key={idx}>
                                <div className="indicator-icon">{indicator.icon}</div>
                                <h3>{indicator.value}</h3>
                                <p>{indicator.label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="testimonials">
                    <div className="section-header">
                        <h2>Customer Reviews & Feedback</h2>
                        <p>See what our happy customers have to say</p>
                    </div>

                    <div className="testimonials-grid">
                        {testimonials.map(t => (
                            <div className="testimonial-card" key={t.id}>
                                <div className="testimonial-header">
                                    <div className="avatar">{t.avatar}</div>
                                    <div className="author-info">
                                        <h4>{t.name}</h4>
                                        <p className="title">{t.title}</p>
                                    </div>
                                </div>
                                <div className="stars">{renderStars(5)}</div>
                                <p className="testimonial-text">{t.text}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
};

export default Home;  