import React, { useEffect, useState, useCallback } from "react";
// import { useParams, useNavigate } from "react-router-dom"; 
import { useParams } from "react-router-dom";
import api from "../../../api/api";
import "../../../styles/ProductDetail.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
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

const ProductDetail = () => {
    const { category, slug } = useParams();
    // const navigate = useNavigate(); 
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const [priceType, setPriceType] = useState("privateMonthly");
    const [currentPrice, setCurrentPrice] = useState(0);

    const [reviewForm, setReviewForm] = useState({ name: "", comment: "", rating: 0 });

    const fetchProduct = useCallback(async () => {
        try {
            const fullSlug = `${category}/${slug}`;
            const res = await api.get(`/products/slug/${fullSlug}`);
            setProduct(res.data);

            setPriceType("sharedMonthly");
            setCurrentPrice(res.data.priceShared || 0);

            return res.data._id;
        } catch (err) {
            console.error("Error fetching product:", err);
            setProduct(null);
            return null;
        }
    }, [category, slug]);

    const fetchReviews = useCallback(async (productId) => {
        if (!productId) return;
        try {
            const res = await api.get(`/reviews/product/${productId}`);
            setReviews(res.data);
        } catch (err) {
            console.error("Error fetching reviews:", err);
            setReviews([]);
        }
    }, []);

    useEffect(() => {
        setLoading(true);
        const load = async () => {
            const productId = await fetchProduct();
            await fetchReviews(productId);
            setLoading(false);
        };
        load();
    }, [fetchProduct, fetchReviews]);

    const handlePriceChange = (type) => {
        setPriceType(type);
        if (!product) return;

        const priceMap = {
            privateMonthly: product.priceMonthly,
            privateYearly: product.priceYearly,
            sharedMonthly: product.priceShared, 
            sharedYearly: product.pricePrivate, 
        };

        setCurrentPrice(priceMap[type] || 0);
    };

    
    const handleBuyNow = () => {
        if (!product) return;

        try {
            
            const orderDetails = {
                productId: product._id,
                productName: product.name,
                selectedPlan: priceType,
                price: currentPrice,
            };

            console.log("Order Details:", orderDetails);

            
            

        } catch (err) {
            console.error("Error during Buy Now:", err);
            alert("Something went wrong while processing your order!");
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!product) return;

        try {
            const res = await api.post("/reviews", {
                productId: product._id,
                ...reviewForm,
            });

            setReviews((prev) => [res.data, ...prev]);
            setReviewForm({ name: "", comment: "", rating: 0 });

            const fullSlug = `${category}/${slug}`;
            const updatedProduct = await api.get(`/products/slug/${fullSlug}`);
            setProduct(updatedProduct.data);

            window.dispatchEvent(new Event("reviewsUpdated"));
        } catch (err) {
            console.error("Error posting review:", err);
        }
    };

    if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
    if (!product) return <p style={{ textAlign: "center" }}>Product not found.</p>;

    return (
        <>
            <Helmet>
                <title>{product.name} - Product Details</title>
                <meta name="description" content={product.description || "Product details page"} />
            </Helmet>

            <div className="product-detail-page">
                <div className="product-header">
                    <img src={product.imageUrl} alt={product.name} className="product-image" />
                    <div className="product-info">
                        <h1>{product.name}</h1>
                        <p>{product.description}</p>

                        {/* Price Selector */}
                        <div className="price-selector">
                            {/* Private */}
                            <div className="price-group">
                                <h4>Private</h4>
                                <div className="price-options">
                                    <button
                                        className={priceType === "privateMonthly" ? "active" : ""}
                                        onClick={() => handlePriceChange("privateMonthly")}
                                    >
                                        Monthly
                                    </button>
                                    <button
                                        className={priceType === "privateYearly" ? "active" : ""}
                                        onClick={() => handlePriceChange("privateYearly")}
                                    >
                                        Yearly
                                    </button>
                                </div>
                            </div>

                            {/* Shared */}
                            <div className="price-group">
                                <h4>Shared</h4>
                                <div className="price-options">
                                    <button
                                        className={priceType === "sharedMonthly" ? "active" : ""}
                                        onClick={() => handlePriceChange("sharedMonthly")}
                                    >
                                        Monthly
                                    </button>
                                    <button
                                        className={priceType === "sharedYearly" ? "active" : ""}
                                        onClick={() => handlePriceChange("sharedYearly")}
                                    >
                                        Yearly
                                    </button>
                                </div>
                            </div>
                        </div>

                        <h2 className="current-price">Rs. {currentPrice}</h2>

                        {/* ✅ Updated Buy Now button */}
                        <button className="buy-btn" onClick={handleBuyNow}>
                            Buy Now
                        </button>

                        {/* Rating */}
                        <div className="rating-section">
                            {renderStars(product.avgRating || 0)}
                            <span className="review-count">({product.totalReviews || 0} Reviews)</span>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="reviews-section">
                    <h2>Customer Reviews</h2>

                    {/* Review Form */}
                    <form className="review-form" onSubmit={handleReviewSubmit}>
                        <input
                            type="text"
                            placeholder="Your name"
                            value={reviewForm.name}
                            onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                            required
                        />
                        <textarea
                            rows="4"
                            placeholder="Your review"
                            value={reviewForm.comment}
                            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                            required
                        />
                        <div className="star-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                    key={star}
                                    size={22}
                                    color={star <= reviewForm.rating ? "#FFD700" : "#ccc"}
                                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                    style={{ cursor: "pointer" }}
                                />
                            ))}
                        </div>
                        <button type="submit" className="submit-btn">
                            Submit Review
                        </button>
                    </form>

                    <div className="reviews-list">
                        {reviews.length === 0 ? (
                            <p>No reviews yet.</p>
                        ) : (
                            reviews.map((rev) => (
                                <div key={rev._id} className="review-card">
                                    <div className="review-header">
                                        <strong>{rev.name}</strong>
                                        <div>{renderStars(rev.rating)}</div>
                                    </div>
                                    <p>{rev.comment}</p>
                                    <small>{new Date(rev.createdAt).toLocaleDateString()}</small>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetail;
