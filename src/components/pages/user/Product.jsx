// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import api from "../../../api/api";
// import "../../../styles/Product.css";
// import { FaSearch, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
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

// const Product = () => {

//     const location = useLocation();
//     const queryParams = new URLSearchParams(location.search);
//     const initialCategory = queryParams.get("category") || "All";
//     const [searchTerm, setSearchTerm] = useState("");
//     const [selectedCategory, setSelectedCategory] = useState(initialCategory);
//     const [products, setProducts] = useState([]);
//     const [categories, setCategories] = useState([]);

//     const fetchProductsAndCategories = async () => {
//         try {
//             const res = await api.get("/products");
//             setProducts(res.data);

//             const catRes = await api.get("/categories");
//             const categoryNames = ["All", ...catRes.data.map(cat => cat.name)];
//             setCategories(categoryNames);
//         } catch (err) {
//             console.error("Error fetching products or categories:", err);
//         }
//     };

//     useEffect(() => {
//         fetchProductsAndCategories();
//         const interval = setInterval(fetchProductsAndCategories, 10000);
//         return () => clearInterval(interval);
//     }, []);

//     const filteredProducts = products
//         .filter(p => selectedCategory === "All" || p.category === selectedCategory)
//         .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

//     return (
//         <>
//             <Helmet>
//                 <title>Products - Social Media Services</title>
//                 <meta name="description" content="Browse our range of powerful digital tools and flexible subscription plans tailored to your business and your needs." />
//                 <meta name="keywords" content="products, digital tools, subscriptions, services, SaaS, software" />
//                 <meta property="og:title" content="Products - ServiceHub" />
//                 <meta property="og:description" content="Explore our collection of powerful digital tools with flexible pricing plans." />
//                 <meta property="og:type" content="website" />
//                 <meta property="og:locale" content="en_US" />
//                 <meta name="twitter:card" content="summary" />
//                 <meta name="twitter:title" content="Products - ServiceHub" />
//                 <meta name="twitter:description" content="Browse digital tools and subscription plans." />
//             </Helmet>

//             <div className="product-page">
//                 {/* Search Bar */}
//                 <div className="search-bar">
//                     <input
//                         type="text"
//                         placeholder="Search products..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         onKeyDown={(e) => e.key === "Enter" && console.log("Searching for:", searchTerm)}
//                     />
//                     <FaSearch
//                         className="search-icon"
//                         onClick={() => console.log("Searching for:", searchTerm)}
//                     />
//                 </div>

//                 <div className="product-header">
//                     <h1>Our Products</h1>
//                     <p>Explore the best services and packages tailored to your needs.</p>
//                 </div>

//                 {/* Filter Buttons */}
//                 <div className="filter-bar">
//                     {categories.map(cat => (
//                         <button
//                             key={cat}
//                             className={`filter-btn ${selectedCategory === cat ? "active" : ""}`}
//                             onClick={() => setSelectedCategory(cat)}
//                         >
//                             {cat}
//                         </button>
//                     ))}
//                 </div>

//                 {/* Product Cards */}
//                 <div className="product-grid">
//                     {filteredProducts.length === 0 ? (
//                         <p className="no-products">⚠️ No products available in this category.</p>
//                     ) : (
//                         filteredProducts.map(product => (
//                             <div className="modern-product-card" key={product._id}>
//                                 <div className="card-top">
//                                     <Link to={`/products/${product.category.toLowerCase().replace(/[\s\W-]+/g, '-')}/${product.name.toLowerCase().replace(/[\s\W-]+/g, '-')}`}>
//                                         <img src={product.imageUrl} alt={product.name} />
//                                     </Link>
//                                 </div>

