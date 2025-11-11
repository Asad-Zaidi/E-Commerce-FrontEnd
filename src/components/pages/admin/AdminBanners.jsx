import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import "../../../styles/AdminBanners.css"

const AdminBanners = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    

    const fetchBanners = async () => {
        try {
            const res = await api.get("/banners/all");
            setBanners(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error loading banners:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this banner?")) return;
        try {
            // use absolute path consistent with other api calls
            await api.delete(`/banners/${id}`);
            fetchBanners();
        } catch (err) {
            console.error("Error deleting banner:", err);
        }
    };

    const toggleStatus = async (id) => {
        try {
            await api.put(`/banners/${id}/toggle`);
            fetchBanners();
        } catch (err) {
            console.error("Error toggling status:", err);
        }
    };

    if (loading) return <p>Loading banners...</p>;

    return (
        <div className="admin-banners">
            <h2>Manage Banners</h2>
            <button className="add-banner-btn" onClick={() => setShowForm(!showForm)}>
                {showForm ? "Close Form" : "Add New Banner"}
            </button>

            {showForm && <BannerForm onSuccess={fetchBanners} />}

            <div className="banner-grid">
                {banners.map((b) => (
                    <div key={b._id} className="banner-card">
                        <img src={b.imageUrl} alt={b.title} />
                        <h3>{b.title}</h3>
                        <p>{b.subtitle}</p>
                        <a href={b.link} target="_blank" rel="noopener noreferrer">
                            {b.link}
                        </a>
                        <div className="banner-actions">
                            <button onClick={() => toggleStatus(b._id)} className={b.isActive ? "active" : "inactive"}>
                                {b.isActive ? "Active" : "Inactive"}
                            </button>
                            <button onClick={() => handleDelete(b._id)} className="delete-btn">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const BannerForm = ({ onSuccess }) => {
    const [form, setForm] = useState({ title: "", subtitle: "", link: "" });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(form).forEach((key) => formData.append(key, form[key]));
        if (image) formData.append("image", image);

        try {
            await api.post("/banners", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            onSuccess();
            setForm({ title: "", subtitle: "", link: "" });
            setImage(null);
            setPreview("");
        } catch (err) {
            console.error("Error adding banner:", err);
        }
    };

    return (
        <form className="banner-form" onSubmit={handleSubmit}>
            <input type="text" name="title" placeholder="Banner Title" value={form.title} onChange={handleChange} required />
            <input type="text" name="subtitle" placeholder="Subtitle" value={form.subtitle} onChange={handleChange} />
            <input type="text" name="link" placeholder="Link URL" value={form.link} onChange={handleChange} />
            <input type="file" onChange={handleImageChange} accept="image/*" />
            {preview && <img src={preview} alt="Preview" className="preview-img" />}
            <button type="submit" className="submit-btn">Add Banner</button>
        </form>
    );
};

export default AdminBanners;
