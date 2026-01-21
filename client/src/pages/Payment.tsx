import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';
import axios from 'axios';

const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useAuth()!;
    // Get state from navigation (default to ticket if not present)
    const { type = 'ticket', size = '' } = location.state || {};

    // State
    const [transactionId, setTransactionId] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [idCardFile, setIdCardFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [institution, setInstitution] = useState('MMCOE');
    const [passOption, setPassOption] = useState<'Lunch + Goodies' | 'Lunch Only'>('Lunch + Goodies');
    const [ticketCategory, setTicketCategory] = useState<'individual' | 'team'>((location.state?.type === 'team') ? 'team' : 'individual');

    // Handle initial state from location or localStorage
    useState(() => {
        const saved = localStorage.getItem('pendingReg');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.institution) setInstitution(parsed.institution);
                if (parsed.passOption) setPassOption(parsed.passOption);
            } catch (e) {
                console.error("Failed to parse pendingReg", e);
            }
        }
    });

    // Calculate amount based on type/category/institution
    let amount = 0;
    if (type === 'merchandise') {
        amount = location.state?.amount || 0;
    } else if (ticketCategory === 'team') {
        amount = 300;
    } else {
        // Individual Ticket
        if (institution === 'MMCOE') {
            amount = passOption === 'Lunch + Goodies' ? 500 : 300;
        } else {
            amount = 800;
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleIdCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setIdCardFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isTicket = type !== 'merchandise';
        if (!file || !transactionId || (isTicket && !idCardFile)) {
            alert(`Please provide Transaction ID, Payment Screenshot${isTicket ? ', and ID Card' : ''}.`);
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('transactionId', transactionId);
            formData.append('amount', amount.toString());
            formData.append('type', type);
            if (type === 'merchandise') {
                formData.append('size', size);
            } else {
                formData.append('ticketCategory', ticketCategory);
                formData.append('institution', ticketCategory === 'individual' ? institution : 'N/A');
                if (institution === 'MMCOE' && ticketCategory === 'individual') {
                    formData.append('passOption', passOption);
                }
            }
            formData.append('screenshot', file);
            if (idCardFile) {
                formData.append('idCard', idCardFile);
            }

            const apiUrl = import.meta.env.VITE_API_URL || '/api';

            await axios.post(`${apiUrl}/registrations`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${currentUser?.token}`
                }
            });

            localStorage.removeItem('pendingReg');
            console.log("Payment Saved to DB");
            // Redirect to Dashboard with success message
            navigate('/dashboard', {
                state: {
                    successMessage: 'Payment submitted successfully! We will verify it shortly.'
                }
            });

        } catch (error: any) {
            console.error("Payment upload failed:", error);
            // Show exact error to user for debugging
            alert(`Failed to upload payment: ${error.response?.data?.message || error.message}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-ted-black text-white pt-24 px-4 pb-12">
            <div className="container mx-auto max-w-2xl">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Dashboard
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-900 rounded-2xl p-8 border border-gray-800"
                >
                    <h1 className="text-3xl font-bold mb-2 text-center">Complete Payment</h1>
                    <p className="text-gray-400 text-center mb-8">
                        {type === 'merchandise' ? `Official T-Shirt (${size})` : (ticketCategory === 'team' ? 'Team Pass' : 'Event Ticket')}
                    </p>

                    {type !== 'merchandise' && (
                        <div className="mb-8 p-4 bg-black rounded-xl border border-gray-800">
                            <div className="flex gap-4 mb-4">
                                <button
                                    type="button"
                                    onClick={() => setTicketCategory('individual')}
                                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${ticketCategory === 'individual' ? 'bg-ted-red text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                                >
                                    Individual
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTicketCategory('team')}
                                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${ticketCategory === 'team' ? 'bg-ted-red text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                                >
                                    Team
                                </button>
                            </div>

                            {ticketCategory === 'individual' && (
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Select Institution</label>
                                    <select
                                        value={institution}
                                        onChange={(e) => setInstitution(e.target.value)}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:border-ted-red focus:outline-none transition-colors"
                                    >
                                        <option value="MMCOE">MMCOE (Student/Faculty)</option>
                                        <option value="Other">Community Pass / External</option>
                                    </select>
                                    <p className="text-xs text-gray-500 mt-2">
                                        * MMCOE ID will be verified at the venue.
                                    </p>

                                    {institution === 'MMCOE' && (
                                        <div className="mt-4">
                                            <label className="block text-sm text-gray-400 mb-2">Select Pass Option</label>
                                            <select
                                                value={passOption}
                                                onChange={(e) => setPassOption(e.target.value as any)}
                                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:border-ted-red focus:outline-none transition-colors"
                                            >
                                                <option value="Lunch + Goodies">₹500 (Lunch + Goodies)</option>
                                                <option value="Lunch Only">₹300 (Lunch Only)</option>
                                            </select>
                                        </div>
                                    )}
                                </div>
                            )}

                            {ticketCategory === 'team' && (
                                <div className="text-center text-sm text-gray-400">
                                    <p>TEDxMMCOE team members registration</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* QR Code Section */}
                    <div className="bg-white p-6 rounded-xl w-full max-w-sm mx-auto mb-8 text-center">
                        <img
                            src="/upi-qr.jpg"
                            alt="Payment QR Code"
                            className="w-full h-auto mx-auto mb-4"
                        />
                        <p className="text-black font-bold text-lg">UPI ID: tedxmmcoe@upi</p>
                        <p className="text-gray-500 text-sm mt-2">Scan to pay ₹{amount}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Transaction ID (UTR)</label>
                            <input
                                type="text"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                placeholder="Enter 12-digit UPI reference ID"
                                className="w-full bg-black border border-gray-700 rounded-lg p-3 focus:border-ted-red focus:outline-none transition-colors"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Payment Screenshot</label>
                            <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-ted-red transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    required
                                />
                                <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                                {file ? (
                                    <p className="text-ted-red font-medium">{file.name}</p>
                                ) : (
                                    <p className="text-gray-500 text-sm">Click to upload screenshot (JPG/PNG)</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">
                                College ID Card {type === 'merchandise' && <span className="text-gray-600 font-normal italic">(Optional)</span>}
                            </label>
                            <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-ted-red transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleIdCardChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                                {idCardFile ? (
                                    <p className="text-ted-red font-medium">{idCardFile.name}</p>
                                ) : (
                                    <p className="text-gray-500 text-sm">Click to upload ID Card {type !== 'merchandise' && '(Required for Students)'}</p>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={uploading}
                            className={`w-full bg-ted-red text-white font-bold py-4 rounded-lg hover:bg-red-700 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {uploading ? 'Uploading...' : `Pay ₹${amount} & Submit`}
                        </button>

                        <p className="text-center text-sm text-gray-400 mt-4">
                            For any upload/payment related issues, contact <span className="text-white font-medium">Aadi Patil - 9834925993</span>
                        </p>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Payment;
