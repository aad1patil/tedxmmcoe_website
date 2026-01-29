import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Check } from 'lucide-react';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const Merchandise = () => {
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [isHovered, setIsHovered] = useState(false);


    return (
        <div className="min-h-screen bg-ted-black text-white pt-24 px-4 pb-12">
            <div className="container mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid md:grid-cols-2 gap-12 items-center"
                >
                    {/* Product Image Section */}
                    <div
                        className="relative group aspect-square bg-gray-900 rounded-3xl overflow-hidden border border-gray-800"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-transparent z-10" />

                        {/* Product Image */}
                        <img
                            src="/merch-tshirt.jpg"
                            alt="TEDxMMCOE Official T-Shirt"
                            className="absolute inset-0 w-full h-full object-cover"
                        />

                        {/* Overlay Content */}
                        <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent transition-transform duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}>
                            <p className="text-ted-red font-bold">Limited Edition</p>
                            <p className="text-sm text-gray-300">Premium cotton, unisex fit</p>
                        </div>
                    </div>

                    {/* Product Details Section */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
                                Official <span className="text-ted-red">Event Tee</span>
                            </h1>
                            <p className="text-xl text-gray-400">Wear the ideas you love.</p>
                        </div>

                        <div className="flex items-baseline space-x-4">
                            <span className="text-3xl font-bold">₹549</span>
                        </div>

                        {/* Size Selector */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="text-gray-300 font-medium">Select Size</label>
                            </div>
                            <div className="grid grid-cols-5 gap-3">
                                {SIZES.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`h-12 rounded-xl font-bold border transition-all duration-200 ${selectedSize === size
                                            ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                                            : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-500 hover:text-white'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Action Component */}
                        <button
                            disabled
                            className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-3 transition-all duration-300 bg-gray-800 text-gray-500 cursor-not-allowed"
                        >
                            <ShoppingBag className="w-6 h-6" />
                            <span>Sales Closed</span>
                        </button>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-800">
                            {[
                                'Premium Cotton',
                                'Unisex Fit',
                                'Durable Print',
                                'Comfortable'
                            ].map((feature) => (
                                <div key={feature} className="flex items-center space-x-2 text-sm text-gray-400">
                                    <Check className="w-4 h-4 text-ted-red" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Merchandise;
