import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { type = 'ticket', size = '' } = location.state || {};


    return (
        <div className="min-h-screen bg-ted-black text-white pt-24 px-4 pb-12">
            <div className="container mx-auto max-w-2xl">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Dashboard
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-900 rounded-2xl p-8 border border-gray-800"
                >
                    <div className="bg-ted-red/10 border border-ted-red rounded-xl p-4 mb-12 text-center">
                        <p className="text-ted-red font-bold text-lg">Registrations are officially CLOSED</p>
                        <p className="text-gray-400 text-sm mt-1">We have reached maximum capacity. No new payments will be accepted.</p>
                    </div>

                    <h1 className="text-3xl font-bold mb-2 text-center opacity-50">Complete Payment</h1>
                    <p className="text-gray-400 text-center mb-8">
                        {type === 'merchandise' ? `Official T-Shirt (${size})` : 'Event Ticket'}
                    </p>

                    <div className="space-y-6 opacity-30 pointer-events-none grayscale">
                        <div className="bg-white p-6 rounded-xl w-full max-w-sm mx-auto mb-8 text-center">
                            <img
                                src="/upi-qr.jpg"
                                alt="Payment QR Code"
                                className="w-full h-auto mx-auto mb-4 opacity-50"
                            />
                            <p className="text-black font-bold text-lg underline decoration-ted-red">UPI ID: tedxmmcoe@upi</p>
                        </div>

                        <div className="text-center p-4 bg-black/40 rounded-lg">
                            <p className="text-gray-500 italic">Payments are no longer being accepted.</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        disabled
                        className="w-full mt-10 bg-gray-800 text-gray-500 font-bold py-4 rounded-lg cursor-not-allowed uppercase tracking-widest"
                    >
                        Closed
                    </button>

                    <p className="text-center text-sm text-gray-400 mt-8">
                        For any queries, contact <span className="text-white font-medium">Aadi Patil - 9834925993</span>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Payment;
