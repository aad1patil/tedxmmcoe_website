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
        teamRole: ''
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
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        console.log("Starting Authentication Process...");
        console.log("Form Data:", { ...formData, password: '[REDACTED]' });

        try {
            let userCredential;
            if (isLogin) {
                // Login
                console.log("Attempting Firebase SignIn...");
                userCredential = await login(formData.email, formData.password);
                console.log("Firebase SignIn Success:", userCredential.user.uid);
            } else {
                // Register
                console.log("Attempting Firebase Call (CreateUser)...");
                userCredential = await signup(formData.email, formData.password);
                console.log("Firebase CreateUser Success:", userCredential.user.uid);
            }

            console.log("Getting ID Token...");
            const token = await userCredential.user.getIdToken();
            console.log("ID Token retrieved (first 10 chars):", token.substring(0, 10) + "...");

            // If registering, sync extra details to our backend
            if (!isLogin) {
                console.log("Attempting Server Sync to http://localhost:5001/api/auth/sync-user ...");
                const syncResponse = await axios.post('http://localhost:5001/api/auth/sync-user', {
                    name: formData.name,
                    phone: formData.phone,
                    role: formData.role,
                    teamRole: formData.teamRole
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("Server Sync Success:", syncResponse.data);
            }

            // Navigate handled by useEffect or here
            console.log("Navigating to Dashboard...");
            navigate('/dashboard');

        } catch (err: any) {
            console.error("Authentication Error Details:", err);

            // Improve error message display
            let errorMessage = "An error occurred";
            if (err.code) {
                errorMessage = `Firebase Error: ${err.code}`;
            } else if (err.response) {
                errorMessage = `Server Error: ${err.response.status} - ${err.response.data.message || err.response.statusText}`;
            } else {
                errorMessage = err.message;
            }

            console.error("Constructed Error Message:", errorMessage);
            setError(errorMessage);
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
