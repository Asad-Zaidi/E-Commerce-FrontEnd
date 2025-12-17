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
import { FaSearch, FaStar, FaStarHalfAlt, FaRegStar, FaFilter, FaTh, FaList } from "react-icons/fa";
import { Helmet } from "react-helmet-async";

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
        <meta name="keywords" content="products, digital tools, subscriptions, services, SaaS, software" />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
              Our Products
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Explore the best services and packages tailored to your needs.  Premium quality at competitive prices.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && console.log("Searching for:", searchTerm)}
                  className="w-full border-0 rounded-full py-4 pl-6 pr-14 text-gray-700 dark:text-gray-200 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-white/30 shadow-2xl text-lg transition-all duration-300"
                />
                <button
                  onClick={() => console.log("Searching for:", searchTerm)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 transform0 text-black w-12 h-12 rounded-full transition-colors duration-300 shadow-lg flex items-center justify-center"
                >
                  <FaSearch className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="relative h-16">
          <svg className="absolute bottom-0 w-full h-16 text-gray-50 dark:text-gray-950" preserveAspectRatio="none" viewBox="0 0 1440 54">
            <path fill="currentColor" d="M0 22L60 16.7C120 11 240 1.00001 360 0.700012C480 1.00001 600 11 720 21.7C840 32 960 43 1080 43. 3C1200 43 1320 32 1380 27.3L1440 22V54H1380C1320 54 1200 54 1080 54C960 54 840 54 720 54C600 54 480 54 360 54C240 54 120 54 60 54H0V22Z"/>
          </svg>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Filter Bar */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setIsFilterOpen(! isFilterOpen)}
                className="lg:hidden flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium"
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
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* View Mode & Results Count */}
              <div className="flex items-center justify-between lg:justify-end gap-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                </span>
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-colors ${viewMode === "grid" ?  "bg-white dark:bg-gray-700 shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                  >
                    <FaTh />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600" :  "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
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
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
                <FaSearch className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No products found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
              : "flex flex-col gap-4"
            }>
              {filteredProducts.map(product => (
                viewMode === "grid" ? (
                  /* Grid Card */
                  <div 
                    key={product._id} 
                    className="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
                  >
                    <Link
                      to={`/products/${product.category.toLowerCase().replace(/[\s\W-]+/g, '-')}/${product.name.toLowerCase().replace(/[\s\W-]+/g, '-')}`}
                      className="relative block aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800"
                    >
                      {/* Product Image - object-contain ensures full visibility without cropping */}
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Category Badge */}
                      <span className="absolute top-3 left-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-xs font-medium text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full shadow-sm">
                        {product.category}
                      </span>
                      
                      {/* Quick View Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="bg-white text-gray-900 px-6 py-2 rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          View Details
                        </span>
                      </div>
                    </Link>

                    <div className="p-5 flex flex-col flex-1">
                      {/* Product Title */}
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2 min-h-[3.5rem]">
                        {searchTerm ? (
                          <>
                            {product.name.split(new RegExp(`(${searchTerm})`, "gi")).map((part, i) =>
                              part.toLowerCase() === searchTerm.toLowerCase() ? (
                                <mark key={i} className="bg-amber-200 dark:bg-amber-500/30 text-amber-900 dark:text-amber-200 px-1 rounded">{part}</mark>
                              ) : (
                                part
                              )
                            )}
                          </>
                        ) : product.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center">
                          {renderStars(product.avgRating || 0)}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ({product.totalReviews || 0})
                        </span>
                      </div>

                      {/* Price & CTA */}
                      <div className="mt-auto flex items-center justify-between">
                        <div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 block">Starting from</span>
                          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Rs. {product.priceSharedMonthly || 0}
                          </span>
                        </div>
                        <Link
                          to={`/products/${product.category.toLowerCase().replace(/[\s\W-]+/g, '-')}/${product.name.toLowerCase().replace(/[\s\W-]+/g, '-')}`}
                          className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg shadow-blue-500/25 transition-all duration-300 transform hover:scale-110"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* List Card */
                  <div 
                    key={product._id} 
                    className="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300 flex flex-col sm:flex-row"
                  >
                    <Link
                      to={`/products/${product.category.toLowerCase().replace(/[\s\W-]+/g, '-')}/${product.name.toLowerCase().replace(/[\s\W-]+/g, '-')}`}
                      className="relative sm:w-48 md:w-64 flex-shrink-0 aspect-square sm:aspect-auto bg-gray-100 dark:bg-gray-800"
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-xs font-medium text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full shadow-sm">
                        {product.category}
                      </span>
                    </Link>

                    <div className="p-6 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          {searchTerm ? (
                            <>
                              {product.name.split(new RegExp(`(${searchTerm})`, "gi")).map((part, i) =>
                                part.toLowerCase() === searchTerm.toLowerCase() ? (
                                  <mark key={i} className="bg-amber-200 dark:bg-amber-500/30 text-amber-900 dark:text-amber-200 px-1 rounded">{part}</mark>
                                ) : (
                                  part
                                )
                              )}
                            </>
                          ) : product.name}
                        </h3>
                        
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center">
                            {renderStars(product.avgRating || 0)}
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            ({product.totalReviews || 0} reviews)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 block">Starting from</span>
                          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Rs. {product.priceSharedMonthly || 0}
                          </span>
                        </div>
                        <Link
                          to={`/products/${product.category.toLowerCase().replace(/[\s\W-]+/g, '-')}/${product.name.toLowerCase().replace(/[\s\W-]+/g, '-')}`}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-full font-medium shadow-lg shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
                        >
                          View Details
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Product;