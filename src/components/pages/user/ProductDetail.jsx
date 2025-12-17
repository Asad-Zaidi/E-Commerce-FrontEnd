// import React, { useEffect, useState, useCallback } from "react";
// // import { useParams, useNavigate } from "react-router-dom"; 
// import { useParams } from "react-router-dom";
// import api from "../../../api/api";
// import "../../../styles/ProductDetail.css";
// import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
// import { Helmet } from "react-helmet-async";

// const renderStars = (rating) => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//         if (rating >= i) stars.push(<FaStar key={i} color="#ffc107" />);
//         else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} color="#ffc107" />);
//         else stars.push(<FaRegStar key={i} color="#ccc" />);
//     }
//     return stars;
// };

// const ProductDetail = () => {
//     const { category, slug } = useParams();
//     // const navigate = useNavigate(); 
//     const [product, setProduct] = useState(null);
//     const [reviews, setReviews] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const [priceType, setPriceType] = useState("privateMonthly");
//     const [currentPrice, setCurrentPrice] = useState(0);

//     const [reviewForm, setReviewForm] = useState({ name: "", comment: "", rating: 0 });

//     const fetchProduct = useCallback(async () => {
//         try {
//             const fullSlug = `${category}/${slug}`;
//             const res = await api.get(`/products/slug/${fullSlug}`);
//             setProduct(res.data);

//             setPriceType("sharedMonthly");
//             setCurrentPrice(res.data.privatePriceMonthly || 0);

//             return res.data._id;
//         } catch (err) {
//             console.error("Error fetching product:", err);
//             setProduct(null);
//             return null;
//         }
//     }, [category, slug]);

//     const fetchReviews = useCallback(async (productId) => {
//         if (!productId) return;
//         try {
//             const res = await api.get(`/reviews/product/${productId}`);
//             setReviews(res.data);
//         } catch (err) {
//             console.error("Error fetching reviews:", err);
//             setReviews([]);
//         }
//     }, []);

//     useEffect(() => {
//         setLoading(true);
//         const load = async () => {
//             const productId = await fetchProduct();
//             await fetchReviews(productId);
//             setLoading(false);
//         };
//         load();
//     }, [fetchProduct, fetchReviews]);

//     const handlePriceChange = (type) => {
//         setPriceType(type);
//         if (!product) return;

//         const priceMap = {
//             privateMonthly: product.privatePriceMonthly,
//             privateYearly: product.privatePriceYearly,
//             sharedMonthly: product.priceSharedMonthly, 
//             sharedYearly: product.priceSharedYearly, 
//         };

//         setCurrentPrice(priceMap[type] || 0);
//     };

    
//     const handleBuyNow = () => {
//         if (!product) return;

//         try {
            
//             const orderDetails = {
//                 productId: product._id,
//                 productName: product.name,
//                 selectedPlan: priceType,
//                 price: currentPrice,
//             };

//             console.log("Order Details:", orderDetails);

            
            

//         } catch (err) {
//             console.error("Error during Buy Now:", err);
//             alert("Something went wrong while processing your order!");
//         }
//     };

//     const handleReviewSubmit = async (e) => {
//         e.preventDefault();
//         if (!product) return;

//         try {
//             const res = await api.post("/reviews", {
//                 productId: product._id,
//                 ...reviewForm,
//             });

//             setReviews((prev) => [res.data, ...prev]);
//             setReviewForm({ name: "", comment: "", rating: 0 });

//             const fullSlug = `${category}/${slug}`;
//             const updatedProduct = await api.get(`/products/slug/${fullSlug}`);
//             setProduct(updatedProduct.data);

//             window.dispatchEvent(new Event("reviewsUpdated"));
//         } catch (err) {
//             console.error("Error posting review:", err);
//         }
//     };

//     if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
//     if (!product) return <p style={{ textAlign: "center" }}>Product not found.</p>;

//     return (
//         <>
//             <Helmet>
//                 <title>{product.name} - Product Details</title>
//                 <meta name="description" content={product.seoDescription || product.description || "Product details page"} />
//             </Helmet>

