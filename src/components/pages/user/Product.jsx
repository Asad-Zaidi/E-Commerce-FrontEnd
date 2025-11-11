import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../../api/api";
import "../../../styles/Product.css";
import { FaSearch, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Helmet } from "react-helmet-async";

const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) stars.push(<FaStar key={i} color="#ffc107" />);
        else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} color="#ffc107" />);
        else stars.push(<FaRegStar key={i} color="#ccc" />);
    }
    return stars;
};

const Product = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const fetchProductsAndCategories = async () => {
        try {
            const res = await api.get("/products");
            setProducts(res.data);

            const catRes = await api.get("/categories");
            const categoryNames = ["All", ...catRes.data.map(cat => cat.name)];
            setCategories(categoryNames);
        } catch (err) {
            console.error("Error fetching products or categories:", err);
        }
    };

    useEffect(() => {
        fetchProductsAndCategories();
        const interval = setInterval(fetchProductsAndCategories, 10000);
        return () => clearInterval(interval);
    }, []);

    const filteredProducts = products
        .filter(p => selectedCategory === "All" || p.category === selectedCategory)
        .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <>
            <Helmet>
                <title>Products - Social Media Services</title>
                <meta name="description" content="Browse our range of powerful digital tools and flexible subscription plans tailored to your business and your needs." />
            </Helmet>

            <div className="product-page">
                {/* Search Bar */}
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && console.log("Searching for:", searchTerm)}
                    />
                    <FaSearch
                        className="search-icon"
                        onClick={() => console.log("Searching for:", searchTerm)}
                    />
                </div>

                <div className="product-header">
                    <h1>Our Products</h1>
                    <p>Explore the best services and packages tailored to your needs.</p>
                </div>

                {/* Filter Buttons */}
                <div className="filter-bar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`filter-btn ${selectedCategory === cat ? "active" : ""}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Product Cards */}
                <div className="product-grid">
                    {filteredProducts.length === 0 ? (
                        <p className="no-products">⚠️ No products available in this category.</p>
                    ) : (
                        filteredProducts.map(product => (
                            <div className="modern-product-card" key={product._id}>
                                <div className="card-top">
                                    <Link to={`/products/${product.category.toLowerCase().replace(/[\s\W-]+/g, '-')}/${product.name.toLowerCase().replace(/[\s\W-]+/g, '-')}`}>
                                        <img src={product.imageUrl} alt={product.name} />
                                    </Link>
                                </div>

                                <div className="card-content">
                                    <div className="card-header">
                                        <h3>
                                            {searchTerm ? (
                                                <>
                                                    {product.name.split(new RegExp(`(${searchTerm})`, "gi")).map((part, i) =>
                                                        part.toLowerCase() === searchTerm.toLowerCase() ? (
                                                            <span key={i} style={{ backgroundColor: "#fffa91" }}>{part}</span>
                                                        ) : (
                                                            part
                                                        )
                                                    )}
                                                </>
                                            ) : (
                                                product.name
                                            )}
                                        </h3>

                                        <div className="price-tags">
                                            <span className="price">Rs. {product.priceMonthly || 0}</span>
                                        </div>
                                    </div>

                                    <div className="rating-section">
                                        {renderStars(product.avgRating || 0)}
                                        <span className="review-count">({product.totalReviews || 0})</span>
                                    </div>

                                    <Link to={`/products/${product.category.toLowerCase().replace(/[\s\W-]+/g, '-')}/${product.name.toLowerCase().replace(/[\s\W-]+/g, '-')}`} className="more-detail">
                                        Show Details →
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default Product;
