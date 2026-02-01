import React, { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { FaSearch, FaStar, FaStarHalfAlt, FaRegStar, FaFilter, FaTh, FaList, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import SEO from "../../components/SEO.jsx";
import Breadcrumb from "../../components/common/Breadcrumb";
import { Helmet } from "react-helmet-async";
import Loader from "../../components/Loader";

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
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get("category") || "All";
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const suggestionRef = useRef(null);
  const productsPerPage = 12;
  const slugify = (text) => {
    if (!text) return "";
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // spaces to hyphen
      .replace(/[^\w-]/g, "") // remove non-word characters (keeps hyphen)
      .replace(/-+/g, "-") // collapse multiple hyphens
      .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens
  };

  const categoryBadgeGradients = {
    "AI Tools": "from-teal-600 to-cyan-600",
    Productivity: "from-emerald-600 to-teal-600",
    Entertainment: "from-fuchsia-600 to-pink-600",
    Education: "from-sky-600 to-cyan-600",
    Design: "from-rose-600 to-orange-600",
    Development: "from-indigo-600 to-cyan-600",
  };

  const fetchProductsAndCategories = async (showLoader = false) => {
    try {
      if (showLoader) setIsLoading(true);
      const res = await api.get("/products");
      setProducts(res.data);

      const catRes = await api.get("/categories");
      const categoryNames = ["All", ...catRes.data.map(cat => cat.name)];
      setCategories(categoryNames);
    } catch (err) {
      console.error("Error fetching products or categories:", err);
    } finally {
      if (showLoader) setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch with loader
    fetchProductsAndCategories(true);
    // Silent background refreshes without overlay
    const interval = setInterval(() => fetchProductsAndCategories(false), 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredProducts = products
    .filter((p) => selectedCategory === "All" || p.category === selectedCategory)
    .filter((p) => {
      const term = searchTerm.toLowerCase();
      return (
        p.name?.toLowerCase().includes(term) || (p.description || "").toLowerCase().includes(term)
      );
    });

  const suggestions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [];
    return products
      .filter((p) => selectedCategory === "All" || p.category === selectedCategory)
      .filter((p) => {
        return (
          p.name?.toLowerCase().includes(term) ||
          (p.description || "").toLowerCase().includes(term)
        );
      })
      .slice(0, 6);
  }, [products, searchTerm, selectedCategory]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    if (!isSuggestionOpen) return;
    const handleOutsideClick = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setIsSuggestionOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isSuggestionOpen]);

  const handleBuyNow = (product) => {
    if (!product) return;
    const checkoutDetails = {
      productId: product._id,
      productName: product.name,
      price: product.priceSharedMonthly || 0,
      plan: "sharedMonthly",
      category: product.category,
      imageUrl: product.imageUrl,
    };
    navigate("/checkout", { state: { product: checkoutDetails } });
  };

  return (
    <>
      {isLoading && <Loader />}
      <SEO
        title="Products | ServiceHub"
        description="Browse our powerful digital tools and flexible subscription plans tailored to your needs."
        keywords="products, digital tools, subscriptions, services, SaaS, software"
        image=""
        url={`${window.location.origin}/products`}
      />
      <Helmet>
        {currentPage > 1 && (
          <link rel="prev" href={`${window.location.origin}/products?page=${currentPage - 1}${selectedCategory !== 'All' ? `&category=${selectedCategory}` : ''}`} />
        )}
        {currentPage < totalPages && (
          <link rel="next" href={`${window.location.origin}/products?page=${currentPage + 1}${selectedCategory !== 'All' ? `&category=${selectedCategory}` : ''}`} />
        )}
      </Helmet>
      {/* Breadcrumb */}
      <div className="bg-[#0a0a0a] border-b border-gray-800">
        <Breadcrumb category={products.category} productName={products.name} slug={products.slug} />
      </div>

      {/* Hero / Search */}
      <div className="bg-[#0a0a0a] border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
              Explore Digital Subscriptions
            </h1>
            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-6">
              Find trusted access to top AI, entertainment, and productivity tools.
            </p>
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative group" ref={suggestionRef}>
                <input
                  type="text"
                  placeholder="Search products by name or description..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsSuggestionOpen(true);
                    setHighlightedIndex(-1);
                  }}
                  onFocus={() => searchTerm && setIsSuggestionOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setIsSuggestionOpen(true);
                      setHighlightedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
                    } else if (e.key === "Enter") {
                      if (isSuggestionOpen && highlightedIndex >= 0 && suggestions[highlightedIndex]) {
                        const selected = suggestions[highlightedIndex];
                        navigate(`/products/${slugify(selected.category)}/${slugify(selected.name)}`);
                        setIsSuggestionOpen(false);
                      } else {
                        console.log("Searching for:", searchTerm);
                      }
                    } else if (e.key === "Escape") {
                      setIsSuggestionOpen(false);
                    }
                  }}
                  className="w-full rounded-full py-4 pl-6 pr-14 text-gray-100 bg-white/5 border border-gray-800 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-teal-600/30 shadow-2xl text-sm transition-all duration-300 placeholder:text-gray-500"
                />
                <button
                  onClick={() => console.log("Searching for:", searchTerm)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/90 bg-gradient-to-r from-teal-600 to-cyan-600 w-10 h-10 rounded-full transition-transform duration-300 shadow-lg shadow-teal-900/40 flex items-center justify-center hover:bg-gradient-to-r hover:from-teal-500 hover:to-cyan-500"
                >
                  <FaSearch className="w-5 h-5" />
                </button>

                {isSuggestionOpen && searchTerm.trim() && (
                  <div className="absolute z-50 mt-3 w-full bg-[#0f0f0f] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                    {suggestions.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-400">No matches found</div>
                    ) : (
                      <ul className="max-h-80 overflow-auto">
                        {suggestions.map((product, index) => (
                          <li key={product._id}>
                            <button
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => {
                                navigate(`/products/${slugify(product.category)}/${slugify(product.name)}`);
                                setIsSuggestionOpen(false);
                              }}
                              className={`w-full text-left px-4 py-3 flex items-center justify-between gap-4 transition-colors ${
                                index === highlightedIndex
                                  ? "bg-white/10"
                                  : "hover:bg-white/5"
                              }`}
                            >
                              <div className="flex flex-col">
                                <span className="text-sm text-gray-100">
                                  {searchTerm ? (
                                    <>
                                      {product.name
                                        .split(new RegExp(`(${searchTerm})`, "gi"))
                                        .map((part, i) =>
                                          part.toLowerCase() === searchTerm.toLowerCase() ? (
                                            <mark key={i} className="bg-emerald-500/20 text-teal-300 px-1 rounded">{part}</mark>
                                          ) : (
                                            part
                                          )
                                        )}
                                    </>
                                  ) : (
                                    product.name
                                  )}
                                </span>
                                <span className="text-xs text-gray-500">{product.category}</span>
                              </div>
                              <span className="text-xs text-gray-400">Rs. {product.priceSharedMonthly || 0}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
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
                onClick={() => setIsFilterOpen(!isFilterOpen)}
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
                    className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-[#111111] shadow-sm text-teal-400" : "text-gray-500 hover:text-gray-300"}`}
                  >
                    <FaTh />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-[#111111] shadow-sm text-teal-400" : "text-gray-500 hover:text-gray-300"}`}
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
            <>
            <div className={viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              : "flex flex-col gap-4"
            }>
              {currentProducts.map(product => (
                viewMode === "grid" ? (
                  /* Grid Card */
                  <div
                    key={product._id}
                    onClick={() => navigate(`/products/${slugify(product.category)}/${slugify(product.name)}`)}
                    className="group bg-[#111111] rounded-2xl shadow-sm hover:shadow-2xl border border-gray-800 hover:border-teal-600/40 overflow-hidden transition-all duration-300 transform hover:shadow-teal-900/20 flex flex-col cursor-pointer"
                  >
                    <div className="relative block h-54 overflow-hidden bg-[#0f0f0f]">
                      {/* Blurred Background Image */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center blur-lg scale-110"
                        style={{ backgroundImage: `url(${product.imageUrl})` }}
                      />
                      {/* Product Image */}
                      <img
                        src={product.imageUrl}
                        alt={`${product.name} - Best ${product.category} subscription service online`}
                        loading="lazy"
                        className="relative w-full h-52 object-contain transition-transform duration-500 z-10"
                      />
                      {/* Category Badge */}
                      <span className={`absolute top-3 left-3 bg-gradient-to-r ${categoryBadgeGradients[product.category] || 'from-teal-600 to-cyan-600'} text-white/95 text-xs font-medium px-3 py-1 rounded-full shadow-sm hover:bg-gradient-to-t hover:from-teal-500 hover:to-cyan-500 transition-all duration-300 z-20`}>
                        {product.category}
                      </span>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      {/* Product Title */}
                      <h1 className="text-xl font-semibold text-white line-clamp-2 min-h-[3.25rem]">
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
                      </h1>

                      {/* Short Description */}
                      <p className="text-sm text-gray-400 line-clamp-2 min-h-[2.75rem] mb-3">
                        {product.description || product.seoDescription || product.metaDescription}
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
                            className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white text-sm font-medium py-2.5 rounded-lg transition-all duration-200"
                          >
                            Buy Now
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/products/${slugify(product.category)}/${slugify(product.name)}`); }}
                            className="w-full text-center text-sm border border-teal-600/60 text-teal-300 hover:text-white hover:bg-teal-600/20 font-medium py-2.5 rounded-lg transition-all duration-200"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* List Card */
                  <div
                    key={product._id}
                    onClick={() => navigate(`/products/${slugify(product.category)}/${slugify(product.name)}`)}
                    className="group bg-[#111111] rounded-2xl shadow-sm hover:shadow-2xl border border-gray-800 hover:border-teal-600/40 overflow-hidden transition-all duration-300 flex flex-col sm:flex-row cursor-pointer"
                  >
                    <div className="relative sm:w-48 md:w-64 h-50 sm:h-auto flex-shrink-0 bg-[#0f0f0f] overflow-hidden">
                      {/* Blurred Background Image */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center blur-xl scale-110"
                        style={{ backgroundImage: `url(${product.imageUrl})` }}
                      />
                      <img
                        src={product.imageUrl}
                        alt={`${product.name} - ${product.category} digital subscription tool`}
                        loading="lazy"
                        className="relative w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500 z-10"
                      />
                      <span className={`absolute top-3 left-3 bg-gradient-to-r ${categoryBadgeGradients[product.category] || 'from-teal-600 to-cyan-600'} text-white/95 text-xs font-medium px-3 py-1 rounded-full shadow-sm z-20`}>
                        {product.category}
                      </span>
                    </div>

                    <div className="p-6 flex flex-col flex-1 justify-between">
                      <div>
                        <h1 className="text-xl font-semibold text-white">
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
                        </h1>
                        <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                          {product.description || product.seoDescription || product.metaDescription}
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
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/products/${slugify(product.category)}/${slugify(product.name)}`); }}
                            className="inline-flex items-center gap-2 border border-teal-600/60 text-teal-300 hover:text-white hover:bg-teal-600/20 px-6 py-3 rounded-full font-medium transition-all duration-300"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-all ${
                    currentPage === 1
                      ? 'text-gray-600 cursor-not-allowed'
                      : 'text-teal-400 hover:bg-[#111111] border border-gray-800'
                  }`}
                >
                  <FaChevronLeft />
                </button>
                
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  // Show first page, last page, current page, and pages around current
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-4 py-2 rounded-lg transition-all ${
                          currentPage === pageNumber
                            ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white'
                            : 'text-gray-400 hover:bg-[#111111] border border-gray-800'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return <span key={pageNumber} className="text-gray-600">...</span>;
                  }
                  return null;
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition-all ${
                    currentPage === totalPages
                      ? 'text-gray-600 cursor-not-allowed'
                      : 'text-teal-400 hover:bg-[#111111] border border-gray-800'
                  }`}
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
            </>
          )}
        </div>
      </div>


    </>
  );
};

export default Product;