//                                 <div className="card-content">
//                                     <div className="card-header">
//                                         <h3>
//                                             {searchTerm ? (
//                                                 <>
//                                                     {product.name.split(new RegExp(`(${searchTerm})`, "gi")).map((part, i) =>
//                                                         part.toLowerCase() === searchTerm.toLowerCase() ? (
//                                                             <span key={i} style={{ backgroundColor: "#fffa91" }}>{part}</span>
//                                                         ) : (
//                                                             part
//                                                         )
//                                                     )}
//                                                 </>
//                                             ) : (
//                                                 product.name
//                                             )}
//                                         </h3>

//                                         <div className="price-tags">
//                                             <span className="price">Rs. {product.priceSharedMonthly || 0}</span>
//                                         </div>
//                                     </div>

//                                     <div className="rating-section">
//                                         {renderStars(product.avgRating || 0)}
//                                         <span className="review-count">({product.totalReviews || 0})</span>
//                                     </div>

//                                     <Link to={`/products/${product.category.toLowerCase().replace(/[\s\W-]+/g, '-')}/${product.name.toLowerCase().replace(/[\s\W-]+/g, '-')}`} className="more-detail">
//                                         Show Details →
//                                     </Link>
//                                 </div>
//                             </div>
//                         ))
//                     )}
//                 </div>
//             </div>
//         </>
//     );
// };

// export default Product;

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../../../api/api";
import { FaSearch, FaStar, FaStarHalfAlt, FaRegStar, FaFilter, FaTh, FaList, FaTimes } from "react-icons/fa";
import SEO from "../../SEO.jsx";
// import {Helmet} from "react-helmet-async";

const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<FaStar key={i} className="text-amber-400" />);
    else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-amber-400" />);
    else stars.push(<FaRegStar key={i} className="text-gray-300 dark:text-gray-600" />);
  }
  return stars;
};

