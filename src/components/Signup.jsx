import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, UserPlus, ArrowRight } from 'lucide-react';

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
            // Call the Signup API
            const res = await axios.post('http://localhost:3000/api/auth/signup', { email, password });
            
            // Log the user in immediately after signup
            login(res.data.token, res.data); 
            navigate('/dashboard'); 
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="px-8 py-8 text-left bg-white shadow-xl rounded-2xl w-96 border border-gray-100">
                <div className="flex justify-center mb-4">
                    <div className="bg-green-100 p-3 rounded-full">
                        <UserPlus className="text-green-600" size={32} />
                    </div>
                </div>
                <h3 className="text-2xl font-bold text-center text-gray-800">Create Account</h3>
                <p className="text-center text-gray-500 mb-6 text-sm">Join Smart Meal Planner today</p>
                
                {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                        <div className="flex items-center border border-gray-300 rounded-lg p-2.5 bg-gray-50 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent transition">
                            <Mail size={18} className="text-gray-400 mr-2" />
                            <input 
                                type="email" 
                                placeholder="Enter email"
                                className="w-full bg-transparent outline-none text-sm text-gray-700"
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                        <div className="flex items-center border border-gray-300 rounded-lg p-2.5 bg-gray-50 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent transition">
                            <Lock size={18} className="text-gray-400 mr-2" />
                            <input 
                                type="password" 
                                placeholder="Create password"
                                className="w-full bg-transparent outline-none text-sm text-gray-700"
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
                        <div className="flex items-center border border-gray-300 rounded-lg p-2.5 bg-gray-50 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent transition">
                            <Lock size={18} className="text-gray-400 mr-2" />
                            <input 
                                type="password" 
                                placeholder="Repeat password"
                                className="w-full bg-transparent outline-none text-sm text-gray-700"
                                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition flex justify-center items-center gap-2">
                        Sign Up <ArrowRight size={18} />
                    </button>
                </form>
                
                <div className="mt-6 text-center text-sm text-gray-600">
                    Already have an account? <Link to="/login" className="text-green-600 font-semibold hover:underline">Login here</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;