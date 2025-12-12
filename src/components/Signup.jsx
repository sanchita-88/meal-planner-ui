import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, UserPlus, ArrowRight, ChefHat, ChefHatIcon } from 'lucide-react';

// Define the base URL using the environment variable (Vercel/Vite standard)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
// NOTE: Vercel must have VITE_API_URL set to 'https://meal-planner-g6vy.onrender.com' in its settings

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        
        try {
            // Use the standard, dynamic API_BASE_URL variable
            const res = await axios.post(`${API_BASE_URL}/api/auth/signup`, { email, password });
            
            // Log the user in immediately after signup
            login(res.data.token, res.data); 
            navigate('/dashboard'); 
        } catch (err) {
            // IMPROVED ERROR HANDLING: Ensure API error response is caught, or use generic fallback
            const errorMessage = err.response?.data?.error || err.message || 'Signup failed (Check server status)';
            setError(errorMessage);
        }
    };

    return (
        // OUTER WRAPPER: Simplifies to one wrapper, centered, relying on App.jsx for background
        <div className="flex items-center justify-center w-full min-h-screen">
            
            {/* The Card Container: Added Entrance Animation */}
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 animate-scale-in">
                
                {/* 1. Logo & Header: ENHANCED BRAND IDENTITY */}
                <div className="flex flex-col items-center mb-6 animate-logo-pop-in">
                    
                    {/* Animated Logo Container (ChefHat) */}
                    <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-r from-pink-400 to-purple-500 shadow-md mb-3">
                        <ChefHat className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* App Name: NutriPlan (Gradient Text) */}
                    <h1 className="text-3xl font-extrabold mb-1">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
                            NutriPlan
                        </span>
                    </h1>

                </div>

                {/* Remaining Card Header (Titles changed for Signup context) */}
                <h3 className="text-xl font-semibold text-center text-gray-800">Create Your Account</h3>
                <p className="text-center text-gray-500 mb-6 text-sm">Join NutriPlan today for your custom meal plan</p>
                
                {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Input (UPDATED Focus Ring) */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</label>
                        <div className="flex items-center border border-gray-200 rounded-xl p-2.5 bg-white/50 focus-within:ring-2 focus-within:ring-pink-400 focus-within:border-pink-400 transition">
                            <Mail size={18} className="text-gray-400 mr-2" />
                            <input 
                                type="email" 
                                placeholder="name@example.com"
                                className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    
                    {/* Password Input (UPDATED Focus Ring) */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Password</label>
                        <div className="flex items-center border border-gray-200 rounded-xl p-2.5 bg-white/50 focus-within:ring-2 focus-within:ring-pink-400 focus-within:border-pink-400 transition">
                            <Lock size={18} className="text-gray-400 mr-2" />
                            <input 
                                type="password" 
                                placeholder="Create password"
                                className="w-full bg-transparent outline-none text-sm text-gray-700"
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                autocomplete="new-password" // <-- ADD THIS
                                required
                            />
                        </div>
                    </div>
                    
                    {/* Confirm Password Input (UPDATED Focus Ring) */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Confirm Password</label>
                        <div className="flex items-center border border-gray-200 rounded-xl p-2.5 bg-white/50 focus-within:ring-2 focus-within:ring-pink-400 focus-within:border-pink-400 transition">
                            <Lock size={18} className="text-gray-400 mr-2" />
                            <input 
                                type="password" 
                                placeholder="Repeat password"
                                className="w-full bg-transparent outline-none text-sm text-gray-700"
                                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                autocomplete="new-password" // <-- ADD THIS
                                required
                            />
                        </div>
                    </div>

                    {/* Button (UPDATED to Pink/Purple Gradient) */}
                    <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-pink-200 transition-all transform hover:-translate-y-0.5 flex justify-center items-center gap-2">
                        Sign Up <ArrowRight size={18} />
                    </button>
                </form>
                
                {/* Footer Link (UPDATED Link Color) */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    Already have an account? <Link to="/login" className="text-purple-600 font-bold hover:underline">Login here</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;