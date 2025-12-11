import React, { useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
    Download, RefreshCw, Loader2, ThumbsUp, 
    ChefHat, LogOut, Utensils, Menu 
} from 'lucide-react'; 

// PDF Library Imports: REMOVED STATIC IMPORTS TO AVOID RUNTIME CRASH
// import html2canvas from 'html2canvas'; // REMOVED
// import jsPDF from 'jspdf'; // REMOVED


// Define the base URL using the environment variable (Vercel/Vite standard)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://192.168.0.104:3000';


const Dashboard = () => {
    const { token, logout } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState(null);
    
    // UI and State Management
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
    const planRef = useRef(null); // Reference to the element containing the meal plan

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

    // Close sidebar if screen size changes from mobile to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) { // Tailwind's 'md' breakpoint
                setIsSidebarOpen(false); // Ensure mobile state is reset on desktop
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


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
            const res = await axios.post(`${API_BASE_URL}/api/generate-plan`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPlan(res.data);
            setIsSidebarOpen(false); // Close sidebar on mobile after generation
        } catch (err) {
            alert('Error: ' + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleRegenerate = async (dayIndex, mealType, currentFoodId) => {
        try {
            const payload = { ...formData, mealType, currentFoodId };
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
            await axios.post(`${API_BASE_URL}/api/user/feedback`, { foodId, action }, { 
                headers: { Authorization: `Bearer ${token}` } 
            }); 
        } 
        catch (err) { console.error(err); }
    };

    // **PDF EXPORT IMPLEMENTATION - DYNAMIC IMPORT FIX**
    const handleExportPDF = async () => { 
        const input = planRef.current;
        if (!input) return;

        setLoading(true); 

        try {
            // Dynamically import libraries inside the function
            const [
                { default: importedHtml2canvas }, 
                { default: importedJsPDF }
            ] = await Promise.all([
                import('html2canvas'),
                import('jspdf')
            ]);

            // 1. Capture the HTML content as a canvas image
            const canvas = await importedHtml2canvas(input, {
                scale: 2, 
                useCORS: true,
            });
            
            // 2. Convert canvas to image data and initialize PDF
            const imgData = canvas.toDataURL('image/jpeg');
            let pdf = new importedJsPDF('p', 'mm', 'a4'); 
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            // Calculate image height based on canvas aspect ratio
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;
            
            // 3. Check if content exceeds one page (Multi-page handling for long plans)
            if (imgHeight > pdfHeight) {
                const totalPages = Math.ceil(imgHeight / pdfHeight);
                
                for (let i = 0; i < totalPages; i++) {
                    let position = -(i * pdfHeight);
                    if (i > 0) {
                        pdf.addPage();
                    }
                    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
                }
            } else {
                pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, imgHeight);
            }

            // 4. Download the file
            pdf.save(`weekly_meal_plan_${new Date().toISOString().slice(0, 10)}.pdf`);

        } catch (error) {
            console.error("PDF Generation Failed:", error);
            alert("Failed to generate PDF. Check the console for details.");
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full bg-white border border-gray-500/70 rounded-lg p-2.5 text-sm shadow-sm outline-none focus:ring-2 focus:ring-yellow-500 transition appearance-none placeholder-gray-400";
    const selectClass = "w-full bg-white border border-gray-500/70 rounded-lg p-3 text-sm shadow-sm outline-none focus:ring-2 focus-within:ring-teal-500 transition appearance-none";


    return (
        // STATIC BACKGROUND: using a subtle off-white background
        <div className="flex h-screen bg-gray-50 text-gray-800 font-sans">
            
            {/* --- SIDEBAR (RESPONSIVE DRAWER FIX) --- */}
            <motion.div 
                initial={false} 
                animate={{ x: isSidebarOpen ? 0 : -320 }} 
                transition={{ duration: 0.3 }}
                // **FIXED CLASSNAME FOR DESKTOP VISIBILITY**
              className={`w-80 bg-white border-r border-gray-100 flex-col shadow-xl z-30 h-full 
                    ${isSidebarOpen ? 'fixed translate-x-0 flex' : 'fixed -translate-x-full hidden'} 
                    md:relative md:flex md:translate-x-0 transition-transform duration-300`}
            >
                {/* Logo & Close Button */}
                <div className="p-6 border-b border-gray-100 flex items-center gap-3 justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-teal-50 p-2 rounded-lg">
                            <ChefHat className="text-teal-600" size={24} />
                        </div>
                        <h1 className="text-xl font-bold text-gray-800 tracking-tight">AI Meal<span className="text-yellow-600">Planner</span></h1>
                    </div>
                    {/* Close button for mobile */}
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-500 hover:text-red-500">
                        <LogOut size={20} />
                    </button>
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
            {/* Conditional Overlay for Mobile */}
            {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}
            
            <div className="flex-1 overflow-y-auto p-8 bg-gray-50">

                {/* --- MOBILE MENU BUTTON --- */}
                <div className="md:hidden flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">{loading ? 'Generating...' : 'Weekly Plan'}</h2>
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-3 bg-white rounded-xl shadow-md text-gray-700 hover:text-teal-600 transition"
                    >
                        <Menu size={20} />
                    </button>
                </div>
                {/* --- END MOBILE MENU BUTTON --- */}

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
                        // Attach ref for PDF generation here
                        <motion.div ref={planRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                            {/* Header Stats Card with PDF Button */}
                            <div className="bg-white p-6 rounded-2xl shadow-md flex flex-wrap justify-between items-center gap-4 border border-gray-100">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Weekly Plan</h2>
                                    <p className="text-gray-500 font-medium">Target: {plan.targets.calories} kcal</p>
                                </div>
                                
                                {/* Macrod/PDF Wrapper */}
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-2">
                                        <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl font-bold">P: {plan.targets.protein}g</div>
                                        <div className="bg-teal-100 text-teal-700 px-4 py-2 rounded-xl font-bold">C: {plan.targets.carbs}g</div>
                                    </div>
                                    
                                    {/* --- NEW PDF BUTTON --- */}
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleExportPDF} 
                                        className="bg-gray-100 text-gray-700 p-3 rounded-xl hover:bg-teal-200 transition-colors shadow-sm"
                                    >
                                        <Download size={20} />
                                    </motion.button>
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