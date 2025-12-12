// src/App.jsx

import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider, { AuthContext } from './context/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Signup from './components/Signup'; 
import ForgotPassword from './components/ForgotPassword';

const PrivateRoute = ({ children }) => {
    const { token, loading } = useContext(AuthContext);
    if (loading) return <div className="p-10 text-center">Loading...</div>;
    return token ? children : <Navigate to="/login" />;
};

// src/App.jsx

// ... (existing imports)

function App() {
    return (
        // 1. MAIN WRAPPER: Relative position for the absolute background layer
        <div className="relative min-h-screen"> 
            
            {/* 2. ANIMATED BACKGROUND LAYER (Fixed, Full Screen, Z-index 0) */}
            <div className="absolute inset-0 z-0 animated-background bg-gradient-to-br from-pink-50 to-purple-50">
                {/* This layer provides the motion and colors */}
            </div>

            {/* 3. APPLICATION CONTENT WRAPPER (Z-index 10, keeps content centered) */}
            <div className="relative z-10 min-h-screen">
                <AuthProvider>
                    <Router>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            {/* ... (rest of the routes) ... */}
                            <Route path="/dashboard" element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            } 
                            />
                            <Route path="*" element={<Navigate to="/dashboard" />} />
                        </Routes>
                    </Router>
                </AuthProvider>
            </div>
        </div>
    );
}

export default App;