import { motion } from 'framer-motion';

const schedule = [
    { time: "9:00 am", title: "Registrations Start & Arrival" },
    { time: "9:30 am", title: "Attendees Seated" },
    { time: "9:45 am", title: "Arrival of Dignitaries" },
    { time: "10:00 am", title: "Event Inauguration" },
    { time: "10:20 am", title: "Stage Setup" },
    { time: "10:30 am", title: "Introduction" },
    { time: "10:45 am", title: "Performance", speaker: "Kashmira Khot" },
    { time: "11:00 am", title: "Mirage", speaker: "Hrushikesh Joshi" },
    { time: "11:25 am", title: "Etched in Silver", speaker: "Priyanshi Choksi" },
    { time: "11:50 am", title: "Passion v Profession", speaker: "Ameya Kadam" },
    { time: "12:15 pm", title: "Lunch" },
    { time: "1:30 pm", title: "Performance #1" },
    { time: "1:45 pm", title: "Shayad", speaker: "Riddhi Shah" },
    { time: "2:10 pm", title: "Aaini-i-khidmat", speaker: "Chaitanya Deshpande" },
    { time: "2:35 pm", title: "Kintsugi", speaker: "Devanshi Saraogi" },
    { time: "3:05 pm", title: "Vote of Thanks" },
    { time: "3:15 pm", title: "Conclusion of Program" }
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
                    <p className="text-gray-400">A journey through our sessions.</p>
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

                                {/* Time (New) - Displayed on the opposite side of content on desktop */}
                                <div className={`md:w-1/2 flex ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'} md:absolute md:top-0 ${index % 2 === 0 ? 'md:left-0 md:pr-12' : 'md:right-0 md:pl-12'} md:mt-[-0.25rem]`}>
                                    <div className="hidden md:block text-ted-red font-bold text-xl">{item.time}</div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 ml-12 md:ml-0">
                                    <div className={`p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-ted-red transition-colors relative ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'
                                        }`}>
                                        {/* Mobile Time */}
                                        <div className="md:hidden absolute -top-8 left-0 text-ted-red font-bold">{item.time}</div>

                                        <div className="text-white font-bold text-xl mb-2">{item.title}</div>
                                        {item.speaker && <p className="text-ted-red font-medium">{item.speaker}</p>}
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
