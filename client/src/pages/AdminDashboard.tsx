import { useEffect, useState } from 'react';
import { utils, writeFile } from 'xlsx';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Registration {
    id?: string;
    userId: string;
    name: string;
    email: string;
    institution?: string;
    transactionId: string;
    screenshotUrl: string;
    idCardUrl?: string; // New field for ID card image
    status: string;
    amount: number;
    timestamp: any;
}

interface MerchandiseOrder {
    id?: string;
    userId: string;
    name: string;
    email: string;
    size: string;
    transactionId: string;
    screenshotUrl: string;
    idCardUrl?: string; // New field for ID card image (optional)
    status: string;
    amount: number;
    timestamp: any;
}

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState<'registrations' | 'team' | 'merchandise'>('registrations');
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [merchandise, setMerchandise] = useState<MerchandiseOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { currentUser, isAdmin } = useAuth()!;
    const navigate = useNavigate();

    // Derived state for filtered registrations
    const individualRegistrations = registrations.filter((r: any) => r.ticketCategory !== 'team');
    const teamRegistrations = registrations.filter((r: any) => r.ticketCategory === 'team');

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (isAdmin && currentUser) {
                    const apiUrl = import.meta.env.VITE_API_URL || '/api';
                    const response = await fetch(`${apiUrl}/admin/registrations`, {
                        headers: {
                            'Authorization': `Bearer ${currentUser.token}`
                        }
                    });

                    if (response.status === 403 || response.status === 401) {
                        setError("Access Denied: You do not have admin permissions.");
                        setLoading(false);
                        return;
                    }

                    if (!response.ok) {
                        throw new Error(`Server returned ${response.status} ${response.statusText}`);
                    }

                    const data = await response.json();

                    // Simplify data handling, assuming data is the array
                    if (Array.isArray(data)) {
                        setRegistrations(data);
                        // Merchandise is mixed in or filtering logic needs update?
                        // Actually, my mongo implementation mixed them all in Registrations collection.
                        // I need to filter them here or in backend.
                        // In backend, I returned all.
                        // so registrations includes merchandise types too.
                        const merch = data.filter((r: any) => r.type === 'merchandise');
                        const regs = data.filter((r: any) => r.type !== 'merchandise');
                        setRegistrations(regs);
                        setMerchandise(merch);
                    } else {
                        setError("Failed to load data");
                    }
                } else if (currentUser) {
                    setError("Access Denied: Admin privileges required.");
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching admin data: ", error);
                setError("Failed to fetch data. Ensure server is running.");
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [currentUser, isAdmin]);

    if (loading) return <div className="min-h-screen bg-ted-black flex items-center justify-center text-white">Loading Admin Data...</div>;

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded shadow text-center">
                    <h2 className="text-red-600 font-bold text-xl mb-2">Error</h2>
                    <p className="text-gray-700">{error}</p>
                    <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-ted-red text-white rounded">Retry</button>
                    <button onClick={() => navigate('/')} className="mt-4 ml-4 px-4 py-2 text-gray-600 hover:text-black">Go Home</button>
                </div>
            </div>
        );
    }

    const StatusBadge = ({ status }: { status: string }) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
            ${status === 'verified' ? 'bg-green-100 text-green-800' :
                status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'}`}>
            {status === 'pending' ? 'Pending' : status}
        </span>
    );

    const ScreenshotThumb = ({ url, label }: { url: string, label: string }) => (
        <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity mr-2">
            <img src={url} alt={label} className="h-10 w-auto rounded border border-gray-200" />
            <span className='text-xs text-blue-600 underline'>{label}</span>
        </a>
    );

    const getDataToDisplay = () => {
        if (activeTab === 'registrations') return individualRegistrations;
        if (activeTab === 'team') return teamRegistrations;
        return merchandise;
    }

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 font-sans flex flex-col">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-ted-red">TEDx Admin</h1>
                            <span className="ml-4 px-3 py-1 bg-gray-100 text-xs font-mono rounded-full text-gray-600">
                                {isAdmin ? 'Root Access' : 'Read Only'}
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => {
                                    const dataToExport = getDataToDisplay();

                                    // Prepare data for Excel
                                    const excelData = dataToExport.map(item => {
                                        const dateObj = item.timestamp?.seconds ? new Date(item.timestamp.seconds * 1000) : null;

                                        const baseData: any = {
                                            'Status': item.status,
                                            'Name': item.name,
                                            'Email': item.email,
                                            'Amount': item.amount,
                                            'Transaction ID': item.transactionId,
                                            'Upload Date': dateObj ? dateObj.toLocaleDateString('en-IN') : 'N/A',
                                            'Upload Time': dateObj ? dateObj.toLocaleTimeString('en-IN') : 'N/A',
                                            'Proof URL': item.screenshotUrl,
                                            'ID Card URL': item.idCardUrl || 'N/A' // Added ID Card URL
                                        };

                                        if (activeTab === 'registrations') {
                                            baseData['Institution'] = (item as any).institution || 'N/A';
                                        } else if (activeTab === 'team') {
                                            baseData['Category'] = 'Team Pass';
                                        } else {
                                            baseData['Size'] = (item as MerchandiseOrder).size || 'N/A';
                                        }
                                        return baseData;
                                    });

                                    const ws = utils.json_to_sheet(excelData);
                                    const wb = utils.book_new();
                                    utils.book_append_sheet(wb, ws, activeTab === 'registrations' ? 'Individual' : (activeTab === 'team' ? 'Team' : 'Merchandise'));

                                    writeFile(wb, `${activeTab}_${new Date().toISOString().split('T')[0]}.xlsx`);
                                }}
                                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                                <span>Download Excel</span>
                            </button>
                            <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-600 hover:text-black font-medium">
                                Exit Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[600px] flex flex-col">
                    {/* Tabs */}
                    <div className="border-b border-gray-200 flex">
                        <button
                            onClick={() => setActiveTab('registrations')}
                            className={`px-8 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'registrations'
                                ? 'border-ted-red text-ted-red bg-red-50/50'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            Individual ({individualRegistrations.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('team')}
                            className={`px-8 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'team'
                                ? 'border-ted-red text-ted-red bg-red-50/50'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            Team ({teamRegistrations.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('merchandise')}
                            className={`px-8 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'merchandise'
                                ? 'border-ted-red text-ted-red bg-red-50/50'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            Merchandise ({merchandise.length})
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200 sticky top-0">
                                <tr>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Name / Email</th>
                                    <th className="px-6 py-4">Transaction Details</th>
                                    {activeTab === 'registrations' ? (
                                        <th className="px-6 py-4">Institution</th>
                                    ) : activeTab === 'team' ? (
                                        <th className="px-6 py-4">Type</th>
                                    ) : (
                                        <th className="px-6 py-4">Size</th>
                                    )}
                                    <th className="px-6 py-4">Proofs (Payment | ID)</th>
                                    <th className="px-6 py-4 text-right">Upload Date/Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {getDataToDisplay().map((item) => (
                                    <tr key={item.id || item.transactionId} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <StatusBadge status={item.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900">{item.name}</div>
                                            <div className="text-xs text-gray-500">{item.email}</div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-gray-600">
                                            <div>{item.transactionId}</div>
                                            <div className="text-xs text-gray-400">₹{item.amount}</div>
                                        </td>
                                        {activeTab === 'registrations' ? (
                                            <td className="px-6 py-4">
                                                {(item as Registration).institution}
                                            </td>
                                        ) : activeTab === 'team' ? (
                                            <td className="px-6 py-4 font-bold text-gray-500">
                                                Team Pass
                                            </td>
                                        ) : (
                                            <td className="px-6 py-4 font-bold">
                                                {(item as MerchandiseOrder).size}
                                            </td>
                                        )}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2">
                                                <ScreenshotThumb url={item.screenshotUrl} label="Payment" />
                                                {item.idCardUrl && <ScreenshotThumb url={item.idCardUrl} label="ID" />}
                                                {!item.idCardUrl && <span className="text-xs text-gray-400">No ID Card</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-xs">
                                            <div className="font-medium text-gray-900">
                                                {item.timestamp?.seconds ? new Date(item.timestamp.seconds * 1000).toLocaleDateString('en-IN') : 'N/A'}
                                            </div>
                                            <div className="text-gray-500">
                                                {item.timestamp?.seconds ? new Date(item.timestamp.seconds * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {getDataToDisplay().length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">
                                            No {activeTab} found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default AdminDashboard;
