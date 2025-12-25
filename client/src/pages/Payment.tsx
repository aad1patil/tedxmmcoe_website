import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { storage, db } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';

const Payment = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth()!;
    const [transactionId, setTransactionId] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !transactionId) return;

        setUploading(true);
        try {
            // Upload screenshot
            const fileRef = ref(storage, `payments/${currentUser?.uid}/${Date.now()}_${file.name}`);
            await uploadBytes(fileRef, file);
            const downloadURL = await getDownloadURL(fileRef);

            // Save to Firestore
            await addDoc(collection(db, "registrations"), {
                userId: currentUser?.uid,
                name: currentUser?.displayName || 'Unknown', // Fallback if name not in profile yet
                email: currentUser?.email,
                transactionId: transactionId,
                screenshotUrl: downloadURL,
                status: 'pending',
                timestamp: new Date()
            });

            console.log("Payment Saved to DB");
            navigate('/success');

        } catch (error) {
            console.error("Payment upload failed:", error);
            alert("Failed to upload payment details. Please try again.");
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
                    <h1 className="text-3xl font-bold mb-8 text-center">Complete Payment</h1>

                    {/* QR Code Section */}
                    <div className="bg-white p-6 rounded-xl w-full max-w-sm mx-auto mb-8 text-center">
                        {/* TODO: Replace with actual Payment QR Code Image */}
                        <img
                            src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=example@upi&pn=TEDxMMCOE&mc=0000&tid=1234567890&tr=1234567890&tn=TEDxMMCOE%20Ticket&am=499&cu=INR"
                            alt="Payment QR Code"
                            className="w-48 h-48 mx-auto mb-4"
                        />
                        {/* TODO: Replace with actual UPI ID */}
                        <p className="text-black font-bold text-lg">UPI ID: tedxmmcoe@upi</p>
                        <p className="text-gray-500 text-sm mt-2">Scan to pay ₹499</p>
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

                        <button
                            type="submit"
                            disabled={uploading}
                            className={`w-full bg-ted-red text-white font-bold py-4 rounded-lg hover:bg-red-700 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {uploading ? 'Uploading...' : 'Submit Payment Details'}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Payment;
