import { motion } from 'framer-motion';

const Register = () => {
    return (
        <div className="bg-ted-black min-h-screen pt-24 pb-20 text-white flex items-center justify-center">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-gray-900/50 p-12 rounded-3xl border border-ted-red shadow-2xl backdrop-blur-sm"
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-ted-red/20 rounded-full mb-8">
                            <svg className="w-10 h-10 text-ted-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m11 3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Registrations <span className="text-ted-red">Closed</span>
                        </h1>
                        <p className="text-gray-300 text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
                            Thank you for your overwhelming interest! We have officially reached our maximum capacity for TEDxMMCOE.
                        </p>
                        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-8" />
                        <p className="text-gray-500 text-base">
                            Stay tuned for updates on our social media channels.
                            <br />
                            For any queries, reach out to <span className="text-white">tedxmmcoe@mmcoe.edu.in</span>
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Register;