const Product = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get("category") || "All";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const slugify = (text) => text?.toLowerCase().replace(/[\s\W-]+/g, "-") ?? "";

  const categoryBadgeGradients = {
    "AI Tools": "from-teal-600 to-cyan-600",
    Productivity: "from-emerald-600 to-teal-600",
    Entertainment: "from-fuchsia-600 to-pink-600",
    Education: "from-sky-600 to-cyan-600",
    Design: "from-rose-600 to-orange-600",
    Development: "from-indigo-600 to-cyan-600",
  };

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

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filteredProducts = products
    .filter((p) => selectedCategory === "All" || p.category === selectedCategory)
    .filter((p) => {
      const term = searchTerm.toLowerCase();
      return (
        p.name?.toLowerCase().includes(term) || (p.description || "").toLowerCase().includes(term)
      );
    });

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleBuyNow = (product) => {
    if (!product) return;
    const details = {
      productId: product._id,
      productName: product.name,
      price: product.priceSharedMonthly || 0,
      plan: "sharedMonthly",
    };
    console.log("Buy Now:", details);
    alert("✅ Order details logged in console!");
  };

  return (
    <>
      <SEO
        title="Products | ServiceHub"
        description="Browse our powerful digital tools and flexible subscription plans tailored to your needs."
        keywords="products, digital tools, subscriptions, services, SaaS, software"
        image=""
        url={`${window.location.origin}/products`}
      />
      {/* <Helmet>
        <title>Products - Social Media Services</title>
        <meta name="description" content="Browse our range of powerful digital tools and flexible subscription plans tailored to your business and your needs." />
        <meta name="keywords" content="products, digital tools, subscriptions, services, SaaS, software" />
      </Helmet> */}

      {/* Hero / Search */}
      <div className="bg-[#0a0a0a] border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Explore Digital Subscriptions
            </h1>
            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-8">
              Find trusted access to top AI, entertainment, and productivity tools.
            </p>
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search products by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && console.log("Searching for:", searchTerm)}
                  className="w-full rounded-full py-4 pl-6 pr-14 text-gray-100 bg-white/5 border border-gray-800 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-teal-600/30 shadow-2xl text-lg transition-all duration-300 placeholder:text-gray-500"
                />
                <button
                  onClick={() => console.log("Searching for:", searchTerm)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/90 bg-gradient-to-r from-teal-600 to-cyan-600 w-12 h-12 rounded-full transition-transform duration-300 shadow-lg shadow-teal-900/40 flex items-center justify-center hover:scale-105"
                >
                  <FaSearch className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0a0a0a] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Filter Bar */}
          <div className="bg-[#111111] rounded-2xl shadow-sm border border-gray-800 p-4 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setIsFilterOpen(! isFilterOpen)}
                className="lg:hidden flex items-center gap-2 text-gray-200 font-medium"
              >
                <FaFilter />
                Filter by Category
              </button>

              {/* Category Filter */}
              <div className={`flex flex-wrap gap-2 ${isFilterOpen ? 'block' : 'hidden'} lg:flex`}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105
                      ${selectedCategory === cat
                        ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-900/30"
                        : "bg-[#0f0f0f] text-gray-300 border border-gray-800 hover:border-gray-700"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* View Mode & Results Count */}
              <div className="flex items-center justify-between lg:justify-end gap-4">
                <span className="text-sm text-gray-400">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                </span>
                <div className="flex items-center gap-1 bg-[#0f0f0f] border border-gray-800 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-colors ${viewMode === "grid" ?  "bg-[#111111] shadow-sm text-teal-400" : "text-gray-500 hover:text-gray-300"}`}
                  >
                    <FaTh />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-[#111111] shadow-sm text-teal-400" :  "text-gray-500 hover:text-gray-300"}`}
                  >
                    <FaList />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#111111] border border-gray-800 rounded-full mb-6">
                <FaSearch className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" 
              : "flex flex-col gap-4"
            }>
              {filteredProducts.map(product => (
                viewMode === "grid" ? (
                  /* Grid Card */
                  <div 
                    key={product._id} 
                    className="group bg-[#111111] rounded-2xl shadow-sm hover:shadow-2xl border border-gray-800 hover:border-teal-600/40 overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-teal-900/20 flex flex-col cursor-pointer"
                    onClick={() => openModal(product)}
                  >
                    <div className="relative block aspect-square overflow-hidden bg-[#0f0f0f]">
                      {/* Product Image */}
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-60 object-contain p-4 bg-white  transition-transform duration-500"
                      />
                      {/* Category Badge */}
                      <span className={`absolute top-3 left-3 bg-gradient-to-r ${categoryBadgeGradients[product.category] || 'from-teal-600 to-cyan-600'} text-white/95 text-xs font-medium px-3 py-1 rounded-full shadow-sm`}>
                        {product.category}
                      </span>
                      {/* Quick View Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="bg-white/95 text-gray-900 px-6 py-2 rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          Quick View
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      {/* Product Title */}
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 min-h-[3.25rem]">
                        {searchTerm ? (
                          <>
                            {product.name.split(new RegExp(`(${searchTerm})`, "gi")).map((part, i) =>
                              part.toLowerCase() === searchTerm.toLowerCase() ? (
                                <mark key={i} className="bg-emerald-500/20 text-teal-300 px-1 rounded">{part}</mark>
                              ) : (
                                part
                              )
                            )}
                          </>
                        ) : product.name}
                      </h3>

                      {/* Short Description */}
                      <p className="text-sm text-gray-400 line-clamp-2 min-h-[2.75rem] mb-3">
                        {product.description || "Reliable subscription access with instant activation."}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center">
                          {renderStars(product.avgRating || 0)}
                        </div>
                        <span className="text-sm text-gray-500">
                          ({product.totalReviews || 0})
                        </span>
                      </div>

                      {/* Price & CTA */}
                      <div className="mt-auto">
                        <div className="flex items-baseline justify-between mb-3">
                          <div>
                            <span className="text-xs text-gray-500 block">Starting from</span>
                            <span className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                              Rs. {product.priceSharedMonthly || 0}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleBuyNow(product); }}
                            className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-medium py-2.5 rounded-lg transition-all duration-200"
                          >
                            Buy Now
                          </button>
                          <Link
                            onClick={(e) => e.stopPropagation()}
                            to={`/products/${slugify(product.category)}/${slugify(product.name)}`}
                            className="w-full text-center border border-teal-600/60 text-teal-300 hover:text-white hover:bg-teal-600/20 font-medium py-2.5 rounded-lg transition-all duration-200"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* List Card */
                  <div 
                    key={product._id} 
                    className="group bg-[#111111] rounded-2xl shadow-sm hover:shadow-2xl border border-gray-800 hover:border-teal-600/40 overflow-hidden transition-all duration-300 flex flex-col sm:flex-row cursor-pointer"
                    onClick={() => openModal(product)}
                  >
                    <div className="relative sm:w-48 md:w-64 flex-shrink-0 aspect-square sm:aspect-auto bg-[#0f0f0f]">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className={`absolute top-3 left-3 bg-gradient-to-r ${categoryBadgeGradients[product.category] || 'from-teal-600 to-cyan-600'} text-white/95 text-xs font-medium px-3 py-1 rounded-full shadow-sm`}>
                        {product.category}
                      </span>
                    </div>

                    <div className="p-6 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {searchTerm ? (
                            <>
                              {product.name.split(new RegExp(`(${searchTerm})`, "gi")).map((part, i) =>
                                part.toLowerCase() === searchTerm.toLowerCase() ? (
                                  <mark key={i} className="bg-emerald-500/20 text-teal-300 px-1 rounded">{part}</mark>
                                ) : (
                                  part
                                )
                              )}
                            </>
                          ) : product.name}
                        </h3>
                        <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                          {product.description || "Reliable subscription access with instant activation."}
                        </p>
                        
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center">
                            {renderStars(product.avgRating || 0)}
                          </div>
                          <span className="text-sm text-gray-500">
                            ({product.totalReviews || 0} reviews)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-gray-500 block">Starting from</span>
                          <span className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                            Rs. {product.priceSharedMonthly || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleBuyNow(product); }}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white px-6 py-3 rounded-full font-medium shadow-lg shadow-teal-900/30 transition-all duration-300 transform hover:scale-105"
                          >
                            Buy Now
                          </button>
                          <Link
                            onClick={(e) => e.stopPropagation()}
                            to={`/products/${slugify(product.category)}/${slugify(product.name)}`}
                            className="inline-flex items-center gap-2 border border-teal-600/60 text-teal-300 hover:text-white hover:bg-teal-600/20 px-6 py-3 rounded-full font-medium transition-all duration-300"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-[#111111] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                <h3 className="text-lg font-semibold text-white">{selectedProduct.name}</h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-white">
                  <FaTimes />
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="bg-[#0f0f0f] flex items-center justify-center p-6">
                  <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="max-h-80 object-contain" />
                </div>
                <div className="p-6 space-y-4">
                  <span className={`inline-block bg-gradient-to-r ${categoryBadgeGradients[selectedProduct.category] || 'from-teal-600 to-cyan-600'} text-white/95 text-xs font-medium px-3 py-1 rounded-full`}>{selectedProduct.category}</span>
                  <p className="text-sm text-gray-400">
                    {selectedProduct.description || "Reliable subscription access with instant activation and secure usage."}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(selectedProduct.avgRating || 0)}</div>
                    <span className="text-sm text-gray-500">({selectedProduct.totalReviews || 0})</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Starting from</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">Rs. {selectedProduct.priceSharedMonthly || 0}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => handleBuyNow(selectedProduct)}
                      className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-medium py-3 rounded-lg transition-all duration-200"
                    >
                      Buy Now
                    </button>
                    <Link
                      to={`/products/${slugify(selectedProduct.category)}/${slugify(selectedProduct.name)}`}
                      className="w-full text-center border border-teal-600/60 text-teal-300 hover:text-white hover:bg-teal-600/20 font-medium py-3 rounded-lg transition-all duration-200"
                      onClick={closeModal}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Product;