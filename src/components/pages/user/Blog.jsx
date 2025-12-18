import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/api";
import { Helmet } from "react-helmet-async";
import { FaSearch, FaCalendar, FaEye, FaArrowRight } from "react-icons/fa";

const Blog = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const params = {};
                if (selectedCategory !== "All") params.category = selectedCategory;
                if (searchTerm) params.search = searchTerm;

                const res = await api.get("/blog/posts", { params });
                setPosts(res.data);
            } catch (err) {
                console.error("Error fetching blog posts:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
        fetchCategories();
    }, [selectedCategory, searchTerm]);

    const fetchCategories = async () => {
        try {
            const res = await api.get("/blog/categories");
            setCategories(["All", ...res.data]);
        } catch (err) {
            console.error("Error fetching categories:", err);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <>
            <Helmet>
                <title>Blog | ServiceHub - Digital Tools & Subscription Guides</title>
                <meta name="description" content="Explore guides, tutorials, and insights about digital tools, subscriptions, and productivity tips." />
                <meta name="keywords" content="blog, guides, tutorials, digital tools, subscriptions, productivity, tips" />
                <link rel="canonical" href={`${window.location.origin}/blog`} />
            </Helmet>

            <div className="bg-[#0a0a0a] min-h-screen text-gray-100">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-teal-900/20 to-cyan-900/20 border-b border-gray-900">
                    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
                            Blog & Resources
                        </h1>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
                            Guides, reviews, and how-to articles about digital tools and subscriptions
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto relative">
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-full py-4 pl-6 pr-14 text-gray-100 bg-white/5 border border-gray-800 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-teal-600/30 shadow-2xl text-sm transition-all duration-300 placeholder:text-gray-500"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-white/90 bg-gradient-to-r from-teal-600 to-cyan-600 w-10 h-10 rounded-full transition-transform duration-300 shadow-lg shadow-teal-900/40 flex items-center justify-center">
                                <FaSearch className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-12">
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-3 mb-8">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-2 rounded-full font-medium transition-all ${
                                    selectedCategory === cat
                                        ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white"
                                        : "bg-[#111111] text-gray-400 border border-gray-800 hover:border-gray-700"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Blog Posts Grid */}
                    {loading ? (
                        <div className="text-center py-16">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-gray-400 text-lg">No blog posts found.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map((post) => (
                                <article
                                    key={post._id}
                                    onClick={() => navigate(`/blog/${post.slug}`)}
                                    className="group bg-[#111111] rounded-2xl overflow-hidden border border-gray-800 hover:border-teal-600/40 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-teal-900/20"
                                >
                                    {post.imageUrl && (
                                        <div className="relative h-48 overflow-hidden bg-[#0f0f0f]">
                                            <img
                                                src={post.imageUrl}
                                                alt={post.title}
                                                loading="lazy"
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <span className="absolute top-3 left-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                                                {post.category}
                                            </span>
                                        </div>
                                    )}

                                    <div className="p-6">
                                        <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-teal-400 transition-colors">
                                            {post.title}
                                        </h2>

                                        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                                            {post.excerpt}
                                        </p>

                                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                            <div className="flex items-center gap-2">
                                                <FaCalendar />
                                                <span>{formatDate(post.createdAt)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaEye />
                                                <span>{post.viewCount || 0} views</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center text-teal-400 font-medium text-sm group-hover:text-teal-300">
                                            Read More
                                            <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Blog;
