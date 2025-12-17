import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiCheckCircle, FiXCircle, FiPlus } from "react-icons/fi";
// ToastContainer is rendered globally in App.js; no configure call needed.

const AdminBanners = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Fetch banners
    const fetchBanners = async () => {
        try {
            setLoading(true);
            const res = await api.get("/banners/all");
            setBanners(res.data);
        } catch (err) {
            console.error("Error loading banners:", err);
            toast.error("Failed to fetch banners");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    // Delete banner
    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await api.delete(`/banners/${id}`);
            toast.success("Banner deleted successfully");
            fetchBanners();
        } catch (err) {
            console.error("Error deleting banner:", err);
            toast.error("Failed to delete banner");
        } finally {
            setLoading(false);
        }
    };

    // Toggle active status
    const toggleStatus = async (id) => {
        try {
            await api.put(`/banners/${id}/toggle`);
            toast.info("Banner status updated");
            fetchBanners();
        } catch (err) {
            console.error("Error toggling status:", err);
            toast.error("Failed to update status");
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
            <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
        </div>
    );

    return (
        <div className="min-h-screen p-6 bg-gray-900 text-gray-200 flex flex-col items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-5xl bg-gray-800 rounded-xl shadow-lg p-6"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Manage Banners</h2>

                <button
                    className="flex items-center gap-2 mb-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? <FiXCircle /> : <FiPlus />}
                    {showForm ? "Close Form" : "Add New Banner"}
                </button>

                {showForm && <BannerForm onSuccess={fetchBanners} />}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {banners.map((b) => (
                            <motion.div
                                key={b._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="bg-gray-700 p-4 rounded-xl shadow hover:shadow-lg flex flex-col items-center"
                            >
                                <img src={b.imageUrl} alt={b.title} className="w-full h-40 object-cover rounded-lg mb-3" />
                                <h3 className="font-semibold text-lg">{b.title}</h3>
                                <p className="text-gray-300">{b.subtitle}</p>
                                <a href={b.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 truncate w-full text-center">
                                    {b.link}
                                </a>
                                <div className="mt-3 flex gap-3">
                                    <button
                                        onClick={() => toggleStatus(b._id)}
                                        className={`flex items-center gap-1 px-3 py-1 rounded-lg ${b.isActive ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-500'}`}
                                    >
                                        {b.isActive ? <FiCheckCircle /> : <FiXCircle />}
                                        {b.isActive ? "Active" : "Inactive"}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(b._id)}
                                        className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg"
                                    >
                                        <FiTrash2 /> Delete
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

const BannerForm = ({ onSuccess }) => {
    const [form, setForm] = useState({ title: "", subtitle: "", link: "" });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title || !image) {
            toast.warn("Please provide title and image");
            return;
        }

        const formData = new FormData();
        Object.keys(form).forEach((key) => formData.append(key, form[key]));
        formData.append("image", image);

        try {
            setLoading(true);
            await api.post("/banners", formData, { headers: { "Content-Type": "multipart/form-data" } });
            toast.success("Banner added successfully");
            setForm({ title: "", subtitle: "", link: "" });
            setImage(null);
            setPreview("");
            onSuccess();
        } catch (err) {
            console.error("Error adding banner:", err);
            toast.error("Failed to add banner");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.form
            className="flex flex-col gap-4 mb-6 bg-gray-700 p-4 rounded-lg shadow"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <input type="text" name="title" placeholder="Banner Title" value={form.title} onChange={handleChange} className="px-4 py-2 rounded-lg bg-gray-600 text-gray-200 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            <input type="text" name="subtitle" placeholder="Subtitle" value={form.subtitle} onChange={handleChange} className="px-4 py-2 rounded-lg bg-gray-600 text-gray-200 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" name="link" placeholder="Link URL" value={form.link} onChange={handleChange} className="px-4 py-2 rounded-lg bg-gray-600 text-gray-200 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="file" onChange={handleImageChange} accept="image/*" className="text-gray-200" />
            {preview && <img src={preview} alt="Preview" className="w-full h-40 object-cover rounded-lg" />}
            <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center justify-center">
                {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                ) : (
                    <FiPlus className="mr-2" />, "Add Banner"
                )}
            </button>
        </motion.form>
    );
};

export default AdminBanners;
