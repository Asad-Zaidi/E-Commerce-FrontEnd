import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import { FaStar, FaStarHalfAlt, FaRegStar, FaCheckCircle, FaShieldAlt, FaClock, FaHeadset, FaSync, FaLock, FaCheck } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import Breadcrumb from "../../components/common/Breadcrumb";
import { toast } from "react-toastify";
import { useUser } from "../../context/UserContext";
import "react-toastify/dist/ReactToastify.css";

const renderStars = (rating, size = "text-base") => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) stars.push(<FaStar key={i} className={`text-yellow-400 ${size}`} />);
        else if (rating >= i - 0.5)
            stars.push(<FaStarHalfAlt key={i} className={`text-yellow-400 ${size}`} />);
        else stars.push(<FaRegStar key={i} className={`text-gray-600 ${size}`} />);
    }
    return stars;
};

const ProductDetail = () => {
    const { category, slug } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useUser();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [priceType, setPriceType] = useState("sharedMonthly");
    const [currentPrice, setCurrentPrice] = useState(0);
    const [accessType, setAccessType] = useState("shared");
    const [billingPeriod, setBillingPeriod] = useState("monthly");
    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState("");
    const [reviewForm, setReviewForm] = useState({ name: "", comment: "", rating: 0 });
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const fetchProduct = useCallback(async () => {
        try {
            const fullSlug = `${category}/${slug}`;
            const res = await api.get(`/products/slug/${fullSlug}`);
            setProduct(res.data);

            // Initialize image
            setMainImage(res.data.imageUrl);

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

    // Fetch related products based on category
    useEffect(() => {
        const fetchRelatedProducts = async () => {
            if (!product) return;
            try {
                const res = await api.get(`/products`);
                const related = res.data
                    .filter(p => p.category === product.category && p._id !== product._id)
                    .slice(0, 4); // Limit to 4 related products
                setRelatedProducts(related);
            } catch (err) {
                console.error("Error fetching related products:", err);
            }
        };
        fetchRelatedProducts();
    }, [product]);

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

    const handleAccessTypeChange = (type) => {
        setAccessType(type);
        const newPriceType = `${type}${billingPeriod.charAt(0).toUpperCase() + billingPeriod.slice(1)}`;
        handlePriceChange(newPriceType);
    };

    const handleBillingPeriodChange = (period) => {
        setBillingPeriod(period);
        const newPriceType = `${accessType}${period.charAt(0).toUpperCase() + period.slice(1)}`;
        handlePriceChange(newPriceType);
    };

    const handleQuantityChange = (delta) => {
        setQuantity((prev) => Math.max(1, prev + delta));
    };

    const handleBuyNow = async () => {
        if (!product) return;

        const cartItem = {
            productId: product._id,
            productName: product.name,
            selectedPlan: priceType,
            price: currentPrice,
            quantity: quantity,
            accessType,
            billingPeriod,
            imageUrl: product.imageUrl,
        };

        localStorage.setItem("checkoutItems", JSON.stringify([cartItem]));
        window.dispatchEvent(new Event('cartUpdated'));
        
        // Sync to backend if authenticated
        if (isAuthenticated) {
            try {
                await api.put('/auth/cart', { cart: [cartItem] });
            } catch (err) {
                console.error('Error syncing cart:', err);
            }
        }
        
        navigate("/checkout");
    };

    const handleAddToCart = async () => {
        if (!product) return;

        const cartItem = {
            productId: product._id,
            productName: product.name,
            selectedPlan: priceType,
            price: currentPrice,
            quantity: quantity,
            accessType,
            billingPeriod,
            imageUrl: product.imageUrl,
        };

        const existing = JSON.parse(localStorage.getItem("checkoutItems") || "[]");
        const idx = existing.findIndex(
            (item) => item.productId === cartItem.productId && item.selectedPlan === cartItem.selectedPlan,
        );

        if (idx >= 0) {
            existing[idx] = { ...existing[idx], quantity: existing[idx].quantity + cartItem.quantity };
        } else {
            existing.push(cartItem);
        }

        localStorage.setItem("checkoutItems", JSON.stringify(existing));
        window.dispatchEvent(new Event('cartUpdated'));
        
        // Sync to backend if authenticated
        if (isAuthenticated) {
            try {
                await api.put('/auth/cart', { cart: existing });
            } catch (err) {
                console.error('Error syncing cart:', err);
            }
        }
        
        console.log("Added to Cart:", cartItem);
        toast.success("Added to cart! Proceed to checkout when ready.");
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
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                    <p className="mt-4 text-gray-400">Loading...</p>
                </div>
            </div>
        );
    if (!product)
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <p className="text-gray-400 text-lg">Product not found.</p>
            </div>
        );

    // Calculate rating breakdown
    const ratingBreakdown = [5, 4, 3, 2, 1].map(star => {
        const count = reviews.filter(r => r.rating === star).length;
        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
        return { star, count, percentage };
    });

    const features = [
        { icon: FaCheckCircle, title: "Instant Activation", desc: "Get access immediately after purchase" },
        { icon: FaShieldAlt, title: "Secure Access", desc: "Protected with enterprise-grade security" },
        { icon: FaClock, title: "24/7 Availability", desc: "Access your subscription anytime" },
        { icon: FaHeadset, title: "Premium Support", desc: "Dedicated customer support team" },
        { icon: FaSync, title: "Auto-Renewal", desc: "Hassle-free automatic renewals" },
        { icon: FaLock, title: "Privacy Protected", desc: "Your data is safe and encrypted" },
    ];

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

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={product.metaTitle || product.name} />
                <meta name="twitter:description" content={product.metaDescription || product.seoDescription || product.description} />
                <meta name="twitter:image" content={product.imageUrl} />

                <link rel="canonical" href={`${window.location.origin}/products/${product.slug}`} />
                <link rel="preload" as="image" href={product.imageUrl} />

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
            </Helmet>

            <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
                {/* Breadcrumb */}
                <div className="bg-[#111111] border-b border-gray-800">
                    <Breadcrumb category={product.category} productName={product.name} slug={product.slug} />
                </div>

                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:auto-rows-fr">
                        {/* Left Column - Image Only */}
                        <div className="space-y-6">
                            {/* Main Image */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none z-10"></div>
                                <div className="bg-white border border-gray-800 rounded-2xl p-6 overflow-hidden flex items-center justify-center">
                                    <img
                                        src={mainImage}
                                        alt={`${product.name} - Premium ${product.category} subscription service - Product detailed view`}
                                        loading="lazy"
                                        className="w-[300px] h-[300px] object-contain transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Middle Column - Options & Pricing */}
                        <div className="space-y-3">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-3xl font-bold text-white">{product.name}</h1>
                                    <span className="flex items-center gap-1 bg-teal-600/20 text-teal-400 px-3 py-1 rounded-full text-sm border border-teal-600/30 cursor-pointer hover:bg-teal-600/30 transition-all duration-200">
                                        <FaCheckCircle className="text-xs" />
                                        Verified
                                    </span>
                                </div>
                                <div>
                                    <div className={`text-gray-300 text-sm leading-relaxed ${!isDescriptionExpanded ? 'line-clamp-2' : ''}`}>
                                        {product.description}
                                    </div>
                                    {product.description && product.description.length > 150 && (
                                        <button
                                            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                            className="text-teal-400 hover:text-teal-300 font-medium text-sm"
                                        >
                                            {isDescriptionExpanded ? 'Show less' : 'Show more...'}
                                        </button>
                                    )}
                                </div>
                            </div>
                            {/* Access Type Toggle */}
                            <div>
                                <label className="text-md text-gray-200 font-bold mb-2 block">Access Type:</label>
                                <div className="flex gap-3">
                                    {['shared', 'private'].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => handleAccessTypeChange(type)}
                                            className={`flex-1 py-2.5 rounded-full font-medium transition-all duration-200 ${accessType === type
                                                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-900/50'
                                                    : 'bg-[#1a1a1a] text-gray-400 border border-gray-800 hover:border-gray-700'
                                                }`}
                                        >
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Pricing Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Monthly Card */}
                                <div
                                    onClick={() => handleBillingPeriodChange('monthly')}
                                    className={`cursor-pointer p-5 rounded-xl border-2 transition-all duration-200 ${billingPeriod === 'monthly'
                                            ? 'border-teal-500 bg-teal-950/30'
                                            : 'border-gray-800 bg-[#1a1a1a] hover:border-gray-700'
                                        }`}
                                >
                                    <div className="text-sm text-gray-400 mb-1">Monthly</div>
                                    <div className="text-2xl font-bold text-white mb-3">
                                        Rs. {accessType === 'shared' ? product.priceSharedMonthly : product.privatePriceMonthly}
                                    </div>
                                    <ul className="space-y-2 text-xs text-gray-400">
                                        <li className="flex items-center gap-2">
                                            <FaCheck className="text-teal-500 flex-shrink-0" />
                                            <span>Full access</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <FaCheck className="text-teal-500 flex-shrink-0" />
                                            <span>Cancel anytime</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <FaCheck className="text-teal-500 flex-shrink-0" />
                                            <span>24/7 Support</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Yearly Card */}
                                <div
                                    onClick={() => handleBillingPeriodChange('yearly')}
                                    className={`cursor-pointer p-5 rounded-xl border-2 transition-all duration-200 relative ${billingPeriod === 'yearly'
                                            ? 'border-teal-500 bg-teal-950/30'
                                            : 'border-gray-800 bg-[#1a1a1a] hover:border-gray-700'
                                        }`}
                                >

                                    <div className="text-sm text-gray-400 mb-1">Yearly</div>
                                    <div className="text-2xl font-bold text-white mb-3">
                                        Rs. {accessType === 'shared' ? product.priceSharedYearly : product.privatePriceYearly}
                                    </div>
                                    <ul className="space-y-2 text-xs text-gray-400">
                                        <li className="flex items-center gap-2">
                                            <FaCheck className="text-teal-500 flex-shrink-0" />
                                            <span>Full access</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <FaCheck className="text-teal-500 flex-shrink-0" />
                                            <span>Best value</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <FaCheck className="text-teal-500 flex-shrink-0" />
                                            <span>Priority support</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            
                        </div>

                        {/* Right Column - Title, Rating, Price & Buttons */}
                        <div className="space-y-6">
                            {/* Quantity Selector */}
                            <div>
                                <label className="text-sm text-gray-400 mb-2 block">Quantity</label>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        className="w-10 h-10 bg-[#1a1a1a] border border-gray-800 hover:border-teal-500 rounded-lg flex items-center justify-center text-white transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="text-2xl font-semibold text-white w-12 text-center">{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        className="w-10 h-10 bg-[#1a1a1a] border border-gray-800 hover:border-teal-500 rounded-lg flex items-center justify-center text-white transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Rating Display */}
                            <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
                                <div className="flex gap-1">
                                    {renderStars(product.avgRating || 0)}
                                </div>
                                <span className="text-gray-400 text-sm">
                                    {(product.avgRating || 0).toFixed(1)} ({product.totalReviews || 0} Reviews)
                                </span>
                            </div>

                            {/* Total Price */}
                            <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 flex justify-between items-center">
                                <span className="text-gray-400">Total Price:</span>
                                <span className="text-3xl font-bold text-teal-400">Rs. {currentPrice * quantity}</span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleBuyNow}
                                    className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-semibold py-4 rounded-xl transition-all duration-200 shadow-lg shadow-teal-900/50 hover:shadow-teal-900/70"
                                >
                                    Buy Now
                                </button>
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-[#1a1a1a] border-2 border-gray-800 hover:border-teal-500 text-white font-semibold py-4 rounded-xl transition-all duration-200"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Product Details Section */}
                <section className="bg-[#111111] border-y border-gray-800 py-16">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-3xl font-bold text-white">Product Details</h2>
                            <div className="flex-1 h-px bg-gradient-to-r from-gray-800 to-transparent"></div>
                        </div>

                        {/* SEO Description */}
                        {product.seoDescription && (
                            <div className="mb-12 bg-gradient-to-br from-teal-950/20 to-cyan-950/20 border border-teal-900/30 rounded-2xl p-8">
                                <h3 className="text-xl font-semibold text-teal-400 mb-4">Product Overview</h3>
                                <div className="text-gray-300 leading-relaxed space-y-3">
                                    {product.seoDescription.split('\n\n').map((paragraph, idx) => (
                                        <p key={idx}>{paragraph}</p>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Feature Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((feature, idx) => {
                                const Icon = feature.icon;
                                return (
                                    <div
                                        key={idx}
                                        className="bg-[#1a1a1a] border border-gray-800 hover:border-teal-600/50 rounded-xl p-6 transition-all duration-200 hover:shadow-lg hover:shadow-teal-900/20 group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-lg group-hover:scale-110 transition-transform duration-200">
                                                <Icon className="text-white text-xl" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-white font-semibold mb-1">{feature.title}</h4>
                                                <p className="text-gray-400 text-sm">{feature.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Ratings & Reviews Section */}
                <section className="max-w-7xl mx-auto px-4 py-16">
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-3xl font-bold text-white">Ratings & Reviews</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-800 to-transparent"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                        {/* Left - Overall Rating */}
                        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-8">
                            <div className="text-center mb-6">
                                <div className="text-6xl font-bold text-white mb-2">
                                    {(product.avgRating || 0).toFixed(1)}
                                </div>
                                <div className="flex justify-center gap-1 mb-2">
                                    {renderStars(product.avgRating || 0, "text-2xl")}
                                </div>
                                <div className="text-gray-400 text-sm">
                                    Based on {product.totalReviews || 0} reviews
                                </div>
                            </div>

                            {/* Rating Breakdown */}
                            <div className="space-y-2">
                                {ratingBreakdown.map(({ star, count, percentage }) => (
                                    <div key={star} className="flex items-center gap-3">
                                        <span className="text-sm text-gray-400 w-12">{star} star</span>
                                        <div className="flex-1 h-2 bg-[#0a0a0a] rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-teal-600 to-cyan-600 transition-all duration-300"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm text-gray-400 w-12 text-right">
                                            {percentage.toFixed(0)}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right - Review Form */}
                        <div className="lg:col-span-2 bg-[#1a1a1a] border border-gray-800 rounded-xl p-8">
                            <h3 className="text-xl font-semibold text-white mb-6">Write a Review</h3>
                            <form onSubmit={handleReviewSubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-400 mb-2 block">Your Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        value={reviewForm.name}
                                        onChange={(e) =>
                                            setReviewForm({ ...reviewForm, name: e.target.value })
                                        }
                                        required
                                        className="w-full bg-[#0a0a0a] border border-gray-800 focus:border-teal-500 rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-400 mb-2 block">Your Review</label>
                                    <textarea
                                        rows="4"
                                        placeholder="Share your experience with this product"
                                        value={reviewForm.comment}
                                        onChange={(e) =>
                                            setReviewForm({ ...reviewForm, comment: e.target.value })
                                        }
                                        required
                                        className="w-full bg-[#0a0a0a] border border-gray-800 focus:border-teal-500 rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-base text-gray-400 mb-2 block">Rating</label>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() =>
                                                    setReviewForm({ ...reviewForm, rating: star })
                                                }
                                            >
                                                <FaStar
                                                    size={20}
                                                    className={`cursor-pointer transition-colors ${star <= reviewForm.rating
                                                            ? "text-yellow-400"
                                                            : "text-gray-700 hover:text-gray-600"
                                                        }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200"
                                >
                                    Submit Review
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Review List */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-white mb-4">Customer Reviews</h3>
                        {reviews.length === 0 ? (
                            <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-8 text-center">
                                <p className="text-gray-400">No reviews yet. Be the first to review!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {reviews.map((rev) => (
                                    <div
                                        key={rev._id}
                                        className="bg-[#1a1a1a] border border-gray-800 hover:border-gray-700 rounded-xl p-6 transition-all duration-200"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="text-white font-semibold">{rev.name}</h4>
                                                <p className="text-gray-500 text-xs">
                                                    {new Date(rev.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <div className="flex gap-1">
                                                {renderStars(rev.rating)}
                                            </div>
                                        </div>
                                        <p className="text-gray-300 leading-relaxed">{rev.comment}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <section className="max-w-7xl mx-auto px-4 py-12">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">Related Products</h2>
                            <p className="text-gray-400">Discover similar products in {product.category}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <div
                                    key={relatedProduct._id}
                                    onClick={() => navigate(`/products/${relatedProduct.slug}`)}
                                    className="group bg-[#111111] rounded-2xl shadow-sm hover:shadow-2xl border border-gray-800 hover:border-teal-600/40 overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-teal-900/20 flex flex-col cursor-pointer"
                                >
                                    <div className="relative block h-48 overflow-hidden bg-[#0f0f0f]">
                                        <img
                                            src={relatedProduct.imageUrl}
                                            alt={`${relatedProduct.name} - Best ${relatedProduct.category} subscription service`}
                                            loading="lazy"
                                            className="w-full h-full object-contain p-4 bg-white transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <span className="absolute top-3 left-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white/95 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                                            {relatedProduct.category}
                                        </span>
                                    </div>

                                    <div className="p-4 flex flex-col flex-1">
                                        <h3 className="text-lg font-semibold text-white line-clamp-2 mb-2">
                                            {relatedProduct.name}
                                        </h3>

                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="flex items-center text-sm">
                                                {renderStars(relatedProduct.avgRating || 0, "text-sm")}
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                ({relatedProduct.totalReviews || 0})
                                            </span>
                                        </div>

                                        <div className="mt-auto">
                                            <div className="flex items-baseline justify-between mb-3">
                                                <div>
                                                    <span className="text-xs text-gray-500 block">Starting from</span>
                                                    <span className="text-xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                                                        Rs. {relatedProduct.priceSharedMonthly || 0}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/products/${relatedProduct.slug}`);
                                                }}
                                                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white text-sm font-medium py-2 rounded-lg transition-all duration-200"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </>
    );
};

export default ProductDetail;
