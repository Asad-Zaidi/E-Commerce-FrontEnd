import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MdEmail, MdLock, MdCheckCircle, MdArrowBack } from 'react-icons/md';
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import { BsEnvelopeCheck } from 'react-icons/bs';
import { RiLockPasswordLine } from 'react-icons/ri';
import { apiForgotPassword, apiVerifyOtp, apiResetPassword } from '../../api/api';
import { validatePasswordRules, getPasswordRuleStatuses } from '../../lib/passwordValidation';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); 
    const [formData, setFormData] = useState({
        email: '',
        code: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('error');
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [passwordRules, setPasswordRules] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    });

    const specialCharsDisplay = "!@#$%^&*(),.?\":{}<>";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (name === 'newPassword') {
            const rules = getPasswordRuleStatuses(value);
            setPasswordRules(rules);
        }
    };

    const handleRequestReset = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
            const response = await apiForgotPassword({ email: formData.email });
            const data = response.data;

            if (response.status === 200 && data.message) {
                setMessage(data.message || 'Verification code sent to your email!');
                setMessageType('success');
                setStep(2);
                startCountdown();
            } else {
                setMessage(data.detail?.error || data.error || 'Email not found');
                setMessageType('error');
            }
        } catch (error) {
            const errMsg = error.response?.data?.detail?.error || error.response?.data?.error || error.response?.data?.message || 'An error occurred. Please try again.';
            setMessage(errMsg);
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
            const response = await apiVerifyOtp({ 
                email: formData.email, 
                otp: formData.code 
            });
            const data = response.data;

            if (response.status === 200 && data.message) {
                setMessage(data.message || 'Code verified successfully!');
                setMessageType('success');
                setStep(3);
            } else {
                setMessage(data.detail?.error || data.error || 'Invalid verification code');
                setMessageType('error');
            }
        } catch (error) {
            const errMsg = error.response?.data?.detail?.error || error.response?.data?.error || error.response?.data?.message || 'An error occurred. Please try again.';
            setMessage(errMsg);
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage('');

        if (formData.newPassword !== formData.confirmPassword) {
            setMessage('Passwords do not match!');
            setMessageType('error');
            return;
        }

        const passwordValidation = validatePasswordRules(formData.newPassword);
        if (!passwordValidation.isValid) {
            setMessage(passwordValidation.errors.join(' '));
            setMessageType('error');
            return;
        }

        setLoading(true);

        try {
            const response = await apiResetPassword({ 
                email: formData.email,
                otp: formData.code,
                newPassword: formData.newPassword 
            });
            const data = response.data;

            if (response.status === 200) {
                setStep(4);
            } else {
                setMessage(data.detail?.error || data.error || 'Password reset failed');
                setMessageType('error');
            }
        } catch (error) {
            const errMsg = error.response?.data?.detail?.error || error.response?.data?.error || error.response?.data?.message || 'An error occurred. Please try again.';
            setMessage(errMsg);
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    const startCountdown = () => {
        setCanResend(false);
        setCountdown(60);
        
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleResendCode = () => {
        if (canResend) {
            handleRequestReset({ preventDefault: () => {} });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 overflow-hidden">
            
            {/* Back Button */}
            <button
                onClick={() => navigate('/login')}
                className="absolute top-6 left-6 z-50 flex items-center gap-2 bg-slate-800/90 backdrop-blur-sm hover:bg-slate-700 text-gray-100 font-medium px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-x-1 group border border-slate-700"
            >
                <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="text-sm">Back to Login</span>
            </button>

            {/* Main Container */}
            <div className="relative w-full max-w-lg bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden z-10">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
                    
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <RiLockPasswordLine className="text-3xl" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
                        <p className="text-sm text-gray-300">
                            {step === 1 && "Enter your email to receive a reset code"}
                            {step === 2 && "Enter the verification code sent to your email"}
                            {step === 3 && "Create your new password"}
                            {step === 4 && "Password reset successful!"}
                        </p>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="px-8 pt-6">
                    <div className="flex items-center justify-between">
                        {[1, 2, 3, 4].map((s) => (
                            <React.Fragment key={s}>
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-all duration-300 ${
                                    step >= s 
                                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg scale-110' 
                                        : 'bg-slate-700/50 text-gray-400 border border-slate-600'
                                }`}>
                                    {step > s ? <MdCheckCircle className="text-xl" /> : s}
                                </div>
                                {s < 4 && (
                                    <div className={`flex-1 h-1 mx-2 rounded transition-all duration-300 ${
                                        step > s ? 'bg-gradient-to-r from-teal-500 to-cyan-500' : 'bg-slate-700'
                                    }`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium">
                        <span>Email</span>
                        <span>Code</span>
                        <span>Password</span>
                        <span>Done</span>
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-8">
                    
                    {/* Step 1: Email Input */}
                    {step === 1 && (
                        <form onSubmit={handleRequestReset} className="space-y-5 animate-slide-in">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your registered email"
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
                                    />
                                </div>
                            </div>

                            {message && (
                                <div className={`p-3 rounded-lg text-sm font-medium ${
                                    messageType === 'success'
                                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                                }`}>
                                    {message}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending...' : 'Send Reset Code'}
                            </button>
                        </form>
                    )}

                    {/* Step 2: Verification Code */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyCode} className="space-y-5 animate-slide-in">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-300">
                                        Verification Code
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1"
                                    >
                                        <MdArrowBack className="block text-sm" />
                                        Change Email
                                    </button>
                                </div>
                                <div className="relative">
                                    <BsEnvelopeCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-400" />
                                    <input
                                        type="text" 
                                        name="code"
                                        value={formData.code}
                                        onChange={handleChange}
                                        placeholder="Enter 6-digit code"
                                        maxLength={6}
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-center tracking-widest font-mono text-xl"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-2">
                                    Code sent to: <span className="font-semibold text-teal-400">{formData.email}</span>
                                </p>
                            </div>

                            {message && (
                                <div className={`p-3 rounded-lg text-sm font-medium ${
                                    messageType === 'success'
                                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                                }`}>
                                    {message}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Verifying...' : 'Verify Code'}
                            </button>

                            {/* Resend Code */}
                            <div className="flex items-center justify-between">
                                <div className="text-center flex-1">
                                    {canResend ? (
                                        <button
                                            type="button"
                                            onClick={handleResendCode}
                                            className="text-sm text-teal-400 font-semibold hover:text-teal-300 transition-colors"
                                        >
                                            Resend Code
                                        </button>
                                    ) : (
                                        <p className="text-sm text-gray-400">
                                            Resend code in <span className="font-semibold text-teal-400">{countdown}s</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </form>
                    )}

                    {/* Step 3: New Password */}
                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="space-y-5 animate-slide-in">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        placeholder="Enter new password"
                                        required
                                        className="w-full pl-10 pr-12 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-400 transition-colors"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-400" />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm new password"
                                        required
                                        className="w-full pl-10 pr-12 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-400 transition-colors"
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            {/* Password Requirements */}
                            <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-3">
                                <p className="text-xs font-medium text-gray-300 mb-2">Password Requirements:</p>
                                <div className="grid grid-cols-1 gap-1 text-xs">
                                    <div className={`flex items-center gap-2 transition-colors duration-200 ${passwordRules.length ? 'text-teal-400' : 'text-gray-500'}`}>
                                        <span className={`text-xs ${passwordRules.length ? 'text-teal-400' : 'text-gray-500'}`}>✓</span>
                                        At least 8 characters
                                    </div>
                                    <div className={`flex items-center gap-2 transition-colors duration-200 ${passwordRules.uppercase ? 'text-teal-400' : 'text-gray-500'}`}>
                                        <span className={`text-xs ${passwordRules.uppercase ? 'text-teal-400' : 'text-gray-500'}`}>✓</span>
                                        One uppercase letter (A-Z)
                                    </div>
                                    <div className={`flex items-center gap-2 transition-colors duration-200 ${passwordRules.lowercase ? 'text-teal-400' : 'text-gray-500'}`}>
                                        <span className={`text-xs ${passwordRules.lowercase ? 'text-teal-400' : 'text-gray-500'}`}>✓</span>
                                        One lowercase letter (a-z)
                                    </div>
                                    <div className={`flex items-center gap-2 transition-colors duration-200 ${passwordRules.number ? 'text-teal-400' : 'text-gray-500'}`}>
                                        <span className={`text-xs ${passwordRules.number ? 'text-teal-400' : 'text-gray-500'}`}>✓</span>
                                        One number (0-9)
                                    </div>
                                    <div className={`flex items-center gap-2 transition-colors duration-200 ${passwordRules.special ? 'text-teal-400' : 'text-gray-500'}`}>
                                        <span className={`text-xs ${passwordRules.special ? 'text-teal-400' : 'text-gray-500'}`}>✓</span>
                                        One special character ({specialCharsDisplay})
                                    </div>
                                </div>
                            </div>

                            {message && (
                                <div className={`p-3 rounded-lg text-sm font-medium ${
                                    messageType === 'success'
                                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                                }`}>
                                    {message}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    )}

                    {/* Step 4: Success */}
                    {step === 4 && (
                        <div className="text-center space-y-6 animate-scale-in py-8">
                            <div className="relative inline-block">
                                <div className="absolute inset-0 bg-teal-500/30 rounded-full animate-ping opacity-75"></div>
                                <div className="relative w-24 h-24 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto">
                                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center shadow-inner border border-slate-700">
                                        <MdCheckCircle className="text-teal-400 text-6xl" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    Password Reset Successful!
                                </h3>
                                <p className="text-gray-300 text-sm">
                                    Your password has been changed successfully.
                                </p>
                            </div>

                            <button
                                onClick={() => navigate('/login')}
                                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                            >
                                Continue to Login
                            </button>
                        </div>
                    )}

                </div>

                {/* Footer */}
                {step < 4 && (
                    <div className="px-8 pb-8 text-center">
                        <p className="text-xs text-gray-400">
                            Remember your password?{' '}
                            <Link to="/login" className="text-teal-400 font-semibold hover:text-teal-300 transition-colors">
                                Back to Login
                            </Link>
                        </p>
                    </div>
                )}
            </div>

            {/* Custom Animations */}
            <style>{`
                @keyframes slide-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes scale-in {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .animate-slide-in {
                    animation: slide-in 0.4s ease-out;
                }

                .animate-scale-in {
                    animation: scale-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
            `}</style>
        </div>
    );
};

export default ForgotPassword;
