import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { useNavigate } from "react-router-dom";

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

    return (
        <div className="p-5">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Products</h2>

                <button
                    onClick={() => nav("/admin/products/new")}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                >
                    Add Product
                </button>
            </div>

            <div className="grid gap-3">
                {items.map((p) => (
                    <div
                        key={p._id}
                        className="p-3 border border-gray-200 rounded-lg bg-white"
                    >
                        <div className="flex gap-3 items-center">
                            <img
                                src={p.imageUrl}
                                alt=""
                                className="w-20 h-20 object-contain"
                            />

                            <div className="flex-1">
                                <strong className="block text-lg">
                                    {p.name}
                                </strong>

                                <div className="text-gray-600 text-sm">
                                    {p.description}
                                </div>

                                <div className="text-sm mt-1">
                                    Shared Monthly: Rs {p.priceSharedMonthly} • Shared Yearly: Rs{" "}
                                    {p.priceSharedYearly}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() =>
                                        nav(`/admin/products/edit/${p._id}`)
                                    }
                                    className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition"
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
                    </div>
                ))}
            </div>
        </div>
    );
}
