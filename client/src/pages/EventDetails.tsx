import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';

const EventDetails = () => {
    return (
        <div className="bg-ted-black min-h-screen py-20 text-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center">Event <span className="text-ted-red">Details</span></h1>

                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <Calendar className="text-ted-red" />
                                Date & Time
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                                    <span className="text-gray-400">Date</span>
                                    <span className="font-medium">January 31, 2025</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                                    <span className="text-gray-400">Registration</span>
                                    <span className="font-medium">09:00 AM</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                                    <span className="text-gray-400">Event Starts</span>
                                    <span className="font-medium">10:00 AM</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Event Ends</span>
                                    <span className="font-medium">05:00 PM</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <MapPin className="text-ted-red" />
                                Venue
                            </h3>
                            <p className="text-xl font-medium mb-2">IMERT Hall</p>
                            <p className="text-gray-400 mb-6">
                                MMCOE Campus, Karvenagar,<br />
                                Pune, Maharashtra 411052
                            </p>
                            <a
                                href="https://share.google/hPNLrtBmR4YofXPrX"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-block w-full text-center bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors"
                            >
                                View on Google Maps
                            </a>
                        </div>
                    </div>

                    <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
                        <h3 className="text-2xl font-bold mb-6 text-center">About the Theme</h3>
                        <p className="text-gray-300 leading-relaxed text-center max-w-2xl mx-auto">
                            "A mirror is more than just a reflection. It is an encounter, a revelation, and sometimes a distortion. When standing before the mirror, we are forced to meet our true selves: our desires and doubts, our perfections and imperfections, our hopes and hesitations. Aaina - meaning mirror - offers more than a reflection; it becomes a metaphor for the journey of self-discovery, resilience and transformation."
                        </p>
                    </div>
                </motion.div>
            </div >
        </div >
    );
};

export default EventDetails;
