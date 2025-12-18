import React, { useState, useEffect } from "react";
import api from "../../../api/api";
import { FaTrash, FaCheckCircle, FaClock, FaBox, FaChevronDown } from "react-icons/fa";
import "../../styles/AdminOrders.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      alert("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/orders/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/orders/${orderId}`, { status: newStatus });
      setOrders(
        orders.map((order) => (order._id === orderId ? res.data.order : order))
      );
      
      // Show different message based on status
      if (newStatus === 'completed') {
        alert("✅ Order marked as COMPLETED!\n\n📧 Remember to send credentials via:\n• Email\n• WhatsApp\n\nCustomer has been notified.");
      } else {
        alert("Order status updated successfully");
      }
      fetchStats();
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update order status");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await api.delete(`/orders/${orderId}`);
      setOrders(orders.filter((order) => order._id !== orderId));
      alert("Order deleted successfully");
      fetchStats();
    } catch (err) {
      console.error("Error deleting order:", err);
      alert("Failed to delete order");
    }
  };

  const filteredOrders =
    filter === "all" ? orders : orders.filter((order) => order.status === filter);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-PK", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      completed: "bg-green-500/20 text-green-400 border-green-500/30",
      cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return statusStyles[status] || statusStyles.pending;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Orders Management</h1>
        <p className="text-gray-400">Track and manage all customer orders</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#111111] border border-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.totalOrders}</p>
            </div>
            <FaBox className="text-4xl text-teal-500 opacity-30" />
          </div>
        </div>
        <div className="bg-[#111111] border border-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-white mt-2">
                Rs. {stats.totalRevenue.toLocaleString("en-PK")}
              </p>
            </div>
            <div className="text-4xl text-green-500 opacity-30">₨</div>
          </div>
        </div>
        <div className="bg-[#111111] border border-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending Orders</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.pendingOrders}</p>
            </div>
            <FaClock className="text-4xl text-yellow-500 opacity-30" />
          </div>
        </div>
        <div className="bg-[#111111] border border-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completed Orders</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.completedOrders}</p>
            </div>
            <FaCheckCircle className="text-4xl text-green-500 opacity-30" />
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {["all", "pending", "confirmed", "completed", "cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              filter === status
                ? "bg-teal-600 text-white"
                : "bg-[#111111] text-gray-300 border border-gray-800 hover:border-gray-700"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-[#111111] border border-gray-800 rounded-lg">
          <p className="text-gray-400 text-lg">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-[#111111] border border-gray-800 rounded-lg overflow-hidden shadow-lg hover:border-teal-600/40 transition-all"
            >
              {/* Order Header */}
              <div
                onClick={() =>
                  setExpandedOrder(expandedOrder === order._id ? null : order._id)
                }
                className="p-6 cursor-pointer hover:bg-[#0f0f0f] transition-all flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-white font-semibold text-lg">
                      {order.customerName}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-1">{order.customerEmail}</p>
                  <p className="text-gray-400 text-sm mb-1">
                    Order ID: <span className="text-teal-400">{order._id}</span>
                  </p>
                  <p className="text-gray-400 text-sm">
                    {formatDate(order.createdAt)} • Rs.{" "}
                    <span className="text-green-400 font-semibold">
                      {order.total.toLocaleString("en-PK")}
                    </span>
                  </p>
                </div>
                <FaChevronDown
                  className={`text-teal-500 transition-transform ${
                    expandedOrder === order._id ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* Order Details (Expanded) */}
              {expandedOrder === order._id && (
                <div className="border-t border-gray-800 p-6 bg-[#0f0f0f] space-y-6">
                  {/* Customer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-teal-400 font-semibold mb-2 text-sm">
                        CUSTOMER INFO
                      </h4>
                      <p className="text-gray-300 text-sm mb-1">
                        <span className="text-gray-500">Name:</span> {order.customerName}
                      </p>
                      <p className="text-gray-300 text-sm mb-1">
                        <span className="text-gray-500">Email:</span> {order.customerEmail}
                      </p>
                      <p className="text-gray-300 text-sm">
                        <span className="text-gray-500">Phone:</span> {order.customerPhone}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-teal-400 font-semibold mb-2 text-sm">
                        BILLING ADDRESS
                      </h4>
                      <p className="text-gray-300 text-sm mb-1">
                        <span className="text-gray-500">City:</span> {order.city}
                      </p>
                      <p className="text-gray-300 text-sm mb-1">
                        <span className="text-gray-500">Address:</span> {order.address}
                      </p>
                      {order.company && (
                        <p className="text-gray-300 text-sm">
                          <span className="text-gray-500">Company:</span> {order.company}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="text-teal-400 font-semibold mb-3 text-sm">
                      ORDER ITEMS
                    </h4>
                    <div className="bg-[#111111] rounded border border-gray-800 overflow-hidden">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 border-b border-gray-800 last:border-b-0 flex justify-between items-center"
                        >
                          <div className="flex-1">
                            <p className="text-gray-300 font-medium text-sm">
                              {item.productName}
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                              Plan: {item.selectedPlan || "N/A"} • Access:{" "}
                              {item.accessType || "N/A"} • Period:{" "}
                              {item.billingPeriod || "N/A"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-300 text-sm font-semibold">
                              Rs. {(item.price * item.quantity).toLocaleString("en-PK")}
                            </p>
                            <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-[#111111] rounded border border-gray-800 p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Subtotal:</span>
                      <span className="text-gray-300 font-medium">
                        Rs. {order.subtotal.toLocaleString("en-PK")}
                      </span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Discount:</span>
                        <span className="text-green-400 font-medium">
                          -Rs. {order.discount.toLocaleString("en-PK")}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Processing Fee:</span>
                      <span className="text-gray-300">
                        Rs. {order.processingFee.toLocaleString("en-PK")}
                      </span>
                    </div>
                    <div className="border-t border-gray-700 pt-2 flex justify-between items-center">
                      <span className="text-teal-400 font-semibold">Total:</span>
                      <span className="text-white font-bold text-lg">
                        Rs. {order.total.toLocaleString("en-PK")}
                      </span>
                    </div>
                  </div>

                  {/* Payment & Notes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-teal-400 font-semibold mb-2 text-sm">
                        PAYMENT METHOD
                      </h4>
                      <p className="text-gray-300 text-sm capitalize">
                        {order.paymentMethod === "wallet"
                          ? "Easypaisa / JazzCash"
                          : "Card"}
                      </p>
                      {order.couponCode && (
                        <p className="text-gray-300 text-sm mt-2">
                          <span className="text-gray-500">Coupon:</span> {order.couponCode}
                        </p>
                      )}
                    </div>
                    {order.note && (
                      <div>
                        <h4 className="text-teal-400 font-semibold mb-2 text-sm">
                          CUSTOMER NOTE
                        </h4>
                        <p className="text-gray-300 text-sm">{order.note}</p>
                      </div>
                    )}
                  </div>

                  {/* Status Update & Actions */}
                  <div className="pt-4 border-t border-gray-800 flex flex-wrap gap-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className="px-4 py-2 bg-[#111111] border border-gray-800 text-gray-300 rounded font-medium text-sm hover:border-teal-600/40 transition-all cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button
                      onClick={() => handleDeleteOrder(order._id)}
                      className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded font-medium text-sm hover:bg-red-500/20 transition-all flex items-center gap-2"
                    >
                      <FaTrash className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
