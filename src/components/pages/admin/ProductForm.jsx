import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/api";
import "../../../styles/ProductForm.css";

const ProductForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        seoDescription: "",
        category: "",
        priceMonthly: "",
        priceYearly: "",
        priceShared: "",
        pricePrivate: "",
        image: null,
    });

    const [enableMonthly, setEnableMonthly] = useState(true);
    const [enableYearly, setEnableYearly] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [seoLoading, setSeoLoading] = useState(false);

    // const categories = [
    //     "Entertainment",
    //     "AI Tools",
    //     "Education",
    //     "Social Media",
    //     "Productivity",
    //     "Other",
    // ];

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        api.get("/categories").then((res) => setCategories(res.data));
    }, []);


    // ✅ Fetch product if editing
    useEffect(() => {
        if (isEditing) {
            api.get(`/products/${id}`).then((res) => {
                const data = res.data;
                setFormData({
                    name: data.name,
                    description: data.description,
                    seoDescription: data.seoDescription || "",
                    category: data.category,
                    priceMonthly: data.priceMonthly || "",
                    priceYearly: data.priceYearly || "",
                    priceShared: data.priceShared || "",
                    pricePrivate: data.pricePrivate || "",
                    image: null,
                });
                setEnableMonthly(Boolean(data.priceMonthly));
                setEnableYearly(Boolean(data.priceYearly));
                setImagePreview(data.imageUrl);
            });
        }
    }, [id, isEditing]);

    // ✅ Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // ✅ Generate SEO Description
    const generateSEO = async () => {
        if (!formData.name || !formData.category) {
            alert("Please fill in Product Name and Category first");
            return;
        }

        setSeoLoading(true);
        try {
            // For new products, we'll generate SEO without saving to DB first
            if (!isEditing) {
                // Create a temporary product object for SEO generation
                const tempProduct = {
                    name: formData.name,
                    category: formData.category,
                    description: formData.description
                };

                const response = await api.post('/products/temp/generate-seo', tempProduct);
                setFormData((prev) => ({ ...prev, seoDescription: response.data.seoDescription }));
                alert("✅ SEO description generated successfully!");
            } else {
                // For existing products, use the existing endpoint
                const response = await api.post(`/products/${id}/generate-seo`);
                setFormData((prev) => ({ ...prev, seoDescription: response.data.seoDescription }));
                alert("✅ SEO description generated successfully!");
            }
        } catch (err) {
            console.error("❌ SEO Generation failed:", err);
            alert("❌ Failed to generate SEO description");
        } finally {
            setSeoLoading(false);
        }
    };

    // ✅ Handle image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData((prev) => ({ ...prev, image: file }));
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setImagePreview(ev.target.result);
            reader.readAsDataURL(file);
        }
        else if (formData.imageUrl) {
            setImagePreview(formData.imageUrl);
        }

    };

    // ✅ Submit form
    // ✅ Submit form (fixed)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== "" && value !== null) data.append(key, value);
            });

            if (!enableMonthly) data.delete("priceMonthly");
            if (!enableYearly) data.delete("priceYearly");

            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            };

            if (isEditing) {
                await api.put(`/products/${id}`, data, config);
                alert("✅ Product updated successfully!");
            } else {
                await api.post("/products", data, config);
                alert("✅ Product added successfully!");
            }

            navigate("/admin/products");
        } catch (err) {
            console.error("❌ Error saving product:", err);
            alert("❌ Error saving product!");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="admin-form-container">
            <h2>{isEditing ? "Edit Product" : "Add New Product"}</h2>
            <form className="product-form" onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="form-group">
                    <label>Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>

                <div className="form-group">
                    <label>SEO Description</label>
                    <div className="seo-description-group">
                        <textarea
                            name="seoDescription"
                            rows="4"
                            value={formData.seoDescription}
                            onChange={handleChange}
                            placeholder="AI-generated SEO optimized description will appear here..."
                            disabled={seoLoading}
                        ></textarea>
                        <button
    type="button"
    onClick={generateSEO}
    className={`generate-seo-btn flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
        seoLoading ? "opacity-70 cursor-not-allowed" : ""
    }`}
    disabled={!formData.name || !formData.category || seoLoading}
>
    {seoLoading ? (
        <>
            <span className="loader w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Generating SEO...
        </>
    ) : (
        "Generate SEO"
    )}
</button>

                    </div>
                    <small className="form-help">
                        Click "Generate SEO" to create an AI-optimized description for better search engine rankings.
                    </small>
                </div>

                <div className="form-group">
                    <label>Category</label>
                    {/* <select name="category" value={formData.category} onChange={handleChange} required>
                        <option value="">-- Select Category --</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select> */}
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>


                </div>

                <div className="price-section">
                    <label>
                        <input
                            type="checkbox"
                            checked={enableMonthly}
                            onChange={() => setEnableMonthly(!enableMonthly)}
                        />{" "}
                        Enable Monthly Price
                    </label>
                    {enableMonthly && (
                        <input
                            type="number"
                            name="priceMonthly"
                            placeholder="Enter Monthly Price"
                            value={formData.priceMonthly}
                            onChange={handleChange}
                        />
                    )}

                    <label>
                        <input
                            type="checkbox"
                            checked={enableYearly}
                            onChange={() => setEnableYearly(!enableYearly)}
                        />{" "}
                        Enable Yearly Price
                    </label>
                    {enableYearly && (
                        <input
                            type="number"
                            name="priceYearly"
                            placeholder="Enter Yearly Price"
                            value={formData.priceYearly}
                            onChange={handleChange}
                        />
                    )}
                </div>

                <div className="form-group dual-prices">
                    <div>
                        <label>Shared Price</label>
                        <input
                            type="number"
                            name="priceShared"
                            placeholder="e.g. 999"
                            value={formData.priceShared}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Private Price</label>
                        <input
                            type="number"
                            name="pricePrivate"
                            placeholder="e.g. 1999"
                            value={formData.pricePrivate}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Product Image</label>
                    <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
                    {imagePreview && (
                        <div className="image-preview">
                            <img src={imagePreview} alt="Preview" />
                        </div>
                    )}
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Saving..." : isEditing ? "Update Product" : "Add Product"}
                </button>
            </form>
        </div>
    );
};

export default ProductForm;


