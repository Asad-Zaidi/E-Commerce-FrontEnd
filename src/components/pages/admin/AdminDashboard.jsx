// import React, { useEffect, useState } from "react";
// import "../../../styles/AdminDashboard.css";
// import api from "../../../api/api";
// import {
//     FaUsers,
//     FaBox,
//     FaStar,
//     FaCommentDots,
//     FaGlobe,
//     FaClock,
//     FaClipboardList,
// } from "react-icons/fa";
// import {
//     BarChart,
//     Bar,
//     PieChart,
//     Pie,
//     Cell,
//     XAxis,
//     YAxis,
//     Tooltip,
//     Legend,
//     ResponsiveContainer,
//     LineChart,
//     Line,
//     CartesianGrid,
// } from "recharts";

// const COLORS = ["#135bec", "#00b894", "#f39c12", "#6c5ce7", "#e84393"];

// const AdminDashboard = () => {
//     const [stats, setStats] = useState({});
//     const [reviewStats, setReviewStats] = useState({ productStats: [], distribution: [] });
//     const [dailyVisits, setDailyVisits] = useState([]);
//     const [currentTime, setCurrentTime] = useState(new Date());

//     // ✅ Fetch stats, review stats, and daily visits
//     useEffect(() => {
//         const fetchStats = async () => {
//             try {
//                 const [adminRes, reviewRes, visitRes] = await Promise.all([
//                     api.get("/admin/stats"),
//                     api.get("/reviews/admin/stats"),
//                     api.get("/admin/daily-visits"),
//                 ]);
//                 setStats(adminRes.data);
//                 setReviewStats(reviewRes.data);
//                 setStats(adminRes.data);

//                 // setReviewStats({
//                 //     productStats: Array.isArray(reviewRes.data) ? reviewRes.data.map(r => ({
//                 //         productName: r.name || "Unknown",
//                 //         avgRating: r.avgRating || 0,
//                 //         totalReviews: r.totalReviews || 0,
//                 //     })) : [],
//                 //     distribution: [], // no distribution data in backend
//                 // });

//                 // 🔹 Show only last 7 days of visits

//                 setReviewStats({
//                     productStats: Array.isArray(reviewRes.data.productStats)
//                         ? reviewRes.data.productStats.map(r => ({
//                             productName: r.name || "Unknown",
//                             avgRating: r.avgRating || 0,
//                             totalReviews: r.totalReviews || 0,
//                         }))
//                         : [],
//                     distribution: Array.isArray(reviewRes.data.distribution)
//                         ? reviewRes.data.distribution
//                         : [],
//                 });

//                 const recentVisits = visitRes.data.slice(-7);
//                 setDailyVisits(recentVisits);
//             } catch (err) {
//                 console.error("Error fetching stats:", err);
//             }
//         };

//         fetchStats();

//         const statsInterval = setInterval(fetchStats, 10000);
//         const clockInterval = setInterval(() => setCurrentTime(new Date()), 10000);

//         return () => {
//             clearInterval(statsInterval);
//             clearInterval(clockInterval);
//         };
//     }, []);

//     // ✅ Greeting based on time
//     const getGreeting = () => {
//         const hour = currentTime.getHours();
//         if (hour < 12) return "Good Morning";
//         if (hour < 18) return "Good Afternoon";
//         return "Good Evening";
//     };

//     const formattedDate = currentTime.toLocaleDateString("en-US", {
//         weekday: "long",
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//     });

//     const formattedTime = currentTime.toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//     });

//     return (
//         <div className="admin-dashboard">
//             {/* 🌅 Header with Greeting and Date/Time */}
//             <div className="dashboard-header">
//                 <div className="greeting">
//                     <h2>
//                         {getGreeting()}, <span>Admin</span> 👋
//                     </h2>
//                 </div>
//                 <div className="datetime">
//                     <p>{formattedDate}</p>
//                     <p>{formattedTime}</p>
//                 </div>
//             </div>

//             <h1 className="dashboard-title">Dashboard</h1>
//             <p className="dashboard-subtitle">
//                 Real-time analytics, reviews, and visitor insights
//             </p>

//             {/* 📊 Stats Section */}
//             <div className="dashboard-cards">
//                 <StatCard icon={<FaBox />} label="Total Products" value={stats.totalProducts} color="#135bec" />
//                 <StatCard icon={<FaUsers />} label="Total Users" value={stats.totalUsers} color="#00b894" />
//                 <StatCard icon={<FaStar />} label="Avg Rating" value={`${stats.averageRating || 0} / 5`} color="#f39c12" />
//                 <StatCard icon={<FaCommentDots />} label="Total Reviews" value={stats.totalReviews} color="#6c5ce7" />
//                 <StatCard icon={<FaGlobe />} label="Total Visits" value={stats.totalVisits} color="#0984e3" />
//             </div>

