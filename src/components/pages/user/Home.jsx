import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../../../api/api";
import Slider from "react-slick";
import { motion } from "framer-motion";
import OrganizationSchema from "../../SEO/OrganizationSchema";
import SEO from "../../SEO.jsx";
import seoData from "../../../seoData";
import {
    FaChevronLeft,
    FaChevronRight,
    FaStar,
    FaStarHalfAlt,
    FaRegStar,
    FaTrophy,
    FaClock,
} from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

/* ---------------- Helpers ---------------- */
const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-400" />);
        else if (rating >= i - 0.5)
            stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
        else stars.push(<FaRegStar key={i} className="text-yellow-400" />);
    }
    return stars;
};

const SkeletonCard = () => (
    <div className="w-72 flex-shrink-0 rounded-2xl bg-white dark:bg-zinc-900 shadow animate-pulse p-4">
        <div className="h-40 bg-zinc-200 dark:bg-zinc-800 rounded-xl mb-4" />
        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4 mb-2" />
        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2 mb-4" />
        <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
    </div>
);

/* ---------------- Component ---------------- */
export default function Home() {
    const [banners, setBanners] = useState([]);
    const [popularProducts, setPopularProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [stats, setStats] = useState({ totalProducts: 0, avgRating: 0 });
    const [intro, setIntro] = useState({
        title: "One Platform. Unlimited Digital Power.",
        subtitle: "Discover, subscribe, and manage the best digital tools — all from a single dashboard."
    });

    const scrollRef = useRef(null);
    const bannerRef = useRef(null);

    useEffect(() => {
        api.get("/banners/active").then((res) => setBanners(res.data));
        api.get("/home").then((res) => {
            if (res.data?.intro) setIntro(res.data.intro);
        }).catch(() => console.log("Using default intro"));
    }, []);

    useEffect(() => {
        const fetchPopular = async () => {
            setLoadingProducts(true);
            const res = await api.get("/products/popular");
            const sorted = res.data.sort(
                (a, b) => (b.avgRating || 0) - (a.avgRating || 0)
            );
            setPopularProducts(sorted);
            setLoadingProducts(false);
        };
        fetchPopular();
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get("/products");
                const products = res.data;
                const totalProducts = products.length;
                const avgRating = products.reduce((sum, p) => sum + (p.avgRating || 0), 0) / totalProducts || 0;
                setStats({ totalProducts, avgRating });
            } catch (err) {
                console.error("Error fetching stats:", err);
            }
        };
        fetchStats();
    }, []);

    const scroll = (dir) => {
        if (!scrollRef.current) return;
        const card = scrollRef.current.firstChild;
        if (!card) return;
        const gap = 24;
        const width = card.offsetWidth + gap;
        scrollRef.current.scrollBy({
            left: dir === "left" ? -width : width,
            behavior: "smooth",
        });
    };

    const sliderSettings = {
        dots: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
    };

    const scrollBanner = (dir) => {
        if (bannerRef.current) {
            dir === "left" ? bannerRef.current.slickPrev() : bannerRef.current.slickNext();
        }
    };

    const trustIndicators = [
        { icon: <FaTrophy />, label: "Products", value: `${stats.totalProducts}` },
        { icon: <FaStar />, label: "Avg Rating", value: `${stats.avgRating.toFixed(1)}★` },
        { icon: <FaClock />, label: "Support", value: "24/7" },
    ];

    return (
        <>
            <OrganizationSchema />
            <SEO {...seoData.home} />

            <div className="bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100">
                {/* ---------------- Hero / Banner ---------------- */}
                <section className="max-w-7xl mx-auto px-4 pt-6">
                    <div className="relative">
                        {/* Left Banner Chevron */}
                        <button
                            onClick={() => scrollBanner("left")}
                            className="hidden sm:flex items-center justify-center absolute -left-16 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 shadow-lg hover:shadow-xl transition"
                            aria-label="Previous banner"
                        >
                            <FaChevronLeft className="text-zinc-900 dark:text-white" />
                        </button>

                        {/* Right Banner Chevron */}
                        <button
                            onClick={() => scrollBanner("right")}
                            className="hidden sm:flex items-center justify-center absolute -right-16 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 shadow-lg hover:shadow-xl transition"
                            aria-label="Next banner"
                        >
                            <FaChevronRight className="text-zinc-900 dark:text-white" />
                        </button>

                        <Slider ref={bannerRef} {...sliderSettings}>
                            {banners.map((b) => (
                            <div key={b._id} className="relative">
                                <img
                                    src={b.imageUrl}
                                    alt={`${b.title} - Featured banner for digital subscriptions`}
                                    loading="lazy"
                                    className="w-full h-[450px] object-cover rounded-3xl"
                                />
                                <div className="absolute inset-0 bg-black/40 rounded-3xl flex items-center">
                                    <div className="px-8 max-w-xl">
                                        <h1 className="text-4xl font-bold text-white mb-3">
                                            {b.title}
                                        </h1>
                                        <p className="text-white/90 mb-6">{b.subtitle}</p>
                                        
                                    </div>
                                </div>
                            </div>
                        ))}
                        </Slider>
                    </div>
                </section>

                {/* ---------------- Intro Section ---------------- */}
                <section className="text-center py-20 px-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl font-extrabold mb-4"
                    >
                        {intro.title}
                    </motion.h2>
                    <p className="max-w-2xl mx-auto text-zinc-600 dark:text-zinc-400 mb-8">
                        {intro.subtitle}
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            to="/register"
                            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-semibold"
                        >
                            Get Started Free
                        </Link>
                        <Link
                            to="/products"
                            className="border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-4 rounded-xl font-semibold"
                        >
                            View Products
                        </Link>
                    </div>
                </section>

                {/* ---------------- Popular Products ---------------- */}
                <section id="products" className="max-w-7xl mx-auto px-4 py-16">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold">Popular Products</h2>
                            <p className="text-zinc-500">Most loved by our users</p>
                        </div>
                        {/* Chevron buttons moved to edges of the scroller below */}
                    </div>

                    <div className="relative">
                        {/* Left Chevron near container edge */}
                        <button
                            onClick={() => scroll("left")}
                            className="hidden sm:flex items-center justify-center absolute -left-20 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 shadow hover:shadow-lg transition"
                            aria-label="Scroll left"
                        >
                            <FaChevronLeft className="text-zinc-900 dark:text-white" />
                        </button>

                        {/* Right Chevron near container edge */}
                        <button
                            onClick={() => scroll("right")}
                            className="hidden sm:flex items-center justify-center absolute -right-20 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 shadow hover:shadow-lg transition"
                            aria-label="Scroll right"
                        >
                            <FaChevronRight className="text-zinc-900 dark:text-white" />
                        </button>

                        {/* Scroller with scrollbars hidden */}
                        <div
                            ref={scrollRef}
                            className="flex gap-6 overflow-x-auto overflow-y-hidden scrollbar-hide [scrollbar-width:none] px-[60px]"
                        >
                            {loadingProducts
                                ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
                                : popularProducts.map((p) => (
                                    <motion.div
                                        key={p._id}
                                        whileHover={{ y: -6 }}
                                        className="w-72 flex-shrink-0"
                                    >
                                        <Link
                                            to={`/products/${p.category
                                                .toLowerCase()
                                                .replace(/\W+/g, "-")}/${p.name
                                                    .toLowerCase()
                                                    .replace(/\W+/g, "-")}`}
                                            className="block bg-white dark:bg-zinc-900 rounded-2xl shadow hover:shadow-xl transition overflow-hidden"
                                        >
                                            <img
                                                src={p.imageUrl}
                                                alt={`${p.name} - Best ${p.category} subscription service`}
                                                loading="lazy"
                                                className="h-40 w-full object-contain bg-white"
                                            />
                                            <div className="p-4 h-60">
                                                <span className="text-xs text-purple-600 font-semibold">
                                                    {p.category}
                                                </span>
                                                <h3 className="font-semibold text-lg mt-1 line-clamp-1">
                                                    {p.name}
                                                </h3>
                                                <p className="text-purple-600 font-bold mt-2">
                                                    {p.priceSharedMonthly?.toFixed(2) || "N/A"} Rs. / month
                                                </p>
                                                <div className="flex items-center gap-1 mt-2">
                                                    {renderStars(p.avgRating || 0)}
                                                    <span className="text-sm text-zinc-500 ml-1">
                                                        {p.avgRating?.toFixed(1) || "0.0"}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                        </div>
                    </div>
                </section>

                {/* ---------------- Trust Indicators ---------------- */}
                <section className="bg-white dark:bg-zinc-950 py-20">
                    <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
                        {trustIndicators.map((t, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                className="p-6 rounded-2xl shadow bg-zinc-50 dark:bg-zinc-900"
                            >
                                <div className="text-3xl text-purple-600 mb-3 flex justify-center">
                                    {t.icon}
                                </div>
                                <h3 className="text-2xl font-bold">{t.value}</h3>
                                <p className="text-zinc-500">{t.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}
