import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api/api";
import { Helmet } from "react-helmet-async";
import { FaCalendar, FaEye, FaArrowLeft, FaTag } from "react-icons/fa";

const BlogPost = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/blog/posts/${slug}`);
                setPost(res.data);

                // Fetch related posts
                const relatedRes = await api.get(`/blog/posts?category=${res.data.category}`);
                setRelatedPosts(relatedRes.data.filter(p => p.slug !== slug).slice(0, 3));
            } catch (err) {
                console.error("Error fetching blog post:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug]);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <p className="text-gray-400 text-lg">Blog post not found.</p>
            </div>
        );
    }

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "image": post.imageUrl,
        "author": {
            "@type": "Person",
            "name": post.author
        },
        "publisher": {
            "@type": "Organization",
            "name": "ServiceHub",
            "logo": {
                "@type": "ImageObject",
                "url": `${window.location.origin}/logo.png`
            }
        },
        "datePublished": post.createdAt,
        "dateModified": post.updatedAt,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": window.location.href
        }
    };

    return (
        <>
            <Helmet>
                <title>{post.metaTitle || post.title} | ServiceHub Blog</title>
                <meta name="description" content={post.metaDescription || post.excerpt} />
                <meta name="keywords" content={post.metaKeywords || post.tags?.join(', ')} />
                <link rel="canonical" href={window.location.href} />
                
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.excerpt} />
                <meta property="og:image" content={post.imageUrl} />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:type" content="article" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={post.title} />
                <meta name="twitter:description" content={post.excerpt} />
                <meta name="twitter:image" content={post.imageUrl} />

                <script type="application/ld+json">
                    {JSON.stringify(articleSchema)}
                </script>
            </Helmet>

            <div className="bg-[#0a0a0a] min-h-screen text-gray-100">
                {/* Back Button */}
                <div className="border-b border-gray-900">
                    <div className="max-w-4xl mx-auto px-4 py-4">
                        <button
                            onClick={() => navigate('/blog')}
                            className="flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors"
                        >
                            <FaArrowLeft />
                            Back to Blog
                        </button>
                    </div>
                </div>

                {/* Article Header */}
                <article className="max-w-4xl mx-auto px-4 py-12">
                    {post.imageUrl && (
                        <div className="mb-8 rounded-2xl overflow-hidden">
                            <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    )}

                    <div className="mb-6">
                        <span className="inline-block bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-sm font-medium px-4 py-1 rounded-full mb-4">
                            {post.category}
                        </span>
                        
                        <h1 className="text-4xl font-bold text-white mb-4">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <FaCalendar />
                                <span>{formatDate(post.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaEye />
                                <span>{post.viewCount || 0} views</span>
                            </div>
                            <span>By {post.author}</span>
                        </div>
                    </div>

                    {/* Article Content */}
                    <div className="prose prose-invert prose-lg max-w-none mb-12">
                        <div 
                            className="text-gray-300 leading-relaxed whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-3 mb-12 pb-12 border-b border-gray-800">
                            <FaTag className="text-gray-500" />
                            {post.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="bg-[#111111] text-gray-400 text-sm px-4 py-2 rounded-full border border-gray-800"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Related Posts */}
                    {relatedPosts.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-6">Related Articles</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {relatedPosts.map((relatedPost) => (
                                    <div
                                        key={relatedPost._id}
                                        onClick={() => navigate(`/blog/${relatedPost.slug}`)}
                                        className="group bg-[#111111] rounded-2xl overflow-hidden border border-gray-800 hover:border-teal-600/40 transition-all duration-300 cursor-pointer"
                                    >
                                        {relatedPost.imageUrl && (
                                            <div className="relative h-32 overflow-hidden">
                                                <img
                                                    src={relatedPost.imageUrl}
                                                    alt={relatedPost.title}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>
                                        )}
                                        <div className="p-4">
                                            <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-teal-400 transition-colors">
                                                {relatedPost.title}
                                            </h3>
                                            <p className="text-gray-400 text-sm line-clamp-2">
                                                {relatedPost.excerpt}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </article>
            </div>
        </>
    );
};

export default BlogPost;