//             {/* 🧭 Daily Visit Trends */}
//             <div className="daily-visits">
//                 <h2>Daily Visit Trends (Last 7 Days)</h2>
//                 <ResponsiveContainer width="100%" height={300}>
//                     <LineChart
//                         data={[...dailyVisits]
//                             .map((item) => ({
//                                 date: new Date(item._id).toLocaleDateString("en-US", {
//                                     month: "short",
//                                     day: "numeric",
//                                 }),
//                                 count: item.count,
//                             }))
//                             .sort(
//                                 (a, b) =>
//                                     new Date(a.date).getTime() - new Date(b.date).getTime()
//                             )}
//                     >
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="date" />
//                         <YAxis allowDecimals={false} />
//                         <Tooltip />
//                         <Legend />
//                         <Line
//                             type="monotone"
//                             dataKey="count"
//                             stroke="#135bec"
//                             strokeWidth={3}
//                             dot={{ r: 5, fill: "#135bec" }}
//                             activeDot={{ r: 8, fill: "#00b894" }}
//                             name="Visits"
//                         />
//                     </LineChart>
//                 </ResponsiveContainer>
//             </div>


//             {/* 🧾 Review Analytics */}
//             <div className="review-analytics">
//                 <h2>Review & Rating Analytics</h2>
//                 <div className="review-graphs">
//                     {/* Bar Chart */}
//                     <div className="chart-container">
//                         <h3>Average Rating per Product</h3>
//                         <ResponsiveContainer width="100%" height={300}>
//                             <BarChart data={reviewStats.productStats}>
//                                 <XAxis dataKey="productName" angle={-15} textAnchor="end" interval={0} height={60} />
//                                 <YAxis />
//                                 <Tooltip />
//                                 <Legend />
//                                 <Bar dataKey="avgRating" fill="#135bec" name="Avg Rating" />
//                                 <Bar dataKey="totalReviews" fill="#6c5ce7" name="Total Reviews" />
//                             </BarChart>
//                         </ResponsiveContainer>
//                     </div>

//                     {/* Pie Chart */}
//                     <div className="chart-container">
//                         <h3>Rating Distribution</h3>
//                         <ResponsiveContainer width="100%" height={300}>
//                             <PieChart>
//                                 <Pie
//                                     data={reviewStats.distribution.map((r) => ({
//                                         name: `${r._id}-Star`,
//                                         value: r.count,
//                                     }))}
//                                     dataKey="value"
//                                     nameKey="name"
//                                     outerRadius={100}
//                                     label
//                                 >
//                                     {reviewStats.distribution.map((_, i) => (
//                                         <Cell key={i} fill={COLORS[i % COLORS.length]} />
//                                     ))}
//                                 </Pie>
//                                 <Tooltip />
//                                 <Legend />
//                             </PieChart>
//                         </ResponsiveContainer>
//                     </div>
//                 </div>
//             </div>

//             {/* 🆕 Recent Products */}
//             <div className="recent-products">
//                 <div className="section-header">
//                     <FaClipboardList size={20} color="#135bec" />
//                     <h2>Recent Products</h2>
//                 </div>
//                 <table className="product-table">
//                     <thead>
//                         <tr>
//                             <th>Image</th>
//                             <th>Name</th>
//                             <th>Category</th>
//                             <th>Monthly Price</th>
//                             <th>Added</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {stats.recentProducts?.length ? (
//                             stats.recentProducts.map((p) => (
//                                 <tr key={p._id}>
//                                     <td>
//                                         <img src={p.imageUrl} alt={p.name} className="table-img" />
//                                     </td>
//                                     <td>{p.name}</td>
//                                     <td>{p.category}</td>
//                                     <td>Rs {p.priceMonthly}</td>
//                                     <td>{new Date(p.createdAt).toLocaleDateString()}</td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="5" style={{ textAlign: "center", color: "#888" }}>
//                                     No recent products.
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {/* 🔁 Real-Time Activities */}
//             <div className="activity-section">
//                 <div className="section-header">
//                     <FaClock size={20} color="#135bec" />
//                     <h2>Real-Time Activities</h2>
//                 </div>
//                 <ul>
//                     {stats.recentActivities?.length ? (
//                         stats.recentActivities.map((a) => (
//                             <li key={a._id}>
//                                 <strong>{a.name}</strong> ({a.category}) updated on{" "}
//                                 {new Date(a.updatedAt).toLocaleString()}
//                             </li>
//                         ))
//                     ) : (
//                         <li style={{ color: "#888" }}>No recent activities.</li>
//                     )}
//                 </ul>
//             </div>
//         </div>
//     );
// };

