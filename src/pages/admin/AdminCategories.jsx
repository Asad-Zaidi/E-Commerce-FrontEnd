import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Confetti from "react-confetti";

// Lightweight local replacement for react-use's useWindowSize
const useWindowSizeLocal = () => {
    const [size, setSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const onResize = () =>
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    return size;
};

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [addedCategoryId, setAddedCategoryId] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);

    const { width, height } = useWindowSizeLocal();

    // Fetch categories
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await api.get("/categories");
            setCategories(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch categories.");
        } finally {
            setLoading(false);
        }
    };

    // Add category
    const handleAdd = async (e) => {
        e.preventDefault();

        if (!newCategory.trim()) {
            toast.warn(
                <span className="flex items-center gap-2">
                    Please enter a category name.
                </span>
            );
            return;
        }

        try {
            setLoading(true);
            const res = await api.post("/categories/add", {
                name: newCategory,
            });

            toast.success(
                <span className="flex items-center gap-2">
                    {res.data.message}
                </span>
            );

            setAddedCategoryId(res.data._id || null);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);

            setNewCategory("");
            fetchCategories();
        } catch (err) {
            console.error(err);
            toast.error(
                <span className="flex items-center gap-2">
                    Error adding category. It may already exist.
                </span>
            );
        } finally {
            setLoading(false);
        }
    };

    // Delete category
    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await api.delete(`/categories/${id}`);

            toast.success(
                <span className="flex items-center gap-2">
                    Category deleted successfully.
                </span>
            );

            fetchCategories();
        } catch (err) {
            console.error(err);
            toast.error(
                <span className="flex items-center gap-2">
                    Failed to delete category.
                </span>
            );
        } finally {
            setLoading(false);
            setShowDeleteModal(false);
            setDeleteId(null);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-6 flex items-center justify-center">
            <style>{`.hide-scrollbar::-webkit-scrollbar{display:none;}`}</style>
            {/* Confetti */}
            {showConfetti && (
                <Confetti width={width} height={height} recycle={false} />
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-3xl bg-gray-800 rounded-xl shadow-lg p-6"
                style={{ maxHeight: "100vh", overflow: "hidden" }}
            >
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Manage Categories
                </h2>

                {/* Add Category Form */}
                <motion.form
                    onSubmit={handleAdd}
                    className="flex flex-col sm:flex-row gap-4 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <input
                        type="text"
                        placeholder="Enter category name"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-60 flex items-center justify-center"
                    >
                        {loading ? (
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                />
                            </svg>
                        ) : (
                            "Add"
                        )}
                    </button>
                </motion.form>

                {/* Categories List */}
                <div
                    className="hide-scrollbar overflow-y-auto"
                    style={{ maxHeight: "50vh", scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    <ul className="space-y-2">
                        <AnimatePresence>
                            {categories.map((cat) => (
                                <motion.li
                                    key={cat._id}
                                    initial={{ opacity: 0, x: -40 }}
                                    animate={{
                                        opacity: 1,
                                        x: 0,
                                        backgroundColor:
                                            addedCategoryId === cat._id
                                                ? "#34D399"
                                                : "#374151",
                                    }}
                                    exit={{ opacity: 0, x: 40 }}
                                    transition={{ duration: 0.35 }}
                                    className="flex justify-between items-center p-3 rounded-lg"
                                >
                                    <span>{cat.name}</span>

                                    <button
                                        onClick={() => {
                                            setDeleteId(cat._id);
                                            setShowDeleteModal(true);
                                        }}
                                        className="px-4 py-1 bg-red-600 hover:bg-red-700 rounded-lg"
                                        disabled={loading}
                                    >
                                        Delete
                                    </button>
                                </motion.li>
                            ))}
                        </AnimatePresence>
                    </ul>
                </div>
            </motion.div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.85 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.85 }}
                            className="bg-gray-800 rounded-xl p-6 w-80 text-center shadow-lg"
                        >
                            <p className="mb-4">
                                Are you sure you want to delete this category?
                            </p>

                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => handleDelete(deleteId)}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() =>
                                        setShowDeleteModal(false)
                                    }
                                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Global Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
                    <svg
                        className="animate-spin h-10 w-10 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                    </svg>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
