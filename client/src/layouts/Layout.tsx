import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
    const { currentUser } = useAuth() ?? {};
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: 'Home', path: '/' },
        ...(currentUser ? [
            { name: 'Event Details', path: '/event-details' },
            { name: 'Timeline', path: '/timeline' }
        ] : []),
        { name: 'Merchandise', path: '/merchandise' },
        { name: 'Speakers', path: '/speakers' },
        ...(currentUser?.email === 'tedxmmcoe@mmcoe.edu.in' ? [{ name: 'Admin', path: '/admin' }] : []),
        ...(!currentUser ? [{ name: 'Login', path: '/login', cta: true }] : []),
        { name: currentUser ? 'Dashboard' : 'Sold Out', path: currentUser ? '/dashboard' : '/register', cta: true },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen flex flex-col bg-ted-black text-white font-sans overflow-x-hidden">
            {/* Header */}
            <header className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold tracking-tighter">
                        <span className="text-ted-red">TEDx</span>
                        <span className="text-white">MMCOE</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-sm font-medium transition-colors hover:text-ted-red ${isActive(link.path) ? 'text-ted-red' : 'text-gray-300'
                                    } ${link.cta ? 'bg-ted-red text-white px-4 py-2 rounded-full hover:bg-red-700' : ''}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-black pt-20 px-4 md:hidden"
                    >
                        <div className="flex flex-col space-y-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`text-2xl font-bold ${isActive(link.path) ? 'text-ted-red' : 'text-gray-300'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-grow pt-24">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-black py-10 border-t border-white/10">
                <div className="container mx-auto px-4 text-center">
                    <div className="text-2xl font-bold tracking-tighter mb-4">
                        <span className="text-ted-red">TEDx</span>
                        <span className="text-white">MMCOE</span>
                    </div>
                    <p className="text-gray-500 text-sm mb-4">
                        This independent TEDx event is operated under license from TED.
                    </p>
                    <div className="flex justify-center space-x-6 text-sm text-gray-400">
                        <a href="mailto:tedxmmcoe@mmcoe.edu.in" className="hover:text-white">tedxmmcoe@mmcoe.edu.in</a>
                        <a href="https://www.instagram.com/tedxmmcoe/" target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a>
                    </div>
                    <p className="text-gray-600 text-xs mt-8">
                        © 2025 TEDxMMCOE. All Rights Reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