//             <div className="product-detail-page">
//                 <div className="product-header">
//                     <img src={product.imageUrl} alt={product.name} className="product-image" />
//                     <div className="product-info">
//                         <h1>{product.name}</h1>
//                         <p>{product.description}</p>
//                         {product.seoDescription && (
//                             <div className="seo-description">
//                                 <h3>SEO Optimized Description</h3>
//                                 <p>{product.seoDescription}</p>
//                             </div>
//                         )}

//                         {/* Price Selector */}
//                         <div className="price-selector">
//                             {/* Private */}
//                             <div className="price-group">
//                                 <h4>Private</h4>
//                                 <div className="price-options">
//                                     <button
//                                         className={priceType === "privateMonthly" ? "active" : ""}
//                                         onClick={() => handlePriceChange("privateMonthly")}
//                                     >
//                                         Monthly
//                                     </button>
//                                     <button
//                                         className={priceType === "privateYearly" ? "active" : ""}
//                                         onClick={() => handlePriceChange("privateYearly")}
//                                     >
//                                         Yearly
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* Shared */}
//                             <div className="price-group">
//                                 <h4>Shared</h4>
//                                 <div className="price-options">
//                                     <button
//                                         className={priceType === "sharedMonthly" ? "active" : ""}
//                                         onClick={() => handlePriceChange("sharedMonthly")}
//                                     >
//                                         Monthly
//                                     </button>
//                                     <button
//                                         className={priceType === "sharedYearly" ? "active" : ""}
//                                         onClick={() => handlePriceChange("sharedYearly")}
//                                     >
//                                         Yearly
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>

//                         <h2 className="current-price">Rs. {currentPrice}</h2>

//                         {/* ✅ Updated Buy Now button */}
//                         <button className="buy-btn" onClick={handleBuyNow}>
//                             Buy Now
//                         </button>

//                         {/* Rating */}
//                         <div className="rating-section">
//                             {renderStars(product.avgRating || 0)}
//                             <span className="review-count">({product.totalReviews || 0} Reviews)</span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Reviews Section */}
//                 <div className="reviews-section">
//                     <h2>Customer Reviews</h2>

//                     {/* Review Form */}
//                     <form className="review-form" onSubmit={handleReviewSubmit}>
//                         <input
//                             type="text"
//                             placeholder="Your name"
//                             value={reviewForm.name}
//                             onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
//                             required
//                         />
//                         <textarea
//                             rows="4"
//                             placeholder="Your review"
//                             value={reviewForm.comment}
//                             onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
//                             required
//                         />
//                         <div className="star-rating">
//                             {[1, 2, 3, 4, 5].map((star) => (
//                                 <FaStar
//                                     key={star}
//                                     size={22}
//                                     color={star <= reviewForm.rating ? "#FFD700" : "#ccc"}
//                                     onClick={() => setReviewForm({ ...reviewForm, rating: star })}
//                                     style={{ cursor: "pointer" }}
//                                 />
//                             ))}
//                         </div>
//                         <button type="submit" className="submit-btn">
//                             Submit Review
//                         </button>
//                     </form>

//                     <div className="reviews-list">
//                         {reviews.length === 0 ? (
//                             <p>No reviews yet.</p>
//                         ) : (
//                             reviews.map((rev) => (
//                                 <div key={rev._id} className="review-card">
//                                     <div className="review-header">
//                                         <strong>{rev.name}</strong>
//                                         <div>{renderStars(rev.rating)}</div>
//                                     </div>
//                                     <p>{rev.comment}</p>
//                                     <small>{new Date(rev.createdAt).toLocaleDateString()}</small>
//                                 </div>
//                             ))
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default ProductDetail;

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api/api";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import Breadcrumb from "../../common/Breadcrumb";

const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-400" />);
        else if (rating >= i - 0.5)
            stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
        else stars.push(<FaRegStar key={i} className="text-gray-300" />);
    }
    return stars;
};

