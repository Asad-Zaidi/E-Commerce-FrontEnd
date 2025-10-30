import React, { useEffect, useState, useRef } from "react";
import "../styles/Home.css";
import api from "../../api/api";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

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
                setPopularProducts(res.data);
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
        <div className="home-page">
            {/* 🖼️ Banner Slider */}
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

            {/* 👋 Intro Section */}
            <section className="intro-section">
                <h1>Welcome to Our Digital Services</h1>
                <p>Explore trending subscriptions and tools tailored for you!</p>
            </section>

            {/* 💸 CTA Section */}
            <section className="pricing-cta">
                <h2>Affordable Plans for Everyone</h2>
                <p>Choose from our wide range of digital services.</p>
                <button className="cta-btn" onClick={scrollToProducts}>
                    View Plans
                </button>
            </section>

            {/* 🛍 Popular Products Section */}
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
                                <div className="product-card small" key={p._id}>
                                    <img src={p.imageUrl} alt={p.name} />
                                    <div className="product-info">
                                        <h3>{p.name}</h3>
                                        <span className="price">Rs. {p.priceMonthly}</span>
                                    </div>
                                    <a href={`/products/${p._id}`} className="detail-btn">
                                        Detail →
                                    </a>
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
    );
};

export default Home;
