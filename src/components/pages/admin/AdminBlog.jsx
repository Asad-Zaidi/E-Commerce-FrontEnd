import React, { useState, useEffect } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaSave, FaTimes, FaMagic } from "react-icons/fa";
import AIGeneratingAnimation from "../../AIGeneratingAnimation";

const AdminBlog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [generatingAI, setGeneratingAI] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        author: "Admin",
        category: "",
        tags: "",
        imageUrl: "",
        metaTitle: "",
        metaDescription: "",
        metaKeywords: "",
        published: false
    });

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const res = await api.get("/blog/admin/posts");
            setPosts(res.data);
        } catch (err) {
            console.error("Error fetching blog posts:", err);
            toast.error("Failed to fetch blog posts");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });

        // Auto-generate slug from title
        if (name === "title" && !editingPost) {
            const slug = value
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-+|-+$/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.content || !formData.excerpt || !formData.category) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            // Convert tags string to array
            const postData = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
            };

            if (editingPost) {
                await api.put(`/blog/admin/posts/${editingPost._id}`, postData);
                toast.success("Blog post updated successfully");
            } else {
                await api.post("/blog/admin/posts", postData);
                toast.success("Blog post created successfully");
            }

            resetForm();
            fetchPosts();
        } catch (err) {
            console.error("Error saving blog post:", err);
            toast.error(err.response?.data?.message || "Failed to save blog post");
        }
    };

    const handleEdit = (post) => {
        setEditingPost(post);
        setFormData({
            title: post.title,
            slug: post.slug,
            content: post.content,
            excerpt: post.excerpt,
            author: post.author || "Admin",
            category: post.category,
            tags: post.tags?.join(', ') || "",
            imageUrl: post.imageUrl || "",
            metaTitle: post.metaTitle || "",
            metaDescription: post.metaDescription || "",
            metaKeywords: post.metaKeywords || "",
            published: post.published
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this blog post?")) {
            return;
        }

        try {
            await api.delete(`/blog/admin/posts/${id}`);
            toast.success("Blog post deleted successfully");
            fetchPosts();
        } catch (err) {
            console.error("Error deleting blog post:", err);
            toast.error("Failed to delete blog post");
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            slug: "",
            content: "",
            excerpt: "",
            author: "Admin",
            category: "",
            tags: "",
            imageUrl: "",
            metaTitle: "",
            metaDescription: "",
            metaKeywords: "",
            published: false
        });
        setEditingPost(null);
        setShowForm(false);
    };

    const handleGenerateWithAI = async () => {
        if (!formData.title) {
            toast.error("Please enter a title first to generate content");
            return;
        }

        try {
            setGeneratingAI(true);

            const response = await api.post("/blog/admin/generate-ai", {
                title: formData.title,
                category: formData.category || "General"
            });

            if (response.data.success) {
                setFormData(prev => ({
                    ...prev,
                    content: response.data.content,
                    excerpt: response.data.excerpt,
                    tags: response.data.tags.join(', ')
                }));
                toast.success("✅ Blog content generated successfully! Review and edit as needed.");
            } else {
                toast.error("Failed to generate content");
            }
        } catch (error) {
            console.error("AI generation error:", error);
            toast.error(error.response?.data?.message || "Failed to generate AI content. Please try again.");
        } finally {
            setGeneratingAI(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            {/* AI Generating Animation */}
            {generatingAI && <AIGeneratingAnimation />}

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog Management</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Create and manage blog posts</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200"
                    >
                        {showForm ? <FaTimes /> : <FaPlus />}
                        {showForm ? "Cancel" : "New Post"}
                    </button>
                </div>

                {/* Form */}
                {showForm && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            {editingPost ? "Edit Blog Post" : "Create New Blog Post"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Title */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="Enter blog post title"
                                    />
                                </div>

                                {/* Slug */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Slug *
                                    </label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="auto-generated-from-title"
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="">Select category</option>
                                        <option value="Guides">Guides</option>
                                        <option value="Tutorials">Tutorials</option>
                                        <option value="Reviews">Reviews</option>
                                        <option value="How-to">How-to</option>
                                        <option value="News">News</option>
                                        <option value="Tips">Tips</option>
                                    </select>
                                </div>

                                {/* Author */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Author
                                    </label>
                                    <input
                                        type="text"
                                        name="author"
                                        value={formData.author}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="Admin"
                                    />
                                </div>

                                {/* Image URL */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Featured Image URL
                                    </label>
                                    <input
                                        type="url"
                                        name="imageUrl"
                                        value={formData.imageUrl}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>

                                {/* Excerpt */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Excerpt *
                                    </label>
                                    <textarea
                                        name="excerpt"
                                        value={formData.excerpt}
                                        onChange={handleInputChange}
                                        required
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="Short description for listing pages"
                                    />
                                </div>

                                {/* Content */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Content *
                                    </label>
                                    <textarea
                                        name="content"
                                        value={formData.content}
                                        onChange={handleInputChange}
                                        required
                                        rows="10"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                                        placeholder="Full blog post content (HTML supported)"
                                    />
                                </div>

                                {/* Tags */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Tags (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        name="tags"
                                        value={formData.tags}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="tutorials, subscriptions, getting-started"
                                    />
                                </div>

                                {/* SEO Fields */}
                                <div className="md:col-span-2">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b dark:border-gray-700 pb-2">
                                        SEO Settings
                                    </h3>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Meta Title
                                    </label>
                                    <input
                                        type="text"
                                        name="metaTitle"
                                        value={formData.metaTitle}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="Leave empty to use post title"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Meta Description
                                    </label>
                                    <textarea
                                        name="metaDescription"
                                        value={formData.metaDescription}
                                        onChange={handleInputChange}
                                        rows="2"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="Leave empty to use excerpt"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Meta Keywords
                                    </label>
                                    <input
                                        type="text"
                                        name="metaKeywords"
                                        value={formData.metaKeywords}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="keyword1, keyword2, keyword3"
                                    />
                                </div>

                                {/* Published Checkbox */}
                                <div className="md:col-span-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="published"
                                            checked={formData.published}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Publish immediately
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex justify-between items-center pt-4">
                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200"
                                    >
                                        <FaSave />
                                        {editingPost ? "Update Post" : "Create Post"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                                    >
                                        Cancel
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleGenerateWithAI}
                                    disabled={generatingAI || !formData.title}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                                        generatingAI || !formData.title
                                            ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500 dark:text-gray-400'
                                            : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl'
                                    }`}
                                    title={!formData.title ? "Enter a title first" : "Generate content with AI"}
                                >
                                    <FaMagic className={generatingAI ? "animate-spin" : ""} />
                                    {generatingAI ? "Generating..." : "Generate by AI"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Posts List */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">All Blog Posts</h2>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                            No blog posts yet. Create your first post!
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-900">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Title
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Views
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {posts.map((post) => (
                                        <tr key={post._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    {post.imageUrl && (
                                                        <img
                                                            src={post.imageUrl}
                                                            alt={`${post.title} - Blog post thumbnail`}
                                                            className="w-12 h-12 rounded object-cover mr-3"
                                                        />
                                                    )}
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {post.title}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {post.slug}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200">
                                                    {post.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${
                                                    post.published
                                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                                }`}>
                                                    {post.published ? <FaEye /> : <FaEyeSlash />}
                                                    {post.published ? "Published" : "Draft"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {post.viewCount || 0}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {formatDate(post.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(post)}
                                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-2"
                                                        title="Edit"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(post._id)}
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-2"
                                                        title="Delete"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminBlog;
