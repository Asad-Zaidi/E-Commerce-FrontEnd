import React, { useState, useEffect } from "react";
import "../styles/Product.css";
import api from "../../api/api";

const Product = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [whatsappNumber, setWhatsappNumber] = useState("");

    const categories = ["All", "Entertainment", "AI Tools", "Education", "Social Media"];

    // ✅ Fetch products from backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get("/products");
                setProducts(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load products. Please try again later.");
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // ✅ Fetch WhatsApp number from DB (contact info)
    useEffect(() => {
        const fetchWhatsApp = async () => {
            try {
                const res = await api.get("/contact");
                if (res.data?.whatsappNumber) {
                    setWhatsappNumber(res.data.whatsappNumber);
                }
            } catch (err) {
                console.error("Error fetching WhatsApp number:", err);
            }
        };
        fetchWhatsApp();
    }, []);

    // ✅ Filter by category
    const filteredProducts =
        selectedCategory === "All"
            ? products
            : products.filter((p) => p.category === selectedCategory);

    if (loading) {
        return (
            <div className="product-page">
                <h2 style={{ textAlign: "center", color: "#135bec" }}>Loading products...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="product-page">
                <h2 style={{ textAlign: "center", color: "red" }}>{error}</h2>
            </div>
        );
    }

    return (
        <div className="product-page">
            <header className="product-header">
                <h1>Our Products</h1>
                <p>
                    Explore our wide range of digital subscriptions — from entertainment to
                    AI tools, education, and social media.
                </p>
            </header>

            {/* Category Filter */}
            <div className="filter-bar">
                {categories.map((cat) => (
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
                    <p style={{ textAlign: "center", color: "#666" }}>No products found.</p>
                ) : (
                    filteredProducts.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            whatsappNumber={whatsappNumber}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

// ✅ Individual Product Card
const ProductCard = ({ product, whatsappNumber }) => {
    const [plan, setPlan] = useState("Monthly");
    const [type, setType] = useState("Private");

    // ✅ Price logic
    const getPrice = () => {
        let price = plan === "Yearly" ? product.priceYearly : product.priceMonthly;
        if (!price) return "N/A"; // if price not set
        if (type === "Shared") price *= 0.8;
        return Math.round(price);
    };

    // ✅ WhatsApp integration
    const handleBuyNow = () => {
        if (!whatsappNumber) {
            alert("WhatsApp number not available yet.");
            return;
        }

        const message = `Hello! I'm interested in buying *${product.name}* (${plan}, ${type}) plan. Could you please share more details?`;
        const encodedMsg = encodeURIComponent(message);
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMsg}`, "_blank");
    };

    return (
        <div className="modern-product-card">
            <div className="card-top">
                <img src={product.imageUrl} alt={product.name} />
            </div>

            <div className="card-content">
                <div className="card-header">
                    <h3>{product.name}</h3>
                    <div className="price-tags">
                        <span className="price">Rs: {getPrice()}</span>

                        <div className="tag-group">
                            <span
                                className={`tag ${plan === "Monthly" ? "active" : ""}`}
                                onClick={() => setPlan("Monthly")}
                            >
                                Monthly
                            </span>
                            <span
                                className={`tag ${plan === "Yearly" ? "active" : ""}`}
                                onClick={() => setPlan("Yearly")}
                            >
                                Yearly
                            </span>

                            <span
                                className={`tag ${type === "Private" ? "active" : ""}`}
                                onClick={() => setType("Private")}
                            >
                                Private
                            </span>
                            <span
                                className={`tag ${type === "Shared" ? "active" : ""}`}
                                onClick={() => setType("Shared")}
                            >
                                Shared
                            </span>
                        </div>
                    </div>
                </div>

                <p className="desc">{product.description}</p>

                <a href={`/products/${product._id}`} className="more-detail">
                    More Detail →
                </a>

                <div className="buy-center">
                    <button className="buy-now" onClick={handleBuyNow}>
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Product;
