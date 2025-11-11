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
