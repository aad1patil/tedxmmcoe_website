import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const speakers = [
    {
        id: 1,
        name: "Amey Kadam",
        bio: "Artist & Storyteller",
        image: "/speaker-amey.jpg",
        talkTitle: "Dil vs Duniya",
        talkDescription: `As ambition increasingly takes new forms, we’re left asking an important question: should we follow the safety of conventional careers, or choose paths driven by passion and purpose? In today’s evolving world, success is no longer limited to engineering, medicine, or law—careers in creative, digital, and public-facing domains are reshaping how we define achievement. This talk explores the reality of pivoting away from stability to pursue what truly matters, examining both the freedom and the pressures that come with unconventional choices. Passion or Profession? invites us to look beyond societal expectations and reflect on what it truly means to build a fulfilling career.`,
        speakerDescription: `Ameya is a storyteller and content creator. He began as a child actor in the famous Marathi television serial De Dhamal. He later studied Applied Art and photography, graduating as a gold medallist and a CAG award winner.
While still in college, driven by curiosity to understand how reality television works, he applied for MTV Roadies and went on to become the first Marathi contestant to reach the Top 5 in Roadies Season 7. After graduating, he worked at the advertising agency Mudra, before returning to his art college as a professor, where he taught advertising campaigns for nearly nine years.
Post the pandemic, he moved fully into content creation and is now best known for Bha2pa, a YouTube series exploring food, culture, and everyday stories.`
    },
    {
        id: 2,
        name: "Hrushikesh Joshi",
        bio: "Singer & Visionary",
        image: "/speaker-hrushikesh.jpg",
        talkTitle: "Mirage",
        talkDescription: `The age of technology tests creativity and identity with the rise of synthetic “art”. Today’s world is one where art is both painted and programmed—a realm where so-called “masterpieces” can be conjured up by algorithms in seconds. But is the beauty real, or is it just a shimmer on the horizon? This talk dives deep into the alluring spell of AI-generated media, pressing us to ask: What still belongs purely to human hands and hearts? 
In the age of the ultimate creative illusion, will we dare to chase what’s real beyond the mirage, or settle for reflections in the silicon sand?`,
        speakerDescription: `From Rank to Riffs - a relentless pursuit.
MMCOE and IIM Bangalore alumnus, National level Lawn-Tennis player, Over nine years of sea service - bearing the Indian Navy’s coveted “Command at Sea” Manager in a software product company, and now a published singer-songwriter-actor`
    },
    {
        id: 3,
        name: "Chaitanya Deshpande",
        bio: "Professional Football Freestyler",
        image: "/speaker-chaitanya.jpg",
        talkTitle: "Aaina-i-khidmat",
        talkDescription: `When systems evolve, society does not always follow. Working for society can often mean standing against it—unseen, unsupported, and resisted. Yet progress is shaped by those who continue to serve with empathy despite opposition, rising through persistence rather than approval. Machines may solve problems, but hope and equity are built by people who reflect society’s flaws back to itself. True change begins when service endures, even without acceptance.`,
        speakerDescription: `Chaitanya is a professional football freestyler and panna athlete who expresses himself through football tricks. He represents India at global events and World Championships, performing on international stages. Now a full-time content creator known as Saadha Manus, he focuses on inspiring the upcoming generation while entertaining audiences around the world.`
    },
    {
        id: 4,
        name: "Devanshi Saraogi",
        bio: "Artist",
        image: "/speaker-devanshi.jpg",
        talkTitle: "Kintsugi",
        talkDescription: `After all the disruption, reinvention, and reflection—what remains is the human ability to find beauty in the cracks. “Kintsugi” is the survivor’s story—where every crack, failure, and setback becomes a line of gold, not a flaw. In a landscape transformed by disruption and reinvention, this talk celebrates how humans mend, restart, and remake themselves—embracing imperfection as a badge of honor. The world may fracture, systems may evolve, but resilience glimmers through the cracks. In the mosaic of change, it’s the courage to begin again—and the wisdom to cherish scars—that ultimately makes life a masterpiece.`,
        speakerDescription: `Devanshi Saraogi is an artist and creative entrepreneur, and the founder of D RefleQtion, a branding studio based in India. She began her journey at 17 by creating an art page on Instagram, where she sold hand-painted artworks. She later dropped out of college and, without formal design education, financial safety nets, or access to a laptop, taught herself branding and design. Her first logo was created using only her phone. Over time, she transformed this art page into what would eventually become her branding studio.
Originally from Assam, Devanshi moved to Mumbai to build her business independently. Over the years, she has grown her studio from small freelance projects to leading large-scale branding engagements, progressing from charging ₹500 for her early work to closing six- and seven-figure projects.`
    },
    {
        id: 5,
        name: "Priyanshi Chokshi",
        bio: "Lawyer, CA",
        image: "/speaker-priyanshi.jpg",
        talkTitle: "Etched in Silver",
        talkDescription: `As our world turns digital, even money begins to lose its form—trading the clink of coins for the click of codes. Imagine a world where every rupee is a ripple in data, every transaction a trace in the banking ether. Would the disappearance of cash erase corruption, wash away black money, make stealing obsolete? Or will new loopholes—and new anxieties—emerge beneath the sheen of a cashless society? This talk lifts the silver veil on a future where every move is monitored, every choice is tallied, and trust must evolve alongside technology. As we weigh convenience against control, we must ask: When currency becomes pure information, what’s really gained—and what’s lost?`,
        speakerDescription: `Priyanshi is a Chartered Accountant, tax lawyer, and corporate trainer based in Mumbai and New York. She co-founded Beyond the Degree, an education consultancy that works with universities and student communities across India to help young people build careers that balance professional degrees with unconventional interests.
A national-level gold-medallist swimmer and professional Odissi dancer, she has also worked as a Radio Mirchi jockey and celebrity talk show host, interviewing 30+ Bollywood artists, sports personalities, and entrepreneurs. In 2016, she represented India at a Global Leadership Conference hosted by the White House, received a letter of appreciation from Michelle Obama, and served as the flag bearer for NYU School of Law convocation.
Today, Priyanshi mentors students and young professionals, encouraging them to embrace multi-passionate, layered identities beyond a single “safe” label.`
    },
    {
        id: 6,
        name: "Riddhi Shah",
        bio: "Mental Health Professional",
        image: "/speaker-riddhi.jpg",
        talkTitle: "Shāyad",
        talkDescription: `As the line between real and artificial blurs, self doubt seeps into every creator and “शायद” takes center stage—the soft, uncertain throb of almost making it in a world obsessed with perfection. Here, ambition isn’t a finish line, but an endless corridor echoing with the footsteps of students weighed down by borrowed dreams and relentless cutoffs, all with a single question haunting them: What if my best is just not enough? Can I pull through this last “almost there”?
This isn’t just a symptom to cure, but a sensation we all share—a global pulse of anxiety palpitating through admit cards, scoreboards, and silent, sleepless nights. On the stage, we crack open that ache—pulling beauty from the chase, and meaning from the uncertainty. After all, as we blur the lines between real and artificial, it’s the honest ache of “almost”—not the illusion of perfection—that makes us truly human.`,
        speakerDescription: `Riddhi Shah is a mental health practitioner, graphologist, and social innovator dedicated to fostering human connection through empathy and art. Holding a Master’s degree from Christ University, her career spans de-addiction centers, schools, and corporate leadership at firms like Bosch; she currently serves as the lead Psychologist at Elevate Now alongside her private practice. As the co-founder of ‘Dear You’, she leads a postcard initiative that blends psychology and creativity to ensure individuals feel truly seen and heard. Driven by an insatiable curiosity to decode the "why" of human behavior, Riddhi advocates for emotional intelligence as a foundation for a more connected society.`
    }
];

