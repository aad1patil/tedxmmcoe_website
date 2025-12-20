import { motion } from 'framer-motion';

const speakers = [
    {
        id: 1,
        name: "Dr. Future Tech",
        bio: "AI Researcher & Visionary",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop"
    },
    {
        id: 2,
        name: "Jane Innovation",
        bio: "Sustainable Energy Pioneer",
        image: "https://images.unsplash.com/photo-1573496359-136d475583dc?q=80&w=2669&auto=format&fit=crop"
    },
    {
        id: 3,
        name: "Alex Creative",
        bio: "Award-winning Digital Artist",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2670&auto=format&fit=crop"
    },
    {
        id: 4,
        name: "Sarah Education",
        bio: "Reimagining Global Learning",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2561&auto=format&fit=crop"
    }
];

const Speakers = () => {
    return (
        <div className="bg-ted-black min-h-screen py-20 text-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Our <span className="text-ted-red">Speakers</span></h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Meet the visionaries, creators, and leaders who will be sharing their ideas on the TEDxMMCOE stage.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {speakers.map((speaker, index) => (
                        <motion.div
                            key={speaker.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative overflow-hidden rounded-xl bg-gray-900"
                        >
                            <div className="aspect-[3/4] overflow-hidden">
                                <img
                                    src={speaker.image}
                                    alt={speaker.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-xl font-bold mb-1">{speaker.name}</h3>
                                <p className="text-ted-red text-sm font-medium">{speaker.bio}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Speakers;
