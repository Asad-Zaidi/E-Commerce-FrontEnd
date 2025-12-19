import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import api from '../../../api/api';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaCreditCard, FaHistory, FaSignOutAlt, FaEdit, FaSave, FaTimes, FaBox, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, updateProfile: contextUpdateProfile, loading: contextLoading } = useUser();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updateMessage, setUpdateMessage] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Initialize form data
  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || '', email: user.email || '' });
    }
  }, [user]);

  // Initial fetch and polling setup
  useEffect(() => {
    // Fetch user orders
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        // Filter orders for current user
        const userOrders = res.data.filter(order => order.customerEmail === user.email);
        setOrders(userOrders);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }

    // Set up polling for order updates every 10 seconds
    const pollInterval = setInterval(() => {
      if (user) {
        fetchOrders();
      }
    }, 10000);

    return () => clearInterval(pollInterval);
  }, [user]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    const result = await contextUpdateProfile(formData.name, formData.email);
    if (result.success) {
      setUpdateMessage('Profile updated successfully!');
      setEditing(false);
      setTimeout(() => setUpdateMessage(''), 3000);
    } else {
      setUpdateMessage(result.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', icon: FaClock },
      confirmed: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', icon: FaCheckCircle },
      completed: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', icon: FaCheckCircle },
      cancelled: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', icon: FaTimesCircle },
    };
    const badge = badges[status] || badges.pending;
    return badge;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-teal-100">Manage your account and view order history</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar - Account Info */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-xl">
              {/* Update Message */}
              {updateMessage && (
                <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
                  updateMessage.includes('successfully')
                    ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                    : 'bg-red-500/10 text-red-400 border border-red-500/30'
                }`}>
                  {updateMessage}
                </div>
              )}

              {/* Profile Avatar */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-cyan-400 flex items-center justify-center mx-auto mb-4">
                  <FaUser className="w-10 h-10 text-slate-900" />
                </div>
                <h2 className="text-2xl font-bold text-white">{user.name || 'User'}</h2>
                <p className="text-gray-400 text-sm mt-1">Member since {new Date().getFullYear()}</p>
              </div>

              {/* Edit Mode */}
              {editing ? (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateProfile}
                      disabled={contextLoading}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
                    >
                      <FaSave className="w-4 h-4" /> Save
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                    >
                      <FaTimes className="w-4 h-4" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium mb-4 transition-colors"
                >
                  <FaEdit className="w-4 h-4" /> Edit Profile
                </button>
              )}

              {/* Account Details */}
              <div className="space-y-4 border-t border-slate-700 pt-6">
                <div className="flex items-start gap-3">
                  <FaEnvelope className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-400 text-sm">Email Address</p>
                    <p className="text-white font-medium break-all">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaUser className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-400 text-sm">Account Type</p>
                    <p className="text-white font-medium capitalize">{user.role || 'User'}</p>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg font-medium mt-6 transition-colors"
              >
                <FaSignOutAlt className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>

          {/* Main Content - Orders */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl backdrop-blur-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 sm:px-8 py-6 border-b border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                  <FaHistory className="w-6 h-6 text-teal-400" />
                  <h3 className="text-2xl font-bold text-white">Order History</h3>
                </div>
                <p className="text-gray-400">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
              </div>

              {/* Orders List */}
              <div className="p-6 sm:p-8">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin">
                      <FaBox className="w-8 h-8 text-teal-400" />
                    </div>
                    <p className="text-gray-400 mt-4">Loading your orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <FaBox className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-400 mb-2">No orders yet</h4>
                    <p className="text-gray-500">Start shopping to see your order history here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => {
                      const status = getStatusBadge(order.status);
                      return (
                        <div
                          key={order._id}
                          className="bg-slate-700/30 border border-slate-600/50 rounded-xl overflow-hidden hover:border-teal-500/30 transition-colors"
                        >
                          {/* Order Header */}
                          <div
                            onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                            className="px-6 py-4 cursor-pointer hover:bg-slate-700/50 transition-colors flex items-center justify-between"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="font-mono text-sm text-gray-400">#{order._id.substring(0, 8)}</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${status.bg} ${status.text} ${status.border}`}>
                                  {order.status.toUpperCase()}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-500">Items</p>
                                  <p className="text-white font-medium">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-gray-500">Total</p>
                                  <p className="text-teal-400 font-bold">Rs. {order.total.toLocaleString('en-PK')}</p>
                                </div>
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <p className="text-gray-400 text-xs">{formatDate(order.createdAt)}</p>
                            </div>
                          </div>

                          {/* Order Details */}
                          {expandedOrder === order._id && (
                            <div className="border-t border-slate-600/50 bg-slate-800/20 px-6 py-6 space-y-6">
                              {/* Completion Message */}
                              {order.status === 'completed' && (
                                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-4 shadow-lg">
                                  <div className="flex items-start gap-3">
                                    <FaCheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0 animate-bounce" />
                                    <div className="flex-1">
                                      <p className="text-green-400 font-bold mb-2 text-lg">🎉 Order Completed Successfully!</p>
                                      <p className="text-green-300/90 text-sm leading-relaxed">
                                        Your order has been completed. <span className="font-bold text-green-300">Check your email for access to: </span>
                                        <span className="font-semibold text-teal-300 mt-1 block">
                                          {order.items.map(item => item.productName).join(', ')} credentials and access details
                                        </span>
                                      </p>
                                      <p className="text-green-300/80 text-xs mt-3 flex items-center gap-1">
                                        <span>📧</span> If not found in inbox, check your spam/promotions folder
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Confirmed Message */}
                              {order.status === 'confirmed' && (
                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                  <div className="flex items-start gap-3">
                                    <FaCheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <p className="text-blue-400 font-semibold mb-1">Order Confirmed ✓</p>
                                      <p className="text-blue-300/90 text-sm">
                                        Your order has been confirmed. You'll receive your credentials soon.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Pending Message */}
                              {order.status === 'pending' && (
                                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                                  <div className="flex items-start gap-3">
                                    <FaClock className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <p className="text-yellow-400 font-semibold mb-1">Order Pending</p>
                                      <p className="text-yellow-300/90 text-sm">
                                        Your order is being processed. Admin will confirm it shortly.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Items */}
                              <div>
                                <h4 className="text-teal-400 font-semibold mb-3 flex items-center gap-2">
                                  <FaBox className="w-4 h-4" /> Order Items
                                </h4>
                                <div className="space-y-2">
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-start p-3 bg-slate-700/30 rounded-lg">
                                      <div>
                                        <p className="text-white font-medium">{item.productName}</p>
                                        <p className="text-gray-400 text-sm">Plan: {item.selectedPlan || 'N/A'} • Qty: {item.quantity}</p>
                                      </div>
                                      <p className="text-white font-semibold">Rs. {(item.price * item.quantity).toLocaleString('en-PK')}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Order Summary */}
                              <div className="bg-slate-700/30 rounded-lg p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-400">Subtotal:</span>
                                  <span className="text-white">Rs. {order.subtotal.toLocaleString('en-PK')}</span>
                                </div>
                                {order.discount > 0 && (
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Discount:</span>
                                    <span className="text-green-400">-Rs. {order.discount.toLocaleString('en-PK')}</span>
                                  </div>
                                )}
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-400">Processing Fee:</span>
                                  <span className="text-white">Rs. {order.processingFee.toLocaleString('en-PK')}</span>
                                </div>
                                <div className="border-t border-slate-600 pt-2 flex justify-between font-semibold">
                                  <span className="text-gray-300">Total:</span>
                                  <span className="text-teal-400 text-lg">Rs. {order.total.toLocaleString('en-PK')}</span>
                                </div>
                              </div>

                              {/* Shipping Address */}
                              <div>
                                <h4 className="text-teal-400 font-semibold mb-2 flex items-center gap-2">
                                  <FaMapMarkerAlt className="w-4 h-4" /> Delivery Address
                                </h4>
                                <p className="text-gray-300">{order.address}</p>
                                <p className="text-gray-400 text-sm">{order.city}, {order.country}</p>
                              </div>

                              {/* Payment Info */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-gray-400 text-sm">Payment Method</p>
                                  <p className="text-white font-medium capitalize flex items-center gap-2">
                                    <FaCreditCard className="w-4 h-4 text-teal-400" />
                                    {order.paymentMethod === 'wallet' ? 'Wallet' : 'Card'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-400 text-sm">Order Date</p>
                                  <p className="text-white font-medium">{formatDate(order.createdAt)}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
