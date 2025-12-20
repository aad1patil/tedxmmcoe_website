import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import axios from 'axios';

const ROLES = [
    'Faculty', 'Licensee', 'Curation Team', 'Design Team',
    'Outreach Team', 'Production Team', 'Logistics Team',
    'Speaker', 'Attendee'
];

const TEAM_ROLES = ['Head', 'Co-Head', 'Member'];

const Login = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: '',
        teamRole: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const needsTeamRole = (role: string) => {
        return !['Faculty', 'Licensee', 'Speaker', 'Attendee'].includes(role) && role !== '';
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let userCredential;
            if (isLogin) {
                // Login
                userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
            } else {
                // Register in Firebase
                userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            }

            const token = await userCredential.user.getIdToken();

            // If registering, sync extra details to our backend
            if (!isLogin) {
                await axios.post('http://localhost:3000/api/auth/sync-user', {
                    token,
                    name: formData.name,
                    phone: formData.phone,
                    role: formData.role,
                    teamRole: formData.teamRole
                });
            }

            // Save token (or just rely on Firebase auth state observer in a real app)
            localStorage.setItem('token', token);
            navigate('/dashboard');

        } catch (err: any) {
            console.error(err);
            setError(err.message.replace('Firebase: ', ''));
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
                        <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-6 text-sm">
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

                        {!isLogin && (
                            <>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Role</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full bg-black border border-gray-700 rounded-lg p-3 focus:border-ted-red focus:outline-none transition-colors appearance-none"
                                        required
                                    >
                                        <option value="">Select your role</option>
                                        {ROLES.map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                </div>

                                <AnimatePresence>
                                    {needsTeamRole(formData.role) && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                        >
                                            <label className="block text-sm text-gray-400 mb-1">Team Position</label>
                                            <select
                                                name="teamRole"
                                                value={formData.teamRole}
                                                onChange={handleChange}
                                                className="w-full bg-black border border-gray-700 rounded-lg p-3 focus:border-ted-red focus:outline-none transition-colors appearance-none"
                                                required
                                            >
                                                <option value="">Select position</option>
                                                {TEAM_ROLES.map(role => (
                                                    <option key={role} value={role}>{role}</option>
                                                ))}
                                            </select>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </>
                        )}

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