// const StatCard = ({ icon, label, value, color }) => (
//     <div className="stat-card" style={{ borderTop: `4px solid ${color}` }}>
//         <div className="stat-icon" style={{ backgroundColor: color + "20" }}>
//             {React.cloneElement(icon, { color, size: 24 })}
//         </div>
//         <div className="stat-info">
//             <h3>{label}</h3>
//             <p>{value}</p>
//         </div>
//     </div>
// );

// export default AdminDashboard;

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

const COLORS = ["#135bec", "#00b894", "#f39c12", "#6c5ce7", "#e84393"];

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

    return (
        <div className="p-6 space-y-10 bg-gray-50 min-h-screen">

            {/* Header */}
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow">
                <h2 className="text-2xl font-semibold">
                    {getGreeting()}, <span className="text-blue-600">Admin</span>
                </h2>
                <div className="text-right text-sm text-gray-500">
                    <p>{formattedDate}</p>
                    <p>{formattedTime}</p>
                </div>
            </div>

            {/* Title */}
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-gray-500">Real-time analytics, reviews, and visitor insights</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatCard icon={<FaBox />} label="Total Products" value={stats.totalProducts} color="#135bec" />
                <StatCard icon={<FaUsers />} label="Total Users" value={stats.totalUsers} color="#00b894" />
                <StatCard icon={<FaStar />} label="Avg Rating" value={`${stats.averageRating || 0} / 5`} color="#f39c12" />
                <StatCard icon={<FaCommentDots />} label="Total Reviews" value={stats.totalReviews} color="#6c5ce7" />
                <StatCard icon={<FaGlobe />} label="Total Visits" value={stats.totalVisits} color="#0984e3" />
            </div>

            {/* Daily Visits */}
            <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-4">Daily Visit Trends (Last 7 Days)</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dailyVisits.map(v => ({
                        date: new Date(v._id).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                        count: v.count,
                    }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="count" stroke="#135bec" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Reviews */}
            <div className="bg-white p-6 rounded-xl shadow space-y-6">
                <h2 className="text-xl font-semibold">Review & Rating Analytics</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={reviewStats.productStats}>
                            <XAxis dataKey="productName" interval={0} angle={-15} textAnchor="end" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="avgRating" fill="#135bec" />
                            <Bar dataKey="totalReviews" fill="#6c5ce7" />
                        </BarChart>
                    </ResponsiveContainer>

                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={reviewStats.distribution.map(r => ({
                                    name: `${r._id}-Star`,
                                    value: r.count,
                                }))}
                                dataKey="value"
                                outerRadius={100}
                                label
                            >
                                {reviewStats.distribution.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Products */}
            <div className="bg-white p-6 rounded-xl shadow">
                <div className="flex items-center gap-2 mb-4">
                    <FaClipboardList className="text-blue-600" />
                    <h2 className="text-xl font-semibold">Recent Products</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2">Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Added</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentProducts?.map(p => (
                                <tr key={p._id} className="border-b">
                                    <td className="p-2">
                                        <img src={p.imageUrl} alt={p.name} className="w-12 h-12 object-cover rounded" />
                                    </td>
                                    <td>{p.name}</td>
                                    <td>{p.category}</td>
                                    <td>Rs {p.priceSharedMonthly}</td>
                                    <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Activity */}
            <div className="bg-white p-6 rounded-xl shadow">
                <div className="flex items-center gap-2 mb-4">
                    <FaClock className="text-blue-600" />
                    <h2 className="text-xl font-semibold">Real-Time Activities</h2>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                    {stats.recentActivities?.map(a => (
                        <li key={a._id}>
                            <strong>{a.name}</strong> ({a.category}) — {new Date(a.updatedAt).toLocaleString()}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <div className="bg-white rounded-xl shadow p-4 border-t-4" style={{ borderColor: color }}>
        <div className="flex items-center gap-4">
            <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
                {React.cloneElement(icon, { color, size: 22 })}
            </div>
            <div>
                <h3 className="text-sm text-gray-500">{label}</h3>
                <p className="text-lg font-semibold">{value}</p>
            </div>
        </div>
    </div>
);

export default AdminDashboard;
