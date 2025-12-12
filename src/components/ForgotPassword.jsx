import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Key, Lock, ArrowLeft, ChefHat, Loader2 } from 'lucide-react'; // ADDED ChefHat and Loader2

// Define the base URL using the environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'; // Using fallback now

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1 = Request OTP, 2 = Reset Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Step 1: Request OTP
    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            // FIX: Use API_BASE_URL variable
            await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, { email }); 
            setMessage('OTP sent to your email! Please check your inbox.');
            setStep(2); 
        } catch (err) {
            setError(err.response?.data?.error || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // FIX: Use API_BASE_URL variable
            await axios.post(`${API_BASE_URL}/api/auth/reset-password`, { 
                email,
                otp,
                newPassword
            });
            alert('Password Reset Successful! You can now login.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || "Invalid OTP or failed reset");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center w-full min-h-screen">
            {/* Animated Card (Uses the same aesthetic as Login/Signup) */}
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 animate-scale-in">
                
                {/* NutriPlan Logo Header */}
                <div className="flex flex-col items-center mb-6 animate-logo-pop-in">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-r from-pink-400 to-purple-500 shadow-md mb-3">
                        <ChefHat className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold mb-1">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
                            NutriPlan
                        </span>
                    </h1>
                </div>

                <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">Password Recovery</h3>
                
                {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg text-center border border-red-200">{error}</div>}
                {message && <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg text-center border border-green-200">{message}</div>}

                {step === 1 ? (
                    /* --- STEP 1 FORM --- */
                    <form onSubmit={handleRequestOtp} className="space-y-4">
                        <p className="text-gray-500 text-sm mb-4 text-center">Enter your email to receive a reset code.</p>
                        <div className="mb-4">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</label>
                            <div className="flex items-center border border-gray-200 rounded-xl p-2.5 bg-white/50 focus-within:ring-2 focus-within:ring-pink-400 focus-within:border-pink-400 transition">
                                <Mail size={18} className="text-gray-400 mr-2" />
                                <input 
                                    type="email" 
                                    placeholder="Enter your email"
                                    className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autocomplete="email" // <-- ADD THIS
                                />
                            </div>
                        </div>
                        <button disabled={loading} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-pink-200 transition-all transform hover:-translate-y-0.5">
                            {loading ? <Loader2 className="animate-spin mx-auto"/> : "Send OTP"}
                        </button>
                    </form>
                ) : (
                    /* --- STEP 2 FORM --- */
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <p className="text-gray-500 text-sm mb-4 text-center">Enter the code sent to <b>{email}</b></p>
                        
                        <div className="mb-4">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">OTP Code</label>
                            <div className="flex items-center border border-gray-200 rounded-xl p-2.5 bg-white/50 focus-within:ring-2 focus-within:ring-pink-400 focus-within:border-pink-400 transition">
                                <Key size={18} className="text-gray-400 mr-2" />
                                <input 
                                    type="text" 
                                    placeholder="6-digit code"
                                    className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                                    value={otp} onChange={(e) => setOtp(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">New Password</label>
                            <div className="flex items-center border border-gray-200 rounded-xl p-2.5 bg-white/50 focus-within:ring-2 focus-within:ring-pink-400 focus-within:border-pink-400 transition">
                                <Lock size={18} className="text-gray-400 mr-2" />
                                <input 
                                    type="password" 
                                    placeholder="Enter new password"
                                    className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                                    value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    autocomplete="new-password" // <-- THIS MUST BE PRESENT
                                />
                            </div>
                        </div>

                        <button disabled={loading} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-pink-200 transition-all transform hover:-translate-y-0.5">
                            {loading ? <Loader2 className="animate-spin mx-auto"/> : "Reset Password"}
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center">
                    <button onClick={() => navigate('/login')} className="flex items-center mx-auto text-sm text-purple-600 hover:text-purple-700 font-semibold hover:underline">
                        <ArrowLeft size={16} className="mr-1"/> Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;