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

function App() {
    return (
        // RENDER FIX: min-h-screen ensures it covers the full viewport, animated-background provides the motion.
        <div className="min-h-screen animated-background">
            <AuthProvider>
                <Router>
                    <Routes>
                        {/* All routes are children of the background div */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
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
    );
}

export default App;