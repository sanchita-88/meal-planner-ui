import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Mail, Key, Lock, ArrowLeft } from 'lucide-react';

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
            await axios.post('http://localhost:3000/api/auth/forgot-password', { email });
            setMessage('OTP sent to your email! Please check your inbox.');
            setStep(2); // Move to next step
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
            await axios.post('http://localhost:3000/api/auth/reset-password', {
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
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="px-8 py-6 text-left bg-white shadow-lg rounded-xl w-96">
                <button onClick={() => navigate('/login')} className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
                    <ArrowLeft size={16} className="mr-1"/> Back to Login
                </button>

                <h3 className="text-2xl font-bold text-center text-green-600 mb-2">Recovery</h3>
                
                {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}
                {message && <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">{message}</div>}

                {step === 1 ? (
                    /* --- STEP 1 FORM --- */
                    <form onSubmit={handleRequestOtp}>
                        <p className="text-gray-500 text-sm mb-4 text-center">Enter your email to receive a reset code.</p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <div className="flex items-center mt-2 border rounded-md p-2 bg-gray-50">
                                <Mail size={18} className="text-gray-400 mr-2" />
                                <input 
                                    type="email" 
                                    placeholder="Enter your email"
                                    className="w-full bg-transparent outline-none"
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <button disabled={loading} className="w-full px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition font-semibold">
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    </form>
                ) : (
                    /* --- STEP 2 FORM --- */
                    <form onSubmit={handleResetPassword}>
                        <p className="text-gray-500 text-sm mb-4 text-center">Enter the code sent to <b>{email}</b></p>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">OTP Code</label>
                            <div className="flex items-center mt-2 border rounded-md p-2 bg-gray-50">
                                <Key size={18} className="text-gray-400 mr-2" />
                                <input 
                                    type="text" 
                                    placeholder="6-digit code"
                                    className="w-full bg-transparent outline-none"
                                    value={otp} onChange={(e) => setOtp(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                            <div className="flex items-center mt-2 border rounded-md p-2 bg-gray-50">
                                <Lock size={18} className="text-gray-400 mr-2" />
                                <input 
                                    type="password" 
                                    placeholder="Enter new password"
                                    className="w-full bg-transparent outline-none"
                                    value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button disabled={loading} className="w-full px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition font-semibold">
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;