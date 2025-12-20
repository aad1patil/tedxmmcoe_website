import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const Register = () => {
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

                        <div className="grid md:grid-cols-2 gap-8 mb-12 text-left">
                            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 relative overflow-hidden group hover:border-ted-red transition-colors">
                                <div className="absolute top-0 right-0 p-4 bg-ted-red text-white text-xs font-bold rounded-bl-lg">
                                    EARLY BIRD
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Student Pass</h3>
                                <div className="text-4xl font-bold mb-6">₹499</div>
                                <ul className="space-y-3 mb-8 text-gray-400">
                                    <li className="flex items-center gap-2"><Check size={16} className="text-ted-red" /> Full Event Access</li>
                                    <li className="flex items-center gap-2"><Check size={16} className="text-ted-red" /> Lunch & Refreshments</li>
                                    <li className="flex items-center gap-2"><Check size={16} className="text-ted-red" /> Delegate Kit</li>
                                    <li className="flex items-center gap-2"><Check size={16} className="text-ted-red" /> E-Certificate</li>
                                </ul>
                                <button className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors">
                                    Book Now
                                </button>
                            </div>

                            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 relative overflow-hidden group hover:border-ted-red transition-colors">
                                <h3 className="text-2xl font-bold mb-2">Standard Pass</h3>
                                <div className="text-4xl font-bold mb-6">₹799</div>
                                <ul className="space-y-3 mb-8 text-gray-400">
                                    <li className="flex items-center gap-2"><Check size={16} className="text-ted-red" /> Full Event Access</li>
                                    <li className="flex items-center gap-2"><Check size={16} className="text-ted-red" /> Lunch & Refreshments</li>
                                    <li className="flex items-center gap-2"><Check size={16} className="text-ted-red" /> Premium Delegate Kit</li>
                                    <li className="flex items-center gap-2"><Check size={16} className="text-ted-red" /> Networking Session</li>
                                </ul>
                                <Link to="/login" className="block w-full text-center bg-ted-red text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors">
                                    Register & Pay
                                </Link>
                            </div>
                        </div>

                        <p className="text-gray-500 text-sm">
                            * Payment gateway integration simulated for demo. Clicking 'Register' will take you to the signup flow.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Register;
