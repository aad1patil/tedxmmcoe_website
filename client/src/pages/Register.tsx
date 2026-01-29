import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [mmitSoldOut, setMmitSoldOut] = useState(false);

    useEffect(() => {
        const checkRegistrations = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || '/api';
                const { data } = await axios.get(`${apiUrl}/registrations/count`);
                // Total registration soldOut check removed as per user request
                /* 
                if (data.count >= 180) {
                    setSoldOut(true);
                }
                */
                if (data.mmitCount >= 15) {
                    setMmitSoldOut(true);
                }
            } catch (err) {
                console.error("Error checking registration count:", err);
            }
        };
        checkRegistrations();
    }, []);

    return (
        <div className="bg-ted-black min-h-screen pt-12 pb-20 text-white flex flex-col items-center">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Secure Your <span className="text-ted-red">Spot</span>
                        </h1>
                        <p className="text-gray-400 text-xl mb-4">
                            Join 100 attendees for an unforgettable experience at TEDxMMCOE.
                        </p>
                        <p className="text-yellow-500 text-sm mb-12 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                            ⚠️ <strong>Important:</strong> If you select the wrong pass type, you will be required to repay the entire amount.
                        </p>




                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 text-left">

                            {/* MMIT Faculty/External Student Pass */}
                            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 relative overflow-hidden group hover:border-ted-red transition-colors flex flex-col justify-between ring-2 ring-ted-red ring-opacity-50">
                                <div>
                                    <div className="absolute top-0 right-0 bg-ted-red text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider animate-pulse">
                                        Limited: 15 Seats
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">MMIT Students/MMCOE Faculty</h3>
                                    <div className="text-3xl font-bold mb-2">₹500</div>
                                    <p className="text-gray-400 text-sm mb-6">Food/Lunch + TEDxMMCOE Goodies</p>
                                </div>
                                {mmitSoldOut ? (
                                    <button disabled className="block w-full text-center bg-gray-700 text-gray-500 font-bold py-3 rounded-lg cursor-not-allowed">
                                        Sold Out
                                    </button>
                                ) : (
                                    <Link
                                        to="/login"
                                        state={{ type: 'ticket', institution: 'MMIT' }}
                                        onClick={() => {
                                            localStorage.setItem('pendingReg', JSON.stringify({ institution: 'MMIT' }));
                                        }}
                                        className="block w-full text-center bg-ted-red text-white font-bold py-2 rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        Register (Special Pass)
                                    </Link>
                                )}
                            </div>

                            {/* Community Pass (For Everyone) */}
                            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 relative overflow-hidden group hover:border-ted-red transition-colors flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Community Pass</h3>
                                    <div className="text-3xl font-bold mb-2">₹800</div>
                                    <p className="text-gray-400 text-sm mb-6">Food/Lunch + TEDxMMCOE Goodies</p>
                                </div>
                                <Link
                                    to="/login"
                                    state={{ type: 'ticket', institution: 'Other' }}
                                    onClick={() => {
                                        localStorage.setItem('pendingReg', JSON.stringify({ institution: 'Other' }));
                                    }}
                                    className="block w-full text-center bg-gray-800 text-white font-bold py-2 rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Register (Community)
                                </Link>
                            </div>

                            {/* Team Pass */}
                            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 relative overflow-hidden group hover:border-ted-red transition-colors flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Team Pass</h3>
                                    <div className="text-3xl font-bold mb-2">₹300</div>
                                    <p className="text-gray-400 text-sm mb-6">TEDxMMCOE team members only</p>
                                </div>
                                <Link
                                    to="/login"
                                    state={{ type: 'team' }}
                                    onClick={() => {
                                        localStorage.removeItem('pendingReg'); // Clear for team
                                    }}
                                    className="block w-full text-center bg-white text-black font-bold py-2 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Register (Team)
                                </Link>
                            </div>
                        </div>


                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Register;
