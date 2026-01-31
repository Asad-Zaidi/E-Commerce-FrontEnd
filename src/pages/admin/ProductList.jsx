import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function ProductList() {
    const [items, setItems] = useState([]);
    const nav = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get("/products");
            setItems(res.data);
        } catch (err) {
            console.error("Failed to fetch products:", err);
        }
    };

    const remove = async (id) => {
        if (!window.confirm("Delete product?")) return;
        try {
            await api.delete(`/products/${id}`);
            fetchProducts();
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Delete failed");
        }
    };

    // Framer Motion variants for fade-in + slide-up
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
        }),
    };

    return (
        <div className="p-5 min-h-screen bg-gray-900 text-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
                <h2 className="text-2xl font-semibold">Products</h2>

                <button
                    onClick={() => nav("/admin/products/new")}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                >
                    Add Product
                </button>
            </div>

            <div className="grid gap-4">
                {items.map((p, index) => (
                    <motion.div
                        key={p._id}
                        className="p-4 border border-gray-700 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants}
                    >
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                            <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="w-full sm:w-24 h-24 object-contain rounded-md border border-gray-600"
                            />

                            <div className="flex-1">
                                <strong className="block text-lg">{p.name}</strong>
                                <div className="text-gray-400 text-sm mt-1">{p.description}</div>
                                <div className="text-gray-400 text-sm mt-1">
                                    Shared Monthly: Rs {p.priceSharedMonthly} • Shared Yearly: Rs{" "}
                                    {p.priceSharedYearly}
                                </div>
                            </div>

                            <div className="flex flex-row sm:flex-col gap-2 mt-2 sm:mt-0">
                                <button
                                    onClick={() => nav(`/admin/products/edit/${p._id}`)}
                                    className="px-3 py-1 border  bg-green-600 border-gray-600 rounded-md hover:bg-green-700 transition"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => remove(p._id)}
                                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
