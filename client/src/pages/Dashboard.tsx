import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, logout } = useAuth()!;
    const [userProfile, setUserProfile] = useState<any>(null);

    // ... existing useEffect ... 

    useEffect(() => {
        if (!currentUser) {
            return;
        }

        const fetchProfile = async () => {
            try {
                const token = await currentUser.getIdToken();
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
                const res = await axios.get(`${apiUrl}/api/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserProfile(res.data.user);
            } catch (err) {
                console.error("Failed to fetch profile", err);
            }
        };
        fetchProfile();
    }, [currentUser]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to logout", error);
        }
    };

    return (
        <div className="min-h-screen bg-ted-black text-white pt-24 px-4 pb-12 relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=2670&auto=format&fit=crop"
                    alt="Background"
                    className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-ted-black/80 to-ted-black" />
            </div>

            <div className="container mx-auto max-w-6xl relative z-10">
                {/* Welcome Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="text-white">Welcome, </span>
                        <span className="text-ted-red">{userProfile ? userProfile.name : (currentUser?.displayName || 'Innovator')}</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl">
                        We are thrilled to have you as part of the <span className="text-white font-semibold">TEDxMMCOE</span> community.
                        Get ready to ignite your mind and explore ideas worth spreading.
                    </p>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* User Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-800"
                    >
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <span className="w-2 h-8 bg-ted-red rounded-full"></span>
                            Your Profile
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-500">Email Address</label>
                                <p className="text-lg font-medium">{currentUser?.email}</p>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="w-full mt-8 bg-red-500/10 text-red-500 py-3 rounded-lg font-semibold hover:bg-ted-red hover:text-white transition-all duration-300"
                            >
                                Sign Out
                            </button>
                        </div>
                    </motion.div>

                    {/* Quick Actions & Event Info */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Event Info Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-gray-800 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-ted-red/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                            <h2 className="text-3xl font-bold mb-4 relative z-10">Igniting Minds</h2>
                            <p className="text-gray-300 mb-6 relative z-10 max-w-xl">
                                Join us for an extraordinary journey of discovery. Your participation helps us foster a community of curious souls and passionate changemakers.
                            </p>
                            <div className="flex flex-wrap gap-4 relative z-10">
                                <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                                    <span className="block text-xs text-gray-500">Date</span>
                                    <span className="font-semibold">January 31, 2025</span>
                                </div>
                                <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                                    <span className="block text-xs text-gray-500">Venue</span>
                                    <span className="font-semibold">MMCOE Auditorium</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Navigation Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { title: 'Event Details', desc: 'View schedule & venue info', path: '/event-details', color: 'bg-blue-500' },
                                { title: 'Timeline', desc: 'Track the event journey', path: '/timeline', color: 'bg-purple-500' },
                                { title: 'Meet Speakers', desc: 'Our visionaries', path: '/speakers', color: 'bg-green-500' },
                                { title: 'Buy Ticket', desc: 'Secure your spot', path: '/payment', color: 'bg-orange-500' }
                            ].map((item, index) => (
                                <motion.button
                                    key={item.title}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + (index * 0.1) }}
                                    onClick={() => navigate(item.path)}
                                    className="group p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-ted-red/50 hover:bg-gray-800 transition-all duration-300 text-left"
                                >
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-ted-red transition-colors">{item.title}</h3>
                                    <p className="text-sm text-gray-400">{item.desc}</p>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Success Notification */}
                {location.state?.successMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-24 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3"
                    >
                        <div className="bg-white/20 p-2 rounded-full">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-bold">Success!</h4>
                            <p className="text-sm">{location.state.successMessage}</p>
                        </div>
                        <button
                            onClick={() => navigate('.', { state: {} })}
                            className="ml-4 text-white/50 hover:text-white"
                        >
                            ✕
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
