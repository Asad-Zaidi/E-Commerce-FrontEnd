import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";
import "../styles/ProductDetail.css";
import { FaStar } from "react-icons/fa";

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [username, setUsername] = useState("");
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(true);

    // Fetch product + reviews
    useEffect(() => {
        const fetchData = async () => {
            try {
                const prodRes = await api.get(`/products/${id}`);
                setProduct(prodRes.data);

                const revRes = await api.get(`/reviews/${id}`);
                setReviews(revRes.data);
            } catch (err) {
                console.error("Error fetching product details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // Submit new review
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!rating) return alert("Please select a rating.");

        try {
            const res = await api.post("/reviews", {
                productId: id,
                username: username || "Anonymous",
                rating,
                comment,
            });

            setReviews([res.data, ...reviews]); // instantly show new review
            setRating(0);
            setComment("");
            setUsername("");
        } catch (err) {
            console.error("Error submitting review:", err);
        }
    };

    if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
    if (!product) return <h2 style={{ textAlign: "center" }}>Product not found.</h2>;

    return (
        <div className="product-detail">
            <div className="product-info">
                <img src={product.imageUrl} alt={product.name} />
                <div className="info">
                    <h1>{product.name}</h1>
                    <p className="desc">{product.description}</p>

                    <div className="price-section">
                        {product.priceMonthly && <p><strong>Monthly:</strong> Rs {product.priceMonthly}</p>}
                        {product.priceYearly && <p><strong>Yearly:</strong> Rs {product.priceYearly}</p>}
                    </div>

                    <p><strong>Category:</strong> {product.category}</p>
                    <button className="buy-btn">Buy Now</button>
                </div>
            </div>

            <div className="review-section">
                <h2>Customer Reviews</h2>

                {/* Review Form */}
                <form onSubmit={handleReviewSubmit} className="review-form">
                    <input
                        type="text"
                        placeholder="Your name (optional)"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                                key={star}
                                size={22}
                                color={star <= rating ? "#ffc107" : "#e4e5e9"}
                                onClick={() => setRating(star)}
                                className="star"
                            />
                        ))}
                    </div>
                    <textarea
                        placeholder="Write your review..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows="4"
                    ></textarea>
                    <button type="submit" className="submit-btn">Submit Review</button>
                </form>

                {/* Review List */}
                <div className="reviews-list">
                    {reviews.length === 0 ? (
                        <p>No reviews yet. Be the first to review!</p>
                    ) : (
                        reviews.map((r) => (
                            <div key={r._id} className="review-card">
                                <div className="review-header">
                                    <h4>{r.username}</h4>
                                    <div className="stars">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <FaStar
                                                key={star}
                                                size={16}
                                                color={star <= r.rating ? "#ffc107" : "#e4e5e9"}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="review-comment">{r.comment}</p>
                                <small>{new Date(r.createdAt).toLocaleDateString()}</small>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
