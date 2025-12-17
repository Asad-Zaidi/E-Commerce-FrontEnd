import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
    FiTrash2,
    FiPlus,
    FiX,
    FiToggleLeft,
    FiToggleRight,
    FiImage
} from "react-icons/fi";
import api from "../../../api/api";

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
};

const AdminHome = () => {
    const [hero, setHero] = useState([]);
    const [features, setFeatures] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirm, setConfirm] = useState(null);

    const fetchHomeData = async () => {
        try {
            setLoading(true);
            const [h, f, t, b] = await Promise.all([
                api.get("/home/hero"),
                api.get("/home/features"),
                api.get("/home/testimonials"),
                api.get("/banners/all")
            ]);
            setHero(h.data);
            setFeatures(f.data);
            setTestimonials(t.data);
            setBanners(b.data);
        } catch {
            toast.error("Failed to load home data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHomeData();
    }, []);

    const confirmDelete = (endpoint, id) => {
        setConfirm({
            message: "Are you sure you want to delete this item?",
            action: async () => {
                try {
                    await api.delete(`${endpoint}/${id}`);
                    toast.success("Item deleted successfully");
                    fetchHomeData();
                } catch {
                    toast.error("Delete failed");
                }
                setConfirm(null);
            }
        });
    };

    const toggleStatus = async (endpoint, id) => {
        try {
            await api.put(`${endpoint}/${id}/toggle`);
            toast.success("Status updated");
            fetchHomeData();
        } catch {
            toast.error("Failed to update status");
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 z-50">
                <div className="h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-full bg-gray-900 text-gray-200 p-8 max-w-full">
            <h2 className="text-2xl font-semibold mb-6">Manage Home Page</h2>

            <Section title="Hero Section">
                {hero.map(item => (
                    <Card
                        key={item._id}
                        item={item}
                        image
                        onDelete={() => confirmDelete("/home/hero", item._id)}
                        onToggle={() => toggleStatus("/home/hero", item._id)}
                    />
                ))}
            </Section>

            <Section title="Features Section">
                {features.map(item => (
                    <Card
                        key={item._id}
                        item={item}
                        onDelete={() => confirmDelete("/home/features", item._id)}
                        onToggle={() => toggleStatus("/home/features", item._id)}
                    />
                ))}
            </Section>

            <Section title="Testimonials Section">
                {testimonials.map(item => (
                    <Card
                        key={item._id}
                        item={item}
                        image
                        onDelete={() => confirmDelete("/home/testimonials", item._id)}
                        onToggle={() => toggleStatus("/home/testimonials", item._id)}
                    />
                ))}
            </Section>

            <Section title="Banners Section">
                {banners.map(item => (
                    <Card
                        key={item._id}
                        item={item}
                        image
                        onDelete={() => confirmDelete("/banners", item._id)}
                        onToggle={() => toggleStatus("/banners", item._id)}
                    />
                ))}
            </Section>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {confirm && (
                    <motion.div
                        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-gray-800 rounded-xl p-6 w-full max-w-sm"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                        >
                            <p className="mb-6">{confirm.message}</p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setConfirm(null)}
                                    className="px-4 py-2 rounded bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirm.action}
                                    className="px-4 py-2 rounded bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

/* ---------- Section Wrapper ---------- */

const Section = ({ title, children }) => {
    const [showForm, setShowForm] = useState(false);

    return (
        <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mb-10"
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium">{title}</h3>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-purple-600 px-4 py-2 rounded"
                >
                    {showForm ? <FiX /> : <FiPlus />}
                    {showForm ? "Close" : "Add New"}
                </button>
            </div>

            {showForm && <HomeForm sectionTitle={title} />}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {children}
            </div>
        </motion.div>
    );
};

/* ---------- Card ---------- */

const Card = ({ item, image, onDelete, onToggle }) => (
    <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="bg-gray-800 rounded-xl p-4 shadow-lg hover:shadow-purple-900/30 transition"
    >
        {image && item.imageUrl && (
            <img
                src={item.imageUrl}
                alt={item.title}
                className="h-40 w-full object-cover rounded mb-3"
            />
        )}

        <h4 className="font-semibold">{item.title || item.name}</h4>
        {item.subtitle && <p className="text-sm text-gray-400">{item.subtitle}</p>}

        <div className="flex justify-between items-center mt-4">
            <button
                onClick={onToggle}
                className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${item.isActive ? "bg-green-600" : "bg-gray-600"
                    }`}
            >
                {item.isActive ? <FiToggleRight /> : <FiToggleLeft />}
                {item.isActive ? "Active" : "Inactive"}
            </button>

            <button
                onClick={onDelete}
                className="flex items-center gap-1 text-red-400 hover:text-red-500"
            >
                <FiTrash2 />
                Delete
            </button>
        </div>
    </motion.div>
);

/* ---------- Form ---------- */

const HomeForm = ({ sectionTitle }) => {
    const [form, setForm] = useState({ title: "", subtitle: "", link: "" });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");

    const endpoint =
        sectionTitle.includes("Hero")
            ? "/home/hero"
            : sectionTitle.includes("Features")
                ? "/home/features"
                : sectionTitle.includes("Testimonial")
                    ? "/home/testimonials"
                    : "/banners";

    const submit = async e => {
        e.preventDefault();
        const data = new FormData();
        Object.entries(form).forEach(([k, v]) => data.append(k, v));
        if (image) data.append("image", image);

        try {
            await api.post(endpoint, data);
            toast.success("Item added successfully");
            setForm({ title: "", subtitle: "", link: "" });
            setImage(null);
            setPreview("");
        } catch {
            toast.error("Failed to add item");
        }
    };

    return (
        <form
            onSubmit={submit}
            className="bg-gray-800 p-4 rounded-xl grid gap-3"
        >
            <input
                className="bg-gray-700 p-2 rounded"
                placeholder="Title"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
            />
            <input
                className="bg-gray-700 p-2 rounded"
                placeholder="Subtitle"
                value={form.subtitle}
                onChange={e => setForm({ ...form, subtitle: e.target.value })}
            />
            <input
                className="bg-gray-700 p-2 rounded"
                placeholder="Link"
                value={form.link}
                onChange={e => setForm({ ...form, link: e.target.value })}
            />
            <label className="flex items-center gap-2 text-sm cursor-pointer">
                <FiImage />
                <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={e => {
                        setImage(e.target.files[0]);
                        setPreview(URL.createObjectURL(e.target.files[0]));
                    }}
                />
                Upload Image
            </label>

            {preview && (
                <img src={preview} alt="Preview" className="h-32 object-cover rounded" />
            )}

            <button className="bg-purple-600 py-2 rounded mt-2">
                Add Item
            </button>
        </form>
    );
};

export default AdminHome;
