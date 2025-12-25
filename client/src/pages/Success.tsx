import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

const Success = () => {
    return (
        <div className="min-h-screen bg-ted-black text-white flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-900/50 backdrop-blur-lg p-8 md:p-12 rounded-2xl border border-gray-800 text-center max-w-lg w-full"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8"
                >
                    <CheckCircle className="w-12 h-12 text-green-500" />
                </motion.div>

                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    Registration Successful!
                </h1>

                <p className="text-gray-400 text-lg mb-8">
                    Congratulations! Your payment details have been submitted. We are verifying your transaction and will update your status shortly.
                </p>

                <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center px-8 py-3 bg-ted-red text-white font-bold rounded-lg hover:bg-red-700 transition-all transform hover:scale-105"
                >
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
            </motion.div>
        </div>
    );
};

export default Success;
