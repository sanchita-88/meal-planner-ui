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
        // ... (rest of the component code remains the same)
        <div className="flex items-center justify-center min-h-screen w-full h-full absolute inset-0 font-sans z-10">
            
            {/* Glassmorphism Card */}
            <div className="px-8 py-8 text-left glass-card shadow-2xl rounded-3xl w-96 backdrop-blur-md bg-white/80 border border-white/50">
                
                {/* Logo & Header */}
                <div className="flex justify-center mb-4">
                    <div className="bg-pink-100 p-3 rounded-full">
                        <ChefHat className="text-pink-600" size={32} />
                    </div>
                </div>
                <h3 className="text-2xl font-bold text-center text-gray-800">Welcome Back</h3>
                <p className="text-center text-gray-500 mb-6 text-sm">Login to your meal planner</p>
                
                {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</label>
                        <div className="flex items-center border border-gray-200 rounded-xl p-2.5 bg-white/50 focus-within:ring-2 focus-within:ring-pink-400 focus-within:border-transparent transition">
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
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Password</label>
                        <div className="flex items-center border border-gray-200 rounded-xl p-2.5 bg-white/50 focus-within:ring-2 focus-within:ring-pink-400 focus-within:border-transparent transition">
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
                        <Link to="/forgot-password" className="text-xs text-pink-600 hover:text-pink-700 font-semibold hover:underline">Forgot Password?</Link>
                    </div>

                    <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-pink-200 transition-all transform hover:-translate-y-0.5">
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