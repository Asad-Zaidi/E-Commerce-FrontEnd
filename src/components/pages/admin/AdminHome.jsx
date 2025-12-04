import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import "../../../styles/AdminHome.css";

const AdminHome = () => {
    // States for each home section
    const [hero, setHero] = useState([]);
    const [features, setFeatures] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all home data
    const fetchHomeData = async () => {
        try {
            setLoading(true);
            const [heroRes, featuresRes, testimonialsRes, bannersRes] = await Promise.all([
                api.get("/home/hero"),
                api.get("/home/features"),
                api.get("/home/testimonials"),
                api.get("/banners/all"),
            ]);

            setHero(heroRes.data);
            setFeatures(featuresRes.data);
            setTestimonials(testimonialsRes.data);
            setBanners(bannersRes.data);
        } catch (err) {
            console.error("Error fetching home data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHomeData();
    }, []);

    // Generic Delete function
    const handleDelete = async (endpoint, id) => {
        if (!window.confirm("Are you sure you want to delete?")) return;
        try {
            await api.delete(`${endpoint}/${id}`);
            fetchHomeData();
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    // Generic Toggle Status function
    const handleToggle = async (endpoint, id) => {
        try {
            await api.put(`${endpoint}/${id}/toggle`);
            fetchHomeData();
        } catch (err) {
            console.error("Toggle error:", err);
        }
    };

    if (loading) return <p className="loading">Loading home sections...</p>;

    return (
        <div className="admin-home">
            <h2>Manage Home Page Sections</h2>

            {/* Hero Section */}
            <SectionWrapper title="Hero Section" endpoint="/home/hero" data={hero} fetch={fetchHomeData}>
                {hero.map((item) => (
                    <Card
                        key={item._id}
                        item={item}
                        onDelete={() => handleDelete("/home/hero", item._id)}
                        onToggle={() => handleToggle("/home/hero", item._id)}
                        showImage={true}
                    />
                ))}
            </SectionWrapper>

            {/* Features Section */}
            <SectionWrapper title="Features Section" endpoint="/home/features" data={features} fetch={fetchHomeData}>
                {features.map((item) => (
                    <Card
                        key={item._id}
                        item={item}
                        onDelete={() => handleDelete("/home/features", item._id)}
                        onToggle={() => handleToggle("/home/features", item._id)}
                        showImage={false}
                    />
                ))}
            </SectionWrapper>

            {/* Testimonials Section */}
            <SectionWrapper
                title="Testimonials Section"
                endpoint="/home/testimonials"
                data={testimonials}
                fetch={fetchHomeData}
            >
                {testimonials.map((item) => (
                    <Card
                        key={item._id}
                        item={item}
                        onDelete={() => handleDelete("/home/testimonials", item._id)}
                        onToggle={() => handleToggle("/home/testimonials", item._id)}
                        showImage={true}
                    />
                ))}
            </SectionWrapper>

            {/* Banners Section */}
            <SectionWrapper title="Banners Section" endpoint="/banners" data={banners} fetch={fetchHomeData}>
                {banners.map((item) => (
                    <Card
                        key={item._id}
                        item={item}
                        onDelete={() => handleDelete("/banners", item._id)}
                        onToggle={() => handleToggle("/banners", item._id)}
                        showImage={true}
                    />
                ))}
            </SectionWrapper>
        </div>
    );
};

// Section Wrapper Component
const SectionWrapper = ({ title, children }) => {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="home-section">
            <div className="section-header">
                <h3>{title}</h3>
                <button onClick={() => setShowForm(!showForm)}>
                    {showForm ? "Close Form" : `Add New ${title.split(" ")[0]}`}
                </button>
            </div>

            {showForm && <HomeForm sectionTitle={title} />}

            <div className="section-cards">{children}</div>
        </div>
    );
};

// Single Card Component
const Card = ({ item, onDelete, onToggle, showImage }) => (
    <div className="home-card">
        {showImage && item.imageUrl && <img src={item.imageUrl} alt={item.title || item.name} />}
        <h4>{item.title || item.name}</h4>
        {item.subtitle && <p>{item.subtitle}</p>}
        {item.link && (
            <a href={item.link} target="_blank" rel="noopener noreferrer">
                {item.link}
            </a>
        )}
        <div className="card-actions">
            <button onClick={onToggle} className={item.isActive ? "active" : "inactive"}>
                {item.isActive ? "Active" : "Inactive"}
            </button>
            <button onClick={onDelete} className="delete-btn">
                Delete
            </button>
        </div>
    </div>
);

// Form to Add Home Section Item
const HomeForm = ({ sectionTitle }) => {
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
        const endpoint =
            sectionTitle.includes("Hero")
                ? "/home/hero"
                : sectionTitle.includes("Features")
                    ? "/home/features"
                    : sectionTitle.includes("Testimonial")
                        ? "/home/testimonials"
                        : "/banners";

        const formData = new FormData();
        Object.keys(form).forEach((key) => formData.append(key, form[key]));
        if (image) formData.append("image", image);

        try {
            await api.post(endpoint, formData, { headers: { "Content-Type": "multipart/form-data" } });
            alert("✅ Added successfully!");
            setForm({ title: "", subtitle: "", link: "" });
            setImage(null);
            setPreview("");
        } catch (err) {
            console.error("Error adding section item:", err);
            alert("❌ Failed to add item!");
        }
    };

    return (
        <form className="home-form" onSubmit={handleSubmit}>
            <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Title"
                required
            />
            <input
                type="text"
                name="subtitle"
                value={form.subtitle}
                onChange={handleChange}
                placeholder="Subtitle"
            />
            <input type="text" name="link" value={form.link} onChange={handleChange} placeholder="Link URL" />
            <input type="file" onChange={handleImageChange} accept="image/*" />
            {preview && <img src={preview} alt="Preview" className="preview-img" />}
            <button type="submit">Add {sectionTitle.split(" ")[0]}</button>
        </form>
    );
};

export default AdminHome;
