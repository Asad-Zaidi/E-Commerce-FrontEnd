import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import {
    FaUsers,
    FaBox,
    FaStar,
    FaCommentDots,
    FaGlobe,
    FaClock,
    FaClipboardList,
} from "react-icons/fa";
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";

const AdminDashboard = () => {
    const [stats, setStats] = useState({});
    const [reviewStats, setReviewStats] = useState({ productStats: [], distribution: [] });
    const [dailyVisits, setDailyVisits] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [adminRes, reviewRes, visitRes] = await Promise.all([
                    api.get("/admin/stats"),
                    api.get("/reviews/admin/stats"),
                    api.get("/admin/daily-visits"),
                ]);

                setStats(adminRes.data);

                setReviewStats({
                    productStats: Array.isArray(reviewRes.data.productStats)
                        ? reviewRes.data.productStats.map(r => ({
                            productName: r.name || "Unknown",
                            avgRating: r.avgRating || 0,
                            totalReviews: r.totalReviews || 0,
                        }))
                        : [],
                    distribution: Array.isArray(reviewRes.data.distribution)
                        ? reviewRes.data.distribution
                        : [],
                });

                setDailyVisits(visitRes.data.slice(-7));
            } catch (err) {
                console.error("Error fetching stats:", err);
            }
        };

        fetchStats();
        const statsInterval = setInterval(fetchStats, 10000);
        const clockInterval = setInterval(() => setCurrentTime(new Date()), 10000);

        return () => {
            clearInterval(statsInterval);
            clearInterval(clockInterval);
        };
    }, []);

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    const formattedDate = currentTime.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const formattedTime = currentTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    const chartColors = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"];
    const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

    return (
        <div className="p-6 space-y-10 min-h-screen bg-gray-900 text-gray-200">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-between items-center bg-gray-800 p-6 rounded-xl shadow-md"
            >
                <h2 className="text-2xl font-semibold">
                    {getGreeting()}, <span className="text-blue-400">Admin</span>
                </h2>
                <div className="text-right text-sm text-gray-400">
                    <p>{formattedDate}</p>
                    <p>{formattedTime}</p>
                </div>
            </motion.div>

            {/* Title */}
            <motion.div initial="hidden" animate="visible" variants={fadeInUp} transition={{ duration: 0.5 }}>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-gray-400">Real-time analytics, reviews, and visitor insights</p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {[
                    { icon: <FaBox />, label: "Total Products", value: stats.totalProducts, color: "blue" },
                    { icon: <FaUsers />, label: "Total Users", value: stats.totalUsers, color: "green" },
                    { icon: <FaStar />, label: "Avg Rating", value: `${stats.averageRating || 0} / 5`, color: "yellow" },
                    { icon: <FaCommentDots />, label: "Total Reviews", value: stats.totalReviews, color: "purple" },
                    { icon: <FaGlobe />, label: "Total Visits", value: stats.totalVisits, color: "indigo" },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                    >
                        <StatCard {...stat} />
                    </motion.div>
                ))}
            </div>

            {/* Daily Visits */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800 p-6 rounded-xl shadow-md"
            >
                <h2 className="text-xl font-semibold mb-4">Daily Visit Trends (Last 7 Days)</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                        data={dailyVisits.map(v => ({
                            date: new Date(v._id).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                            count: v.count,
                        }))}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" />
                        <YAxis allowDecimals={false} stroke="#9CA3AF" />
                        <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "none" }} />
                        <Legend />
                        <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
            </motion.div>

            {/* Reviews */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.01 }}
                className="bg-gray-800 p-6 rounded-xl shadow-md space-y-6"
            >
                <h2 className="text-xl font-semibold">Review & Rating Analytics</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={reviewStats.productStats}>
                            <XAxis dataKey="productName" interval={0} angle={-15} textAnchor="end" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip contentStyle={{ backgroundColor: "#1F2950", border: "none" }} />
                            <Legend />
                            <Bar dataKey="avgRating" fill="#3B82F6" />
                            <Bar dataKey="totalReviews" fill="#8B5CF6" />
                        </BarChart>
                    </ResponsiveContainer>

                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={reviewStats.distribution.map(r => ({ name: `${r._id}-Star`, value: r.count }))}
                                dataKey="value"
                                outerRadius={100}
                                label
                            >
                                {reviewStats.distribution.map((_, i) => (
                                    <Cell key={i} fill={chartColors[i % chartColors.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: "#fff", border: "none" }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Recent Products */}
            <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="bg-gray-800 p-6 rounded-xl shadow-md">
                <div className="flex items-center gap-2 mb-4">
                    <FaClipboardList className="text-blue-400" />
                    <h2 className="text-xl font-semibold">Recent Products</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-gray-300">
                        <thead className="bg-gray-900 border-b border-gray-700">
                            <tr>
                                <th className="px-3 py-4 text-left">Image</th>
                                <th className="px-3 py-4 text-left">Name</th>
                                <th className="px-3 py-4 text-left">Category</th>
                                <th className="px-3 py-4 text-left">Price</th>
                                <th className="px-3 py-4 text-left">Added</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentProducts?.map((p, idx) => (
                                <motion.tr
                                    key={p._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="border-b border-gray-700"
                                >
                                    <td className="px-3 py-2">
                                        <img src={p.imageUrl} alt={p.name} className="w-12 h-12 object-cover rounded" />
                                    </td>
                                    <td className="px-3 py-2">{p.name}</td>
                                    <td className="px-3 py-2">{p.category}</td>
                                    <td className="px-3 py-2">Rs {p.priceSharedMonthly}</td>
                                    <td className="px-3 py-2">{new Date(p.createdAt).toLocaleDateString()}</td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Activity */}
            <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="bg-gray-800 p-6 rounded-xl shadow-md">
                <div className="flex items-center gap-2 mb-4">
                    <FaClock className="text-blue-400" />
                    <h2 className="text-xl font-semibold">Real-Time Activities</h2>
                </div>
                <ul className="space-y-2 text-sm text-gray-400">
                    {stats.recentActivities?.map((a, idx) => (
                        <motion.li
                            key={a._id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ scale: 1.02, color: "#fff" }}
                        >
                            <strong>{a.name}</strong> ({a.category}) — {new Date(a.updatedAt).toLocaleString()}
                        </motion.li>
                    ))}
                </ul>
            </motion.div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => {
    const colorMap = {
        blue: "border-blue-500 text-blue-400 bg-blue-900",
        green: "border-green-500 text-green-400 bg-green-900",
        yellow: "border-yellow-400 text-yellow-300 bg-yellow-900",
        purple: "border-purple-500 text-purple-400 bg-purple-900",
        indigo: "border-indigo-500 text-indigo-400 bg-indigo-900",
    };

    return (
        <div className={`bg-gray-800 rounded-xl shadow p-4 border-t-4 ${colorMap[color]}`}>
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full bg-opacity-20 ${colorMap[color].split(" ")[2]}`}>
                    {React.cloneElement(icon, { className: colorMap[color].split(" ")[1], size: 22 })}
                </div>
                <div>
                    <h3 className="text-sm text-gray-400">{label}</h3>
                    <p className="text-lg font-semibold">{value}</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
