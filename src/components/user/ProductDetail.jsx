import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";
import "../styles/ProductDetail.css";
import { FaStar } from "react-icons/fa";

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [priceType, setPriceType] = useState("monthly");
    const [currentPrice, setCurrentPrice] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [reviewForm, setReviewForm] = useState({ name: "", comment: "", rating: 0 });

    // Fetch Product
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data);
                setCurrentPrice(res.data.priceMonthly || 0);
            } catch (err) {
                console.error("Error fetching product:", err);
            }
        };
        fetchProduct();
    }, [id]);

    // Fetch Reviews
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await api.get(`/reviews/${id}`);
                setReviews(res.data);
            } catch (err) {
                console.error("Error fetching reviews:", err);
            }
        };
        fetchReviews();
    }, [id]);

    // Handle review form submission
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/reviews", {
                productId: id,
                ...reviewForm,
            });
            // setReviews([res.data, ...reviews]); // ✅ Now will include name/comment
            // setReviewForm({ name: "", comment: "", rating: 0 });

            // // Optionally refetch product for updated avg rating
            // const refreshed = await api.get(`/products/${id}`);
            // setProduct(refreshed.data);
            setReviews((prev) => [res.data, ...prev]);
            setReviewForm({ name: "", comment: "", rating: 0 });

            // Refetch updated product stats (avgRating, totalReviews)
            const updatedProduct = await api.get(`/products/${id}`);
            setProduct(updatedProduct.data);

            // Optional: trigger a global event to refresh Product.jsx list too
            window.dispatchEvent(new Event("reviewsUpdated"));


        } catch (err) {
            console.error("Error posting review:", err);
        }
    };


    if (!product) return <p style={{ textAlign: "center" }}>Loading...</p>;

    // Handle price type change
    const handlePriceChange = (type) => {
        setPriceType(type);
        const priceMap = {
            monthly: product.priceMonthly,
            yearly: product.priceYearly,
            shared: product.priceShared,
            private: product.pricePrivate,
        };
        setCurrentPrice(priceMap[type] || 0);
    };

    return (
        <div className="product-detail">
            <div className="product-info">
                <img src={product.imageUrl} alt={product.name} />
                <div className="info">
                    <h1>{product.name}</h1>
                    <p className="desc">{product.description}</p>

                    {/* Price Selector */}
                    <div className="tag-group" style={{ marginBottom: "10px" }}>
                        {["monthly", "yearly", "shared", "private"].map((type) => (
                            <span
                                key={type}
                                className={`tag ${priceType === type ? "active" : ""}`}
                                onClick={() => handlePriceChange(type)}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </span>
                        ))}
                    </div>

                    <h2 style={{ color: "var(--primary-color)" }}>Rs. {currentPrice}</h2>

                    <button className="buy-btn">Buy Now</button>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="review-section">
                <h3>Customer Reviews</h3>

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

                    {/* Star Rating */}
                    <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                                key={star}
                                size={22}
                                color={star <= reviewForm.rating ? "#FFD700" : "#ccc"}
                                onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            />
                        ))}
                    </div>

                    <button type="submit" className="submit-btn">
                        Submit Review
                    </button>
                </form>

                {/* Reviews List */}
                <div className="reviews-list">
                    {reviews.map((r) => (
                        <div key={r._id} className="review-card">
                            <div className="review-header">
                                <strong>{r.name}</strong>
                                <div>
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} size={14} color={i < r.rating ? "#FFD700" : "#ccc"} />
                                    ))}
                                </div>
                            </div>
                            <p className="review-comment">{r.comment}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
