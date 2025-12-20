import { motion } from 'framer-motion';

const schedule = [
    { time: "09:00 AM", title: "Registration & Breakfast", description: "Collect your badges and kits." },
    { time: "10:00 AM", title: "Opening Ceremony", description: "Lighting the lamp and introduction." },
    { time: "10:30 AM", title: "Session 1: The Spark", description: "First set of 3 speakers." },
    { time: "12:00 PM", title: "Networking Break", description: "Tea/Coffee and interactions." },
    { time: "12:30 PM", title: "Session 2: The Catalyst", description: "Second set of 3 speakers." },
    { time: "02:00 PM", title: "Lunch Break", description: "Gourmet lunch at the cafeteria." },
    { time: "03:00 PM", title: "Session 3: The Impact", description: "Final set of speakers and performances." },
    { time: "04:30 PM", title: "Closing Ceremony", description: "Vote of thanks and networking." }
];

const Timeline = () => {
    return (
        <div className="bg-ted-black min-h-screen py-20 text-white">
            <div className="container mx-auto px-4 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Event <span className="text-ted-red">Timeline</span></h1>
                    <p className="text-gray-400">A flowchart of inspiration for January 31, 2025.</p>
                </motion.div>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-800 -translate-x-1/2" />

                    <div className="space-y-12">
                        {schedule.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
                                    }`}
                            >
                                {/* Dot */}
                                <div className="absolute left-4 md:left-1/2 top-0 w-4 h-4 bg-ted-red rounded-full -translate-x-1/2 z-10 border-4 border-black" />

                                {/* Content */}
                                <div className="flex-1 ml-12 md:ml-0">
                                    <div className={`p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-ted-red transition-colors ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'
                                        }`}>
                                        <div className="text-ted-red font-bold text-lg mb-2">{item.time}</div>
                                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                        <p className="text-gray-400 text-sm">{item.description}</p>
                                    </div>
                                </div>

                                {/* Spacer for opposite side */}
                                <div className="flex-1 hidden md:block" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Timeline;
