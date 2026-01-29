import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';

const Home = () => {
    return (
        <div className="bg-ted-black text-white">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=2670&auto=format&fit=crop"
                        alt="Auditorium"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ted-black/50 to-ted-black" />
                </div>

                <div className="container mx-auto px-4 z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col items-center"
                    >
                        <h1 className="text-6xl md:text-9xl font-bold mb-4 -mt-20">
                            <span className="text-ted-red">TEDx</span>MMCOE
                        </h1>
                        <h2 className="text-xl md:text-3xl font-medium mb-12 text-ted-red tracking-[0.3em] uppercase">
                            Ideas Worth Spreading
                        </h2>

                        {/* MMCOE Header Logo - Positioned below for better branding flow */}
                        <div className="w-full max-w-xl md:max-w-3xl mb-16 opacity-80">
                            <img
                                src="/mmcoe-header.png"
                                alt="Marathwada Mitramandal's College of Engineering"
                                className="w-full h-auto object-contain drop-shadow-2xl"
                                style={{ filter: 'brightness(0) invert(1)' }}
                            />
                        </div>

                        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-12">
                            <div className="flex items-center gap-2 text-gray-400">
                                <Calendar className="text-ted-red w-5 h-5" />
                                <span className="text-sm md:text-base">January 31, 2026</span>
                            </div>
                            <a
                                href="https://share.google/ryG58p146EqNqs4Gh"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-gray-400 hover:text-ted-red transition-colors"
                            >
                                <MapPin className="text-ted-red w-5 h-5" />
                                <span className="text-sm md:text-base">IMERT Hall, MMCOE</span>
                            </a>
                        </div>

                        <div className="flex flex-col md:flex-row justify-center gap-4">
                            <Link
                                to="/speakers"
                                className="px-8 py-4 border border-white text-white font-bold rounded-full hover:bg-white hover:text-black transition-all transform hover:scale-105 duration-200"
                            >
                                Meet Speakers
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-20 bg-black">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-4xl font-bold mb-6">
                                What is <span className="text-ted-red">TEDx</span>?
                            </h2>
                            <p className="text-gray-400 mb-6 leading-relaxed">
                                In the spirit of ideas that change everything, TED has created a program called TEDx. TEDx is a program of local, self-organized events that bring people together to share a TED-like experience.
                            </p>
                            <p className="text-gray-400 leading-relaxed">
                                At a TEDx event, TED Talks video and live speakers combine to spark deep discussion and connection in a small group. These local, self-organized events are branded TEDx, where x = independently organized TED event.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative h-64 md:h-96 rounded-lg overflow-hidden"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1560523160-754a9e25c68f?q=80&w=2636&auto=format&fit=crop"
                                alt="TEDx Crowd"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
