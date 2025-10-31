import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import api from "../../api/api";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Helmet } from "react-helmet-async";

const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            stars.push(<FaStar key={i} color="#FFD700" />);
        } else if (rating >= i - 0.5) {
            stars.push(<FaStarHalfAlt key={i} color="#FFD700" />);
        } else {
            stars.push(<FaRegStar key={i} color="#FFD700" />);
        }
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

    //     const fetchPopular = async () => {
    //         try {
    //             const res = await api.get("/products/popular");
    //             setPopularProducts(res.data);
    //         } catch (err) {
    //             console.error("Error fetching popular products:", err);
    //         }
    //     };
    //     fetchPopular();
    // }, []);
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
    }, []);


    const scrollToProducts = () => {
        productsRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = direction === "left" ? -300 : 300;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
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

    return (
        <>
            <Helmet>
                <title>ServiceHub | Smart Digital Tools & Subscription Services</title>
                <meta
                    name="description"
                    content="Discover powerful digital tools and flexible subscription plans at ServiceHub. Simplify your workflow, boost productivity, and manage everything from one smart platform."
                />
                <meta
                    name="keywords"
                    content="ServiceHub, digital tools, online subscriptions, productivity software, SaaS platform, digital services, business tools, subscription plans, workflow automation, online tools"
                />

                <meta property="og:title" content="ServiceHub | Smart Digital Tools & Subscription Services" />
                <meta
                    property="og:description"
                    content="Explore powerful digital tools and flexible subscription plans to simplify your workflow and grow your business."
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://subscription-service-mu.vercel.app/" />
                <meta property="og:image" content="https://subscription-service-mu.vercel.app/assets/preview-image.png" />
                <meta property="og:site_name" content="ServiceHub" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="ServiceHub | Smart Digital Tools & Subscription Services" />
                <meta
                    name="twitter:description"
                    content="Discover powerful digital tools and subscription plans to boost productivity and simplify your work."
                />
                <meta name="twitter:image" content="https://yourwebsite.com/assets/preview-image.jpg" />
                <meta name="twitter:site" content="@ServiceHub" />
            </Helmet>

            <div className="home-page">
                <div className="banner-slider">
                    <Slider {...sliderSettings}>
                        {banners.length > 0 ? (
                            banners.map((banner) => (
                                <div key={banner._id} className="banner-slide">
                                    <img src={banner.imageUrl} alt={banner.title} />
                                    <div className="banner-text">
                                        <h2>{banner.title}</h2>
                                        <p>{banner.subtitle}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="banner-placeholder">
                                <h3>No banners available</h3>
                            </div>
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
                    <button className="cta-btn" onClick={scrollToProducts}>
                        View Plans
                    </button>
                </section>

                <section className="popular-products" ref={productsRef}>
                    <h2>Popular Products</h2>
                    <p>Our most viewed and loved digital services.</p>

                    <div className="scroll-controls">
                        <button className="scroll-btn" onClick={() => scroll("left")}>
                            <FaChevronLeft />
                        </button>

                        <div className="product-scroll-container" ref={scrollRef}>
                            {popularProducts.length > 0 ? (
                                popularProducts.map((p) => (
                                    <div className="product-card" key={p._id}>
                                        <img src={p.imageUrl} alt={p.name} />
                                        <div className="product-info">
                                            <h3>{p.name}</h3>
                                        </div>
                                        <div className="product-rating">
                                            {renderStars(p.avgRating || 0)}
                                            <span className="rating-value">{p.avgRating?.toFixed(1) || "0.0"}</span>
                                        </div>
                                        <Link to={`/products/${p.slug}`} className="detail-btn">
                                            Detail →
                                        </Link>


                                    </div>


                                ))
                            ) : (
                                <p className="no-products">No popular products found.</p>
                            )}
                        </div>

                        <button className="scroll-btn" onClick={() => scroll("right")}>
                            <FaChevronRight />
                        </button>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Home;