// Duplicate speakers for seamless loop
const marqueeSpeakers = [...speakers, ...speakers];

const Speakers = () => {
    const [selectedSpeaker, setSelectedSpeaker] = useState<typeof speakers[0] | null>(null);
    const marqueeRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);

    return (
        <div className="bg-ted-black min-h-screen py-20 text-white overflow-hidden flex flex-col justify-center relative">
            <div className="container mx-auto px-4 mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Our <span className="text-ted-red">Speakers</span></h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Meet the visionaries, creators, and leaders who will be sharing their ideas on the TEDxMMCOE stage.
                    </p>
                </motion.div>
            </div>

            {/* Marquee Container */}
            <div
                className="relative w-full overflow-hidden"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-ted-black to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-ted-black to-transparent z-10 pointer-events-none" />

                <motion.div
                    ref={marqueeRef}
                    className="flex gap-8 w-fit pl-4"
                    animate={{ x: ["0%", "-50%"] }}
                    style={{ x: 0 }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 30,
                        playState: isPaused ? "paused" : "running"
                    }}
                >
                    {marqueeSpeakers.map((speaker, index) => (
                        <div
                            key={`${speaker.id}-${index}`}
                            onClick={() => setSelectedSpeaker(speaker)}
                            className="flex-shrink-0 w-72 md:w-80 group relative overflow-hidden rounded-xl bg-gray-900 cursor-pointer transform transition-transform hover:scale-105"
                        >
                            <div className="aspect-[3/4] overflow-hidden">
                                <img
                                    src={speaker.image}
                                    alt={speaker.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    draggable="false"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-xl font-bold mb-1">{speaker.name}</h3>
                                <p className="text-ted-red text-sm font-medium">{speaker.bio}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {selectedSpeaker && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedSpeaker(null)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                        />
                        <motion.div
                            layoutId={`speaker-${selectedSpeaker.id}`}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-gray-900 rounded-2xl overflow-hidden max-w-6xl w-full max-h-[90vh] shadow-2xl flex flex-col md:flex-row"
                        >
                            <button
                                onClick={() => setSelectedSpeaker(null)}
                                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black rounded-full text-white transition-colors"
                            >
                                <X size={24} />
                            </button>

                            {/* Left Section - Image */}
                            <div className="md:w-1/3 h-64 md:h-auto relative hidden md:block">
                                <img
                                    src={selectedSpeaker.image}
                                    alt={selectedSpeaker.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent md:bg-gradient-to-r" />
                            </div>

                            {/* Right Section - Content */}
                            <div className="md:w-2/3 p-8 md:p-12 overflow-y-auto custom-scrollbar flex flex-col gap-8 md:flex-row">
                                {/* Mobile Image (visible only on small screens) */}
                                <div className="md:hidden w-full h-48 relative rounded-lg overflow-hidden mb-4">
                                    <img
                                        src={selectedSpeaker.image}
                                        alt={selectedSpeaker.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Speaker Info */}
                                <div className="md:w-1/2 space-y-4">
                                    <h2 className="text-2xl font-bold text-ted-red">About The Speaker</h2>
                                    <h3 className="text-xl font-bold text-white">{selectedSpeaker.name}</h3>
                                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                                        {selectedSpeaker.speakerDescription}
                                    </p>
                                </div>

                                {/* Divider */}
                                <div className="hidden md:block w-px bg-gray-700 mx-4" />
                                <div className="md:hidden h-px bg-gray-700 my-4" />

                                {/* Talk Info */}
                                <div className="md:w-1/2 space-y-4">
                                    <h2 className="text-2xl font-bold text-ted-red">About The Talk</h2>
                                    <h3 className="text-xl font-bold text-white">{selectedSpeaker.talkTitle}</h3>
                                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                                        {selectedSpeaker.talkDescription}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Speakers;
