import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ChefHat } from 'lucide-react';

// Define the base URL using the environment variable (Vercel/Vite standard)
// If VITE_API_URL is not set (i.e., local development without the .env file being read properly),
// it temporarily falls back to your local IP address for easy testing.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://192.168.0.104:3000';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            // --- DEPLOYMENT FIX: Using the dynamic API_BASE_URL ---
            const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
            
            login(res.data.token, res.data); 
            navigate('/dashboard'); 
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

return (
    // FINAL WRAPPER: Simplifies to one wrapper, which centers the card.
    // Relies on App.jsx for min-h-screen and animated-background.
    <div className="flex items-center justify-center w-full min-h-screen perspective-wrapper">
        
        {/* The Card Container: Cleaned up styling and added entrance animation */}
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 animate-scale-in">
            
            {/* Logo & Header: Enhanced Brand Identity and Logo Animation */}
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

            {/* Remaining Card Header (Cleaned up titles) */}
            <h3 className="text-xl font-semibold text-center text-gray-800">Welcome Back</h3>
            <p className="text-center text-gray-500 mb-6 text-sm">Login to your meal planner</p>
            
            {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg text-center">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Input 1: Email (FIXED focus-within border) */}
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
                            autocomplete="current-password" // <-- ADD THIS
                        />
                    </div>
                </div>
                
                {/* Input 2: Password (FIXED focus-within border) */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Password</label>
                    <div className="flex items-center border border-gray-200 rounded-xl p-2.5 bg-white/50 focus-within:ring-2 focus-within:ring-pink-400 focus-within:border-pink-400 transition">
                        <Lock size={18} className="text-gray-400 mr-2" />
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="text-right">
                    <button onClick={() => navigate('/forgot-password')} className="text-xs text-pink-600 hover:text-pink-700 font-semibold hover:underline">
                         Forgot Password?
                    </button>
                </div>

                <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-pink-200 transition-all transform hover:-translate-y-0.5 animate-pulse-button">
                    Login
                </button>
            </form>
            
            <div className="mt-6 text-center text-sm text-gray-600">
                Don't have an account? <Link to="/signup" className="text-purple-600 font-bold hover:underline">Sign up</Link>
            </div>
        </div>
    </div>
);
};

export default Login;