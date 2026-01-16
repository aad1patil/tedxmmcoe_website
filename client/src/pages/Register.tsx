import { motion } from 'framer-motion';

import { Link } from 'react-router-dom';

import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getCountFromServer } from 'firebase/firestore';

const Register = () => {
    const [soldOut, setSoldOut] = useState(false);

    useEffect(() => {
        const checkRegistrations = async () => {
            try {
                const coll = collection(db, "registrations");
                const snapshot = await getCountFromServer(coll);
                const count = snapshot.data().count;
                if (count >= 180) {
                    setSoldOut(true);
                }
            } catch (err) {
                console.error("Error checking registration count:", err);
            }
        };
        checkRegistrations();
    }, []);

    return (
        <div className="bg-ted-black min-h-screen py-20 text-white flex items-center justify-center">
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
                        <p className="text-gray-400 text-xl mb-12">
                            Join 500+ attendees for an unforgettable experience at TEDxMMCOE.
                        </p>

                        {soldOut && (
                            <div className="bg-red-500/20 border border-red-500 text-red-500 p-4 rounded-xl mb-8 font-bold text-xl animate-pulse">
                                🎟️ TICKETS TRULY SOLD OUT! (Limit Reached)
                            </div>
                        )}


                        <div className="grid md:grid-cols-3 gap-8 mb-12 text-left">
                            {/* Student Pass (MMCOE) */}
                            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 relative overflow-hidden group hover:border-ted-red transition-colors flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Student Pass</h3>
                                    <div className="text-3xl font-bold mb-2">₹500</div>
                                    <p className="text-gray-400 text-sm mb-6">(Only for MMCOE Students/Faculty)</p>
                                </div>
                                {soldOut ? (
                                    <button disabled className="block w-full text-center bg-gray-700 text-gray-500 font-bold py-3 rounded-lg cursor-not-allowed">
                                        Sold Out
                                    </button>
                                ) : (
                                    <Link to="/login" state={{ type: 'ticket', institution: 'MMCOE' }} className="block w-full text-center bg-ted-red text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors">
                                        Register (MMCOE)
                                    </Link>
                                )}
                            </div>

                            {/* Community Pass (Others) */}
                            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 relative overflow-hidden group hover:border-ted-red transition-colors flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Community Pass</h3>
                                    <div className="text-3xl font-bold mb-2">₹800</div>
                                    <p className="text-gray-400 text-sm mb-6">(For Other Colleges & External)</p>
                                </div>
                                {soldOut ? (
                                    <button disabled className="block w-full text-center bg-gray-700 text-gray-500 font-bold py-3 rounded-lg cursor-not-allowed">
                                        Sold Out
                                    </button>
                                ) : (
                                    <Link to="/login" state={{ type: 'ticket', institution: 'Other' }} className="block w-full text-center bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition-colors">
                                        Register (Community)
                                    </Link>
                                )}
                            </div>

                            {/* Team Pass */}
                            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 relative overflow-hidden group hover:border-ted-red transition-colors flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Team Pass</h3>
                                    <div className="text-3xl font-bold mb-2">₹300</div>
                                    <p className="text-gray-400 text-sm mb-6">TEDxMMCOE team members registration</p>
                                </div>
                                {soldOut ? (
                                    <button disabled className="block w-full text-center bg-gray-700 text-gray-500 font-bold py-3 rounded-lg cursor-not-allowed">
                                        Sold Out
                                    </button>
                                ) : (
                                    <Link to="/login" state={{ type: 'team' }} className="block w-full text-center bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors">
                                        Register (Team)
                                    </Link>
                                )}
                            </div>
                        </div>


                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Register;
