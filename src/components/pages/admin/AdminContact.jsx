import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaTwitter, FaFacebook, FaInstagram, FaWhatsapp, FaTelegram, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../../api/api";

const AdminContact = () => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [contactData, setContactData] = useState({
        title: "",
        description: "",
        email: "",
        phone: "",
        socials: {
            linkedin: "",
            twitter: "",
            facebook: "",
            instagram: "",
            whatsapp: "",
            telegram: "",
        },
    });

    useEffect(() => {
        fetchContactData();
    }, []);

    const fetchContactData = async () => {
        try {
            setLoading(true);
            const res = await api.get("/contact");
            if (res.data) {
                setContactData(res.data);
            }
        } catch (err) {
            console.error("Error fetching contact data:", err);
            toast.error("Failed to load contact information");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("socials.")) {
            const socialKey = name.split(".")[1];
            setContactData((prev) => ({
                ...prev,
                socials: {
                    ...prev.socials,
                    [socialKey]: value,
                },
            }));
        } else {
            setContactData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting contact data...");
        try {
            setSaving(true);
            const res = await api.put("/contact", contactData);
            console.log("Response received:", res.data);
            toast.success(res.data.message || "Contact information updated successfully!");
        } catch (err) {
            console.error("Error updating contact data:", err);
            toast.error(err.response?.data?.message || "Failed to update contact information");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Contact Information Management
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                Basic Information
                            </h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Page Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={contactData.title}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Get in Touch"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={contactData.description}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="We're here to help..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={contactData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="info@company.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={contactData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                Social Media Links
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <FaLinkedin className="text-blue-600" /> LinkedIn
                                    </label>
                                    <input
                                        type="url"
                                        name="socials.linkedin"
                                        value={contactData.socials.linkedin}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="https://linkedin.com/company"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <FaTwitter className="text-blue-400" /> Twitter
                                    </label>
                                    <input
                                        type="url"
                                        name="socials.twitter"
                                        value={contactData.socials.twitter}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="https://twitter.com/company"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <FaFacebook className="text-blue-700" /> Facebook
                                    </label>
                                    <input
                                        type="url"
                                        name="socials.facebook"
                                        value={contactData.socials.facebook}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="https://facebook.com/company"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <FaInstagram className="text-pink-600" /> Instagram
                                    </label>
                                    <input
                                        type="url"
                                        name="socials.instagram"
                                        value={contactData.socials.instagram}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="https://instagram.com/company"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <FaWhatsapp className="text-green-600" /> WhatsApp
                                    </label>
                                    <input
                                        type="url"
                                        name="socials.whatsapp"
                                        value={contactData.socials.whatsapp}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="https://wa.me/15551234567"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <FaTelegram className="text-blue-500" /> Telegram
                                    </label>
                                    <input
                                        type="url"
                                        name="socials.telegram"
                                        value={contactData.socials.telegram}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="https://t.me/company"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaSave />
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminContact;