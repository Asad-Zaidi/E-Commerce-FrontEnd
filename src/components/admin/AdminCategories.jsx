import React, { useEffect, useState } from "react";
import api from "../../api/api";
import "./AdminCategories.css";

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Fetch all categories
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await api.get("/categories");
            setCategories(res.data);
        } catch (err) {
            console.error("Error fetching categories:", err);
            setMessage("Failed to fetch categories.");
        } finally {
            setLoading(false);
        }
    };

    // Add a new category
    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) {
            setMessage("⚠️ Please enter a category name.");
            return;
        }

        try {
            setLoading(true);
            const res = await api.post("/categories/add", { name: newCategory });
            setMessage(`✅ ${res.data.message}`);
            setNewCategory("");
            fetchCategories();
        } catch (err) {
            console.error("Error adding category:", err);
            setMessage("❌ Error adding category. Maybe it already exists?");
        } finally {
            setLoading(false);
        }
    };

    // Delete a category
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            setLoading(true);
            await api.delete(`/categories/${id}`);
            setMessage("🗑️ Category deleted successfully.");
            fetchCategories();
        } catch (err) {
            console.error("Error deleting category:", err);
            setMessage("❌ Failed to delete category.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="admin-categories">
            <h2>Manage Categories</h2>

            <form onSubmit={handleAdd} className="category-form">
                <input
                    type="text"
                    placeholder="Enter category name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Please wait..." : "Add"}
                </button>
            </form>

            {message && <p className="category-message">{message}</p>}

            {loading && categories.length === 0 ? (
                <p>Loading categories...</p>
            ) : (
                <ul className="category-list">
                    {categories.map((cat) => (
                        <li key={cat._id}>
                            <span>{cat.name}</span>
                            <button
                                onClick={() => handleDelete(cat._id)}
                                className="delete-btn"
                                disabled={loading}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AdminCategories;
