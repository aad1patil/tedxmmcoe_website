import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const { login, signup, currentUser } = useAuth()!;
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'Attendee',
        teamRole: '',
        college: 'MMCOE'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (currentUser) {
            navigate('/dashboard');
        }
    }, [currentUser, navigate]);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.name === 'email' ? e.target.value.trim() : e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await signup(formData.name, formData.email, formData.password);
            }
            navigate('/dashboard');

        } catch (err: any) {
            console.error("Authentication Error Details:", err);
            setError(err.response?.data?.message || err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-ted-black text-white flex items-center justify-center py-20 px-4">
            <div className="w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl"
                >
                    <div className="flex justify-between mb-8">
                        <h2 className="text-3xl font-bold">
                            {isLogin ? 'Welcome Back' : 'Join the Team'}
                        </h2>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-6 text-sm capitalize">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-black border border-gray-700 rounded-lg p-3 focus:border-ted-red focus:outline-none transition-colors"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full bg-black border border-gray-700 rounded-lg p-3 focus:border-ted-red focus:outline-none transition-colors"
                                        placeholder="+91 98765 43210"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">College / Institution</label>
                                    <select
                                        name="college"
                                        value={formData.college}
                                        onChange={handleChange}
                                        className="w-full bg-black border border-gray-700 rounded-lg p-3 focus:border-ted-red focus:outline-none transition-colors text-white"
                                        required
                                    >
                                        <option value="MMCOE">MMCOE (Marathwada Mitra Mandal's College of Engineering)</option>
                                        <option value="Other">Other College / External</option>
                                    </select>
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-black border border-gray-700 rounded-lg p-3 focus:border-ted-red focus:outline-none transition-colors"
                                placeholder="john@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-black border border-gray-700 rounded-lg p-3 focus:border-ted-red focus:outline-none transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-ted-red text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors mt-6 disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
