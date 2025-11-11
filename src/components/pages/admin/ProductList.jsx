// src/components/admin/ProductList.jsx
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
        <div style={{ padding: 20 }}>
            <h2>Products</h2>
            <button onClick={() => nav("/admin/products/new")}>Add Product</button>
            <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
                {items.map((p) => (
                    <div key={p._id} style={{ padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            <img src={p.imageUrl} style={{ width: 80, height: 80, objectFit: "contain" }} alt="" />
                            <div style={{ flex: 1 }}>
                                <strong>{p.name}</strong>
                                <div style={{ color: "#555" }}>{p.description}</div>
                                <div>Monthly: Rs {p.priceMonthly} • Yearly: Rs {p.priceYearly}</div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                <button onClick={() => nav(`/admin/products/edit/${p._id}`)}>Edit</button>
                                <button onClick={() => remove(p._id)} style={{ background: "tomato", color: "#fff" }}>
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
