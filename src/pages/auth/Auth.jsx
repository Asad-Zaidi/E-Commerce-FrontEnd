import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUserShield, FaUser, FaUserPlus } from 'react-icons/fa';
import { FiLogIn, FiAlertCircle, FiUserPlus } from 'react-icons/fi';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, loading, isAuthenticated, user } = useUser();

  // Determine if we're on login or signup based on route
  const isLogin = location.pathname === '/login' || location.pathname === '/admin/login';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated based on role
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/profile');
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Reset form when switching between login/signup
  useEffect(() => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setError('');
  }, [isLogin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (isLogin) {
      // Login flow
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        setIsSubmitting(false);
        return;
      }

      const result = await login(formData.email, formData.password);

      if (result.success) {
        // Redirect based on user role
        if (result.user?.role === 'admin') {
          setTimeout(() => navigate('/admin/dashboard'), 800);
        } else {
          setTimeout(() => navigate('/profile'), 800);
        }
      } else {
        setError(result.message);
      }
    } else {
      // Signup flow
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all fields');
        setIsSubmitting(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setIsSubmitting(false);
        return;
      }

      const result = await signup(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword
      );

      if (result.success) {
        toast.success(
          <span className="flex items-center gap-2">
            Account created successfully!
          </span>
        );
        setTimeout(() => navigate('/profile'), 800);
      } else {
        setError(result.message);
      }
    }

    setIsSubmitting(false);
  };

  const toggleMode = () => {
    navigate(isLogin ? '/signup' : '/login');
  };

  return (
    <>
      <Helmet>
        <title>{isLogin ? 'Login' : 'Sign Up'} | ServiceHub</title>
        <meta
          name="description"
          content={isLogin
            ? "Log in to your ServiceHub account. Access your dashboard whether you're a user or admin."
            : "Create a new ServiceHub account to start exploring our services."
          }
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8 sm:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <motion.div
                  key={isLogin ? 'login' : 'signup'}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${isLogin ? 'from-teal-500 to-cyan-500' : 'from-purple-500 to-pink-500'} rounded-full flex items-center justify-center`}>
                    {isLogin ? <FaUser className="text-white text-2xl" /> : <FaUserPlus className="text-white text-2xl" />}
                  </div>
                  {isLogin && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center border-2 border-slate-800">
                      <FaUserShield className="text-white text-xs" />
                    </div>
                  )}
                </motion.div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={isLogin ? 'login-text' : 'signup-text'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                  </h1>
                  <p className="text-gray-400">
                    {isLogin ? 'Sign in to your account' : 'Join us and start exploring'}
                  </p>

                </motion.div>
              </AnimatePresence>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field - Only for Signup */}
              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full pl-11 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        required={!isLogin}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-400 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="mt-2 text-red-400 text-sm font-medium flex items-center gap-2"
                    >
                      <FiAlertCircle />
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Confirm Password Field - Only for Signup */}
              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                    <div className="relative">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-11 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        required={!isLogin}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-400 transition-colors"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Remember & Forgot - Only for Login */}
              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded bg-slate-700 border-slate-600 cursor-pointer accent-teal-500"
                    />
                    <span className="text-gray-400">Remember me</span>
                  </label>
                  <Link to="/auth/forgot-password" className="text-teal-400 hover:text-teal-300 transition-colors">
                    Forgot password?
                  </Link>
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || isSubmitting}
                className={`w-full py-3 px-4 bg-gradient-to-r ${isLogin ? 'from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600' : 'from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'} disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2`}
              >
                {isLogin ? <FiLogIn /> : <FiUserPlus />}
                {loading || isSubmitting
                  ? (isLogin ? 'Signing In...' : 'Creating Account...')
                  : (isLogin ? 'Sign In' : 'Sign Up')
                }
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-800/90 text-gray-400">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </span>
              </div>
            </div>

            {/* Toggle Link */}
            <button
              onClick={toggleMode}
              className="block w-full py-3 px-4 text-center border border-slate-600 hover:border-teal-500 text-gray-300 hover:text-teal-400 font-medium rounded-lg transition-all duration-200"
            >
              {isLogin ? 'Create an Account' : 'Sign In'}
            </button>

          </div>
        </motion.div>

        {/* Loading Overlay */}
        {(loading || isSubmitting) && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <svg
              className="animate-spin h-12 w-12 text-teal-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          </div>
        )}
      </div>
    </>
  );
};

export default Auth;
