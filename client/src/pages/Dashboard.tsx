import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // Fetch user profile from our backend
        axios.get('http://localhost:3000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                setUser(res.data.user);
            })
            .catch(() => {
                // If fetching fails (token invalid/expired), logout
                localStorage.removeItem('token');
                navigate('/login');
            });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-ted-black text-white pt-32 px-4">
            <div className="container mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-900 rounded-2xl p-8 border border-gray-800"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500/10 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                        >
                            Logout
                        </button>
                    </div>

                    <div className="bg-black p-6 rounded-xl border border-gray-800">
                        <h2 className="text-xl font-bold mb-4">Welcome, {user ? user.name : 'Team Member'}!</h2>
                        <div className="mb-4">
                            <span className="text-gray-400">Role: </span>
                            <span className="text-ted-red font-medium">{user ? user.role : 'Loading...'}</span>
                        </div>
                        <p className="text-gray-400">
                            You have successfully logged in. This dashboard will contain resources specific to your role.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
