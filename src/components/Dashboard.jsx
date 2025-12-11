import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
    Download, RefreshCw, Loader2, ThumbsUp, ThumbsDown, 
    ChefHat, Activity, LogOut, Utensils 
} from 'lucide-react';

// Define the base URL using the environment variable (Vercel/Vite standard)
// It uses the VITE_API_URL set in the Vercel dashboard or falls back to the local IP for testing.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://192.168.0.104:3000';


const Dashboard = () => {
    const { token, logout } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState(null);
    
    // User Inputs
    const [formData, setFormData] = useState({
        age: 21,
        weight: 67,
        height: 163,
        gender: 'female',
        activity: 'active',
        goal: 'weight_loss',
        diet: 'non-veg',
        allergies: '',
        dislikes: ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleGenerate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                allergies: formData.allergies.split(',').map(s => s.trim()).filter(Boolean),
                dislikes: formData.dislikes.split(',').map(s => s.trim()).filter(Boolean)
            };
            // --- FIX 1: Meal Plan Generation URL using API_BASE_URL ---
            const res = await axios.post(`${API_BASE_URL}/api/generate-plan`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPlan(res.data);
        } catch (err) {
            alert('Error: ' + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleRegenerate = async (dayIndex, mealType, currentFoodId) => {
        try {
            const payload = { ...formData, mealType, currentFoodId };
            // --- FIX 2: Meal Regeneration URL using API_BASE_URL ---
            const res = await axios.post(`${API_BASE_URL}/api/regenerate`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const newPlan = { ...plan };
            newPlan.weekPlan[dayIndex].meals[mealType] = res.data.meal;
            setPlan(newPlan);
        } catch (err) { alert('Failed to regenerate meal'); }
    };

    const handleFeedback = async (foodId, action) => {
        try { 
            // --- FIX 3: Feedback URL using API_BASE_URL ---
            await axios.post(`${API_BASE_URL}/api/user/feedback`, { foodId, action }, { 
                headers: { Authorization: `Bearer ${token}` } 
            }); 
        } 
        catch (err) { console.error(err); }
    };

    const handleExportPDF = async () => { /* (Keep same export logic) */ };

    // --- Common Input Class with Darker Border ---
    const inputClass = "w-full bg-white border border-gray-500/70 rounded-lg p-2.5 text-sm shadow-sm outline-none focus:ring-2 focus:ring-yellow-500 transition appearance-none placeholder-gray-400";

    // --- Common Select Class with Darker Border ---
    const selectClass = "w-full bg-white border border-gray-500/70 rounded-lg p-3 text-sm shadow-sm outline-none focus:ring-2 focus-within:ring-teal-500 transition appearance-none";


    return (
        // STATIC BACKGROUND: using a subtle off-white background
        <div className="flex h-screen bg-gray-50 text-gray-800 font-sans">
            
            {/* --- SIDEBAR (Premium Look) --- */}
            <motion.div 
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-80 bg-white border-r border-gray-100 flex flex-col shadow-xl z-20 h-full"
            >
                {/* Logo */}
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <div className="bg-teal-50 p-2 rounded-lg">
                        <ChefHat className="text-teal-600" size={24} />
                    </div>
                    <h1 className="text-xl font-bold text-gray-800 tracking-tight">AI Meal<span className="text-yellow-600">Planner</span></h1>
                </div>
                
                {/* Form */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <form onSubmit={handleGenerate} className="space-y-5">
                        
                        {/* Goal & Activity */}
                        <div className="space-y-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Goal & Activity</label>
                            <select name="goal" value={formData.goal} onChange={handleChange} className={selectClass.replace('p-3', 'p-2.5')}>
                                <option value="weight_loss">🔥 Lose Weight</option>
                                <option value="maintenance">⚖️ Maintain</option>
                                <option value="muscle_gain">💪 Build Muscle</option>
                            </select>
                            <select name="activity" value={formData.activity} onChange={handleChange} className={selectClass.replace('p-3', 'p-2.5')}>
                                <option value="sedentary">Sedentary (Desk)</option>
                                <option value="light">Light (1-3 days)</option>
                                <option value="moderate">Moderate (3-5 days)</option>
                                <option value="active">Active (Daily)</option>
                            </select>
                        </div>

                        {/* Biometrics with Labels */}
                        <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                            <label className="col-span-2 text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Biometrics</label>
                            
                            {/* Age Input */}
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 block">Age</label>
                                <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Age" className={inputClass} />
                            </div>
                            
                            {/* Gender Select */}
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 block">Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass.replace('p-2.5', 'p-3').replace('yellow-500', 'yellow-600')}>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            
                            {/* Weight Input */}
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 block">Weight (kg)</label>
                                <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="Weight (kg)" className={inputClass} />
                            </div>
                            
                            {/* Height Input */}
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 block">Height (cm)</label>
                                <input type="number" name="height" value={formData.height} onChange={handleChange} placeholder="Height (cm)" className={inputClass} />
                            </div>
                        </div>

                        {/* Preferences */}
                        <div className="space-y-3 pt-4 border-t border-gray-100">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Food Filters</label>
                            <select name="diet" value={formData.diet} onChange={handleChange} className={selectClass}>
                                <option value="veg">Vegetarian</option>
                                <option value="non-veg">Non-Veg</option>
                                <option value="vegan">Vegan</option>
                            </select>
                            
                            {/* Allergies Input */}
                            <input type="text" name="allergies" placeholder="Allergies (e.g. nuts)" value={formData.allergies} onChange={handleChange} className={inputClass.replace('p-2.5', 'p-3')} />
                            
                            {/* Dislikes Input */}
                            <input type="text" name="dislikes" placeholder="Dislikes (e.g. mushroom)" value={formData.dislikes} onChange={handleChange} className={inputClass.replace('p-2.5', 'p-3')} />
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-white space-y-3">
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGenerate} 
                        disabled={loading} 
                        className="w-full bg-gradient-to-r from-teal-500 to-yellow-600 hover:from-teal-600 hover:to-yellow-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-teal-200 transition-all flex justify-center items-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Generate Plan'}
                    </motion.button>
                    
                    <button onClick={logout} className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-teal-600 py-2 text-sm font-medium transition">
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </motion.div>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    {!plan ? (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center h-[80vh] text-center"
                        >
                            <div className="bg-teal-50 p-10 rounded-full mb-6 shadow-lg">
                                <Utensils size={64} className="text-teal-600" />
                            </div>
                            <h2 className="text-4xl font-bold text-gray-800 mb-2">Hello, Chef!</h2>
                            <p className="text-gray-500 text-lg max-w-md">Your personalized nutrition journey starts here. Use the sidebar to generate your plan.</p>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                            {/* Header Stats Card */}
                            <div className="bg-white p-6 rounded-2xl shadow-md flex flex-wrap justify-between items-center gap-4 border border-gray-100">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Weekly Plan</h2>
                                    <p className="text-gray-500 font-medium">Target: {plan.targets.calories} kcal</p>
                                </div>
                                <div className="flex gap-2">
                                    <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl font-bold">P: {plan.targets.protein}g</div>
                                    <div className="bg-teal-100 text-teal-700 px-4 py-2 rounded-xl font-bold">C: {plan.targets.carbs}g</div>
                                </div>
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                                {plan.weekPlan.map((day, dayIndex) => (
                                    <motion.div 
                                        key={day.day}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: dayIndex * 0.05 }}
                                        className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col border border-gray-100 hover:shadow-lg"
                                    >
                                        <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
                                            <span className="font-bold text-gray-800">{day.day}</span>
                                            <span className="text-xs font-bold text-teal-600 bg-white px-2 py-1 rounded-md shadow-sm">Day {dayIndex + 1}</span>
                                        </div>
                                        <div className="p-4 space-y-4 flex-1">
                                            {['breakfast', 'lunch', 'snack', 'dinner'].map((mealType) => {
                                                const meal = day.meals[mealType];
                                                if (!meal) return null;
                                                const mainItemId = meal.items[0]?.id;

                                                return (
                                                    <div key={mealType} className="group relative bg-white p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="text-[10px] font-bold uppercase text-gray-500">{mealType}</span>
                                                            <span className="text-[10px] font-bold text-gray-400">{meal.totalCalories} kcal</span>
                                                        </div>
                                                        <div className="font-medium text-gray-800 text-sm leading-tight">
                                                            {meal.items.map(i => i.name).join(', ')}
                                                        </div>
                                                        
                                                        {/* Actions (Appear on Hover) */}
                                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => handleRegenerate(dayIndex, mealType, mainItemId)} className="p-1 bg-white rounded-full shadow hover:text-teal-500"><RefreshCw size={12}/></button>
                                                            <button onClick={() => handleFeedback(mainItemId, 'liked')} className="p-1 bg-white rounded-full shadow hover:text-yellow-500"><ThumbsUp size={12}/></button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;