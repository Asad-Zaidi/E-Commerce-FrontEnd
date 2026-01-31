import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api/api";
import { toast } from "react-toastify";
import { IoSparkles } from "react-icons/io5";
import { TiArrowSortedUp, TiPin, TiBook, TiShoppingCart, TiCompass, TiTimes } from "react-icons/ti";
import { AiOutlineGlobal } from "react-icons/ai";

const ProductForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        seoDescription: "",
        metaTitle: "",
        metaDescription: "",
        metaKeywords: "",
        category: "",
        priceSharedMonthly: "",
        priceSharedYearly: "",
        privatePriceMonthly: "",
        privatePriceYearly: "",
        image: null,
    });

    const [enableMonthly, setEnableMonthly] = useState(true);
    const [enableYearly, setEnableYearly] = useState(false);
    const [enableShared, setEnableShared] = useState(false);
    const [enablePrivate, setEnablePrivate] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [seoLoading, setSeoLoading] = useState(false);
    const [metaTagsLoading, setMetaTagsLoading] = useState(false);
    const [keywordLoading, setKeywordLoading] = useState(false);
    const [keywordData, setKeywordData] = useState(null);
    const [showKeywords, setShowKeywords] = useState(false);
    const [categories, setCategories] = useState([]);

    // Fetch categories
    useEffect(() => {
        api.get("/categories").then((res) => setCategories(res.data));
    }, []);

    // Fetch product data if editing
    useEffect(() => {
        if (isEditing) {
            api.get(`/products/${id}`).then((res) => {
                const data = res.data;
                setFormData({
                    name: data.name,
                    description: data.description,
                    seoDescription: data.seoDescription || "",
                    metaTitle: data.metaTitle || "",
                    metaDescription: data.metaDescription || "",
                    metaKeywords: data.metaKeywords || "",
                    category: data.category,
                    priceSharedMonthly: data.priceSharedMonthly || "",
                    priceSharedYearly: data.priceSharedYearly || "",
                    privatePriceMonthly: data.privatePriceMonthly || "",
                    privatePriceYearly: data.privatePriceYearly || "",
                    image: null,
                });
                setEnableMonthly(Boolean(data.priceSharedMonthly));
                setEnableYearly(Boolean(data.priceSharedYearly));
                setEnableShared(Boolean(data.privatePriceMonthly));
                setEnablePrivate(Boolean(data.privatePriceYearly));
                setImagePreview(data.imageUrl);
            });
        }
    }, [id, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData((prev) => ({ ...prev, image: file }));
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setImagePreview(ev.target.result);
            reader.readAsDataURL(file);
        }
    };

    const generateSEO = async () => {
        if (!formData.name || !formData.category) {
            toast.error("Please fill Product Name and Category first");
            return;
        }
        setSeoLoading(true);
        try {
            const response = isEditing
                ? await api.post(`/products/${id}/generate-seo`)
                : await api.post("/products/temp/generate-seo", {
                    name: formData.name,
                    category: formData.category,
                    description: formData.description,
                });
            setFormData((prev) => ({ ...prev, seoDescription: response.data.seoDescription }));
            toast.success("SEO description generated successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to generate SEO description");
        } finally {
            setSeoLoading(false);
        }
    };

    const generateMetaTagsAI = async () => {
        if (!formData.name || !formData.category) {
            toast.error("Please fill Product Name and Category first");
            return;
        }
        setMetaTagsLoading(true);
        try {
            const response = await api.post("/products/temp/generate-meta-tags", {
                name: formData.name,
                category: formData.category,
                description: formData.description,
            });
            setFormData((prev) => ({
                ...prev,
                metaTitle: response.data.metaTitle,
                metaDescription: response.data.metaDescription,
                metaKeywords: response.data.metaKeywords,
            }));
            toast.success("Meta tags generated successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to generate meta tags");
        } finally {
            setMetaTagsLoading(false);
        }
    };

    const generateKeywordResearch = async () => {
        if (!formData.name || !formData.category) {
            toast.error("Please fill Product Name and Category first");
            return;
        }
        setKeywordLoading(true);
        try {
            const response = await api.post("/products/temp/keyword-research", {
                name: formData.name,
                category: formData.category,
                description: formData.description,
            });
            setKeywordData(response.data);
            setShowKeywords(true);
            toast.success("Keyword research generated successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to generate keyword research");
        } finally {
            setKeywordLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value) data.append(key, value);
            });
            if (!enableMonthly) data.delete("priceSharedMonthly");
            if (!enableYearly) data.delete("priceSharedYearly");
            if (!enableShared) data.delete("privatePriceMonthly");
            if (!enablePrivate) data.delete("privatePriceYearly");

            const config = { headers: { "Content-Type": "multipart/form-data" } };

            isEditing
                ? await api.put(`/products/${id}`, data, config)
                : await api.post("/products", data, config);

            toast.success(`Product ${isEditing ? "updated" : "added"} successfully!`);
            navigate("/admin/products");
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || "Error saving product";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const fieldVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" } }),
    };

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-5xl mx-auto bg-gray-800 text-gray-200 rounded-xl shadow-lg p-8"
            >
                <h2 className="text-2xl font-bold mb-6">{isEditing ? "Edit Product" : "Add New Product"}</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Product Name */}
                    <motion.div custom={0} initial="hidden" animate="visible" variants={fieldVariants}>
                        <label className="block text-sm font-medium mb-1">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg px-4 py-2 bg-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500"
                        />
                    </motion.div>

                    {/* Category */}
                    <motion.div custom={3} initial="hidden" animate="visible" variants={fieldVariants}>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg px-4 py-2 bg-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </motion.div>

                    {/* Description & SEO */}
                    <motion.div custom={1} initial="hidden" animate="visible" variants={fieldVariants}>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            name="description"
                            rows="3"
                            value={formData.description}
                            placeholder="Short summary about product in 10 to 20 words"
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg px-4 py-2 bg-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500"
                        />

                        <label className="block text-sm font-medium mb-1 mt-4">SEO Description</label>
                        <textarea
                            name="seoDescription"
                            rows="4"
                            value={formData.seoDescription}
                            placeholder="SEO optimized detailed description."
                            onChange={handleChange}
                            disabled={seoLoading}
                            className="w-full border rounded-lg px-4 py-2 bg-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={generateSEO}
                            disabled={seoLoading}
                            className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                            {seoLoading ? (
                                <>
                                    <span className="h-4 w-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                "Generate SEO"
                            )}
                        </button>
                    </motion.div>

                    {/* Meta Tags */}
                    <motion.div custom={2} initial="hidden" animate="visible" variants={fieldVariants} className="space-y-4 border-t pt-6">
                        <h3 className="text-lg font-semibold">Meta Tags (SEO)</h3>
                        <input
                            type="text"
                            name="metaTitle"
                            value={formData.metaTitle}
                            onChange={handleChange}
                            placeholder="Meta Title"
                            className="w-full border rounded-lg px-4 py-2 bg-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500"
                        />
                        <textarea
                            name="metaDescription"
                            rows="3"
                            value={formData.metaDescription}
                            onChange={handleChange}
                            placeholder="Meta Description"
                            className="w-full border rounded-lg px-4 py-2 bg-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            name="metaKeywords"
                            value={formData.metaKeywords}
                            onChange={handleChange}
                            placeholder="Meta Keywords"
                            className="w-full border rounded-lg px-4 py-2 bg-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={generateMetaTagsAI}
                            disabled={metaTagsLoading}
                            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {metaTagsLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <span className="h-4 w-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                                    Generating...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <IoSparkles className="text-lg" />
                                    Generate Meta Tags with AI
                                </div>
                            )}
                        </button>
                    </motion.div>

                    {/* Keyword Research */}
                    <motion.div custom={3} initial="hidden" animate="visible" variants={fieldVariants} className="space-y-4 border-t pt-6">
                        <h3 className="text-lg font-semibold">Keyword Research</h3>
                        <button
                            type="button"
                            onClick={generateKeywordResearch}
                            disabled={keywordLoading}
                            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {keywordLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <span className="h-4 w-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                                    Analyzing...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <IoSparkles className="text-lg" />
                                    Generate Keyword Research
                                </div>
                            )}
                        </button>

                        {showKeywords && keywordData && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 bg-gray-800 rounded-lg p-4 space-y-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-lg font-bold text-green-400">Keyword Analysis</h4>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowKeywords(false);
                                            setKeywordData(null);
                                        }}
                                        className="text-gray-400 hover:text-red-400 text-2xl p-1"
                                        title="Delete Keyword Analysis"
                                    >
                                        <TiTimes />
                                    </button>
                                </div>

                                <p className="text-gray-300 text-sm italic border-l-2 border-green-500 pl-3">{keywordData.summary}</p>

                                {/* Trending Keywords */}
                                {keywordData.trending && keywordData.trending.length > 0 && (
                                    <div className="bg-gray-700 rounded p-3">
                                        <h5 className="font-semibold text-blue-300 mb-2 flex items-center gap-2">
                                            <TiArrowSortedUp className="text-lg" /> Trending
                                        </h5>
                                        <div className="space-y-1 text-sm text-gray-200">
                                            {keywordData.trending.map((item, idx) => (
                                                <div key={idx} className="flex justify-between">
                                                    <span>{item.keyword}</span>
                                                    <span className="text-gray-400">Vol: {item.volume} | CPC: ${item.cpc}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Long Tail Keywords */}
                                {keywordData.longTail && keywordData.longTail.length > 0 && (
                                    <div className="bg-gray-700 rounded p-3">
                                        <h5 className="font-semibold text-blue-300 mb-2 flex items-center gap-2">
                                            <TiPin className="text-lg" /> Long Tail
                                        </h5>
                                        <div className="space-y-1 text-sm text-gray-200">
                                            {keywordData.longTail.map((item, idx) => (
                                                <div key={idx} className="flex justify-between">
                                                    <span>{item.keyword}</span>
                                                    <span className="text-gray-400">Vol: {item.volume} | CPC: ${item.cpc}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Transactional Keywords */}
                                {keywordData.transactional && keywordData.transactional.length > 0 && (
                                    <div className="bg-gray-700 rounded p-3">
                                        <h5 className="font-semibold text-yellow-300 mb-2 flex items-center gap-2">
                                            <TiShoppingCart className="text-lg" /> Transactional (Buying Intent)
                                        </h5>
                                        <div className="space-y-1 text-sm text-gray-200">
                                            {keywordData.transactional.map((item, idx) => (
                                                <div key={idx} className="flex justify-between">
                                                    <span>{item.keyword}</span>
                                                    <span className="text-gray-400">Vol: {item.volume} | CPC: ${item.cpc}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Informational Keywords */}
                                {keywordData.informational && keywordData.informational.length > 0 && (
                                    <div className="bg-gray-700 rounded p-3">
                                        <h5 className="font-semibold text-indigo-300 mb-2 flex items-center gap-2">
                                            <TiBook className="text-lg" /> Informational (Educational)
                                        </h5>
                                        <div className="space-y-1 text-sm text-gray-200">
                                            {keywordData.informational.map((item, idx) => (
                                                <div key={idx} className="flex justify-between">
                                                    <span>{item.keyword}</span>
                                                    <span className="text-gray-400">Vol: {item.volume} | CPC: ${item.cpc}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Navigational Keywords */}
                                {keywordData.navigational && keywordData.navigational.length > 0 && (
                                    <div className="bg-gray-700 rounded p-3">
                                        <h5 className="font-semibold text-cyan-300 mb-2 flex items-center gap-2">
                                            <TiCompass className="text-lg" /> Navigational
                                        </h5>
                                        <div className="space-y-1 text-sm text-gray-200">
                                            {keywordData.navigational.map((item, idx) => (
                                                <div key={idx} className="flex justify-between">
                                                    <span>{item.keyword}</span>
                                                    <span className="text-gray-400">Vol: {item.volume} | CPC: ${item.cpc}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Pakistani Searches */}
                                {keywordData.pakistaniSearches && keywordData.pakistaniSearches.length > 0 && (
                                    <div className="bg-gray-700 rounded p-3">
                                        <h5 className="font-semibold text-pink-300 mb-2 flex items-center gap-2">
                                            <AiOutlineGlobal className="text-lg" /> Pakistani Market Searches
                                        </h5>
                                        <div className="space-y-1 text-sm text-gray-200">
                                            {keywordData.pakistaniSearches.map((item, idx) => (
                                                <div key={idx} className="flex justify-between">
                                                    <span>{item.keyword}</span>
                                                    <span className="text-gray-400">Vol: {item.volume} | CPC: ${item.cpc}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Prices */}
                    <motion.div custom={4} initial="hidden" animate="visible" variants={fieldVariants}>
                        <h3 className="text-lg font-semibold mb-3">Shared Account Prices</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="flex items-center gap-2 mb-2">
                                    <input type="checkbox" checked={enableMonthly} onChange={() => setEnableMonthly(!enableMonthly)} />
                                    Enable Monthly Price
                                </label>
                                {enableMonthly && (
                                    <input
                                        type="number"
                                        name="priceSharedMonthly"
                                        value={formData.priceSharedMonthly}
                                        onChange={handleChange}
                                        placeholder="Shared Monthly price"
                                        className="w-full border rounded-lg px-4 py-2 bg-gray-700 text-gray-200"
                                    />
                                )}
                            </div>
                            <div>
                                <label className="flex items-center gap-2 mb-2">
                                    <input type="checkbox" checked={enableYearly} onChange={() => setEnableYearly(!enableYearly)} />
                                    Enable Yearly Price
                                </label>
                                {enableYearly && (
                                    <input
                                        type="number"
                                        name="priceSharedYearly"
                                        value={formData.priceSharedYearly}
                                        onChange={handleChange}
                                        placeholder="Shared Yearly price"
                                        className="w-full border rounded-lg px-4 py-2 bg-gray-700 text-gray-200"
                                    />
                                )}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div custom={5} initial="hidden" animate="visible" variants={fieldVariants}>
                        <h3 className="text-lg font-semibold mb-3">Private Account Prices</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="flex items-center gap-2 mb-2">
                                    <input type="checkbox" checked={enableShared} onChange={() => setEnableShared(!enableShared)} />
                                    Enable Private Price
                                </label>
                                {enableShared && (
                                    <input
                                        type="number"
                                        name="privatePriceMonthly"
                                        value={formData.privatePriceMonthly}
                                        onChange={handleChange}
                                        placeholder="Private Monthly price"
                                        className="w-full border rounded-lg px-4 py-2 bg-gray-700 text-gray-200"
                                    />
                                )}
                            </div>
                            <div>
                                <label className="flex items-center gap-2 mb-2">
                                    <input type="checkbox" checked={enablePrivate} onChange={() => setEnablePrivate(!enablePrivate)} />
                                    Enable Private Price
                                </label>
                                {enablePrivate && (
                                    <input
                                        type="number"
                                        name="privatePriceYearly"
                                        value={formData.privatePriceYearly}
                                        onChange={handleChange}
                                        placeholder="Private Yearly price"
                                        className="w-full border rounded-lg px-4 py-2 bg-gray-700 text-gray-200"
                                    />
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Image */}
                    <motion.div custom={6} initial="hidden" animate="visible" variants={fieldVariants}>
                        <label className="block text-sm font-medium mb-1">Product Image</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="text-gray-200" />
                        {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 w-40 h-40 object-cover rounded-lg border" />}
                    </motion.div>

                    {/* Submit */}
                    <motion.div custom={7} initial="hidden" animate="visible" variants={fieldVariants} className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:opacity-60 w-full sm:w-auto"
                        >
                            {loading ? "Saving..." : isEditing ? "Update Product" : "Add Product"}
                        </button>
                    </motion.div>
                </form>
            </motion.div>
        </div>
    );
};

export default ProductForm;