const ProductDetail = () => {
    const { category, slug } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const [priceType, setPriceType] = useState("sharedMonthly");
    const [currentPrice, setCurrentPrice] = useState(0);

    const [reviewForm, setReviewForm] = useState({ name: "", comment: "", rating: 0 });

    const fetchProduct = useCallback(async () => {
        try {
            const fullSlug = `${category}/${slug}`;
            const res = await api.get(`/products/slug/${fullSlug}`);
            setProduct(res.data);

            setPriceType("sharedMonthly");
            setCurrentPrice(res.data.priceSharedMonthly || 0);

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
        const load = async () => {
            setLoading(true);
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
            privateMonthly: product.privatePriceMonthly,
            privateYearly: product.privatePriceYearly,
            sharedMonthly: product.priceSharedMonthly,
            sharedYearly: product.priceSharedYearly,
        };

        setCurrentPrice(priceMap[type] || 0);
    };

    const handleBuyNow = () => {
        if (!product) return;

        const orderDetails = {
            productId: product._id,
            productName: product.name,
            selectedPlan: priceType,
            price: currentPrice,
        };

        console.log("Order Details:", orderDetails);
        alert("✅ Order details logged in console!");
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

    if (loading)
        return <p className="text-center py-20 text-gray-500 text-lg">Loading...</p>;
    if (!product)
        return <p className="text-center py-20 text-gray-500 text-lg">Product not found.</p>;

    return (
        <>
            <Helmet>
                <title>{product.metaTitle || `${product.name} - Product Details`}</title>
                <meta
                    name="description"
                    content={product.metaDescription || product.seoDescription || product.description || "Product details"}
                />
                {product.metaKeywords && (
                    <meta name="keywords" content={product.metaKeywords} />
                )}
                <meta property="og:title" content={product.metaTitle || product.name} />
                <meta property="og:description" content={product.metaDescription || product.seoDescription || product.description} />
                <meta property="og:image" content={product.imageUrl} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:type" content="image/jpeg" />
                <meta property="og:url" content={`${window.location.origin}/products/${product.slug}`} />
                <meta property="og:type" content="product" />
                <meta property="og:locale" content="en_US" />
                
                {/* Twitter Card Meta Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={product.metaTitle || product.name} />
                <meta name="twitter:description" content={product.metaDescription || product.seoDescription || product.description} />
                <meta name="twitter:image" content={product.imageUrl} />
                <meta name="twitter:site" content="@yourhandle" />
                
                {/* Canonical URL to prevent duplicate content */}
                <link rel="canonical" href={`${window.location.origin}/products/${product.slug}`} />
                
                {/* Preload Product Image for Performance */}
                <link rel="preload" as="image" href={product.imageUrl} />
                
                {/* Prefetch Related Product Pages */}
                <link rel="prefetch" href={`${window.location.origin}/products`} />
                
                {/* Structured Data (JSON-LD) for Product */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Product",
                        "name": product.name,
                        "description": product.seoDescription || product.description,
                        "image": product.imageUrl,
                        "brand": {
                            "@type": "Brand",
                            "name": product.category || "EDM"
                        },
                        "sku": product._id,
                        "offers": {
                            "@type": "AggregateOffer",
                            "lowPrice": Math.min(
                                product.priceSharedMonthly || Infinity,
                                product.priceSharedYearly || Infinity,
                                product.privatePriceMonthly || Infinity,
                                product.privatePriceYearly || Infinity
                            ),
                            "highPrice": Math.max(
                                product.priceSharedMonthly || 0,
                                product.priceSharedYearly || 0,
                                product.privatePriceMonthly || 0,
                                product.privatePriceYearly || 0
                            ),
                            "priceCurrency": "PKR",
                            "availability": "https://schema.org/InStock"
                        },
                        ...(product.avgRating && {
                            "aggregateRating": {
                                "@type": "AggregateRating",
                                "ratingValue": product.avgRating,
                                "reviewCount": product.totalReviews || 0
                            }
                        })
                    })}
                </script>
                
                {/* BreadcrumbList Schema */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            {
                                "@type": "ListItem",
                                "position": 1,
                                "name": "Home",
                                "item": `${window.location.origin}`
                            },
                            {
                                "@type": "ListItem",
                                "position": 2,
                                "name": "Products",
                                "item": `${window.location.origin}/products`
                            },
                            ...(product.category ? [{
                                "@type": "ListItem",
                                "position": 3,
                                "name": product.category,
                                "item": `${window.location.origin}/products?category=${encodeURIComponent(product.category)}`
                            }] : []),
                            {
                                "@type": "ListItem",
                                "position": product.category ? 4 : 3,
                                "name": product.name,
                                "item": `${window.location.origin}/products/${product.slug}`
                            }
                        ]
                    })}
                </script>
            </Helmet>

            {/* Breadcrumb Navigation */}
            <Breadcrumb category={product.category} productName={product.name} slug={product.slug} />

            <div className="max-w-7xl mx-auto px-4 py-10">
                {/* Product Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Image */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-50 to-white p-4 shadow-xl ring-1 ring-slate-200 dark:from-slate-900 dark:to-slate-950 dark:ring-slate-800">
                        <div className="aspect-square md:aspect-[4/3] w-full overflow-hidden rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center">
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="max-h-full max-w-full object-contain transition-transform duration-500 ease-out hover:scale-[1.02]"
                            />
                        </div>
                        <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)]" />
                    </div>

                    {/* Info */}
                    <div className="space-y-5">
                        <h1 className="text-3xl font-bold">{product.name}</h1>
                        <p className="text-gray-600">{product.description}</p>

                        {/* Price Selector */}
                        <div className="space-y-4">
                            {["Private", "Shared"].map((type) => (
                                <div key={type}>
                                    <h4 className="font-semibold">{type}</h4>
                                    <div className="flex gap-3 mt-2 flex-wrap">
                                        {["Monthly", "Yearly"].map((period) => {
                                            const key = `${type.toLowerCase()}${period}`;
                                            return (
                                                <button
                                                    key={key}
                                                    onClick={() => handlePriceChange(key)}
                                                    className={`px-4 py-2 rounded-lg border ${
                                                        priceType === key
                                                            ? "bg-blue-600 text-white border-blue-600"
                                                            : "hover:bg-gray-100 border-gray-300"
                                                    }`}
                                                >
                                                    {period}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Current Price */}
                        <h2 className="text-3xl font-bold text-green-600">
                            Rs. {currentPrice}
                        </h2>

                        {/* Buy Now */}
                        <button
                            onClick={handleBuyNow}
                            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 text-lg font-semibold"
                        >
                            Buy Now
                        </button>

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                            {renderStars(product.avgRating || 0)}
                            <span className="text-sm text-gray-500">
                                ({product.totalReviews || 0} Reviews)
                            </span>
                        </div>
                    </div>
                </div>

                {/* SEO Description Section */}
                {product.seoDescription && (
                    <div className="mt-16 max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm">
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">Product Overview</h2>
                            <div className="prose prose-lg text-gray-700 leading-relaxed">
                                {product.seoDescription.split('\n\n').map((paragraph, idx) => (
                                    <p key={idx} className="mb-3">{paragraph}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Reviews Section */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

                    {/* Review Form */}
                    <form
                        onSubmit={handleReviewSubmit}
                        className="bg-white p-6 rounded-xl shadow space-y-4 max-w-full"
                    >
                        <input
                            type="text"
                            placeholder="Your name"
                            value={reviewForm.name}
                            onChange={(e) =>
                                setReviewForm({ ...reviewForm, name: e.target.value })
                            }
                            required
                            className="w-full border rounded-lg px-4 py-2"
                        />

                        <textarea
                            rows="4"
                            placeholder="Your review"
                            value={reviewForm.comment}
                            onChange={(e) =>
                                setReviewForm({ ...reviewForm, comment: e.target.value })
                            }
                            required
                            className="w-full border rounded-lg px-4 py-2"
                        />

                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                    key={star}
                                    size={22}
                                    className={`cursor-pointer ${
                                        star <= reviewForm.rating
                                            ? "text-yellow-400"
                                            : "text-gray-300"
                                    }`}
                                    onClick={() =>
                                        setReviewForm({ ...reviewForm, rating: star })
                                    }
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Submit Review
                        </button>
                    </form>

                    {/* Review List */}
                    <div className="mt-10 space-y-4">
                        {reviews.length === 0 ? (
                            <p className="text-gray-500">No reviews yet.</p>
                        ) : (
                            reviews.map((rev) => (
                                <div
                                    key={rev._id}
                                    className="bg-white p-5 rounded-xl shadow"
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <strong>{rev.name}</strong>
                                        <div className="flex">{renderStars(rev.rating)}</div>
                                    </div>
                                    <p className="text-gray-600">{rev.comment}</p>
                                    <small className="text-gray-400">
                                        {new Date(rev.createdAt).toLocaleDateString()}
                                    </small>
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
