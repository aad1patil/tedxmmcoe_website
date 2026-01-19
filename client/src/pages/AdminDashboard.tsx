import { useEffect, useState } from 'react';
import { utils, writeFile } from 'xlsx';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Registration {
    id?: string;
    _id?: string;
    userId: string;
    name: string;
    email: string;
    institution?: string;
    transactionId: string;
    screenshotPath: string;  // Path to uploaded file
    idCardPath?: string;     // Path to ID card image
    status: string;
    amount: number;
    createdAt?: any;
    timestamp?: any;
}

interface MerchandiseOrder {
    id?: string;
    _id?: string;
    userId: string;
    name: string;
    email: string;
    size: string;
    transactionId: string;
    screenshotPath: string;  // Path to uploaded file
    idCardPath?: string;     // Path to ID card image
    status: string;
    amount: number;
    createdAt?: any;
    timestamp?: any;
}

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState<'registrations' | 'team' | 'merchandise'>('registrations');
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [merchandise, setMerchandise] = useState<MerchandiseOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null); // For image modal

    const { currentUser, isAdmin } = useAuth()!;
    const navigate = useNavigate();

    // Derived state for filtered registrations
    const individualRegistrations = registrations.filter((r: any) => r.ticketCategory !== 'team');
    const teamRegistrations = registrations.filter((r: any) => r.ticketCategory === 'team');

    // Registration capacity tracking
    const MAX_CAPACITY = 160;
    const totalRegistrations = registrations.filter((r: any) => r.type !== 'merchandise').length;
    const capacityPercentage = Math.round((totalRegistrations / MAX_CAPACITY) * 100);

    // Warning thresholds
    const getCapacityWarning = () => {
        if (totalRegistrations >= MAX_CAPACITY) return { level: 'full', message: '🚫 Registrations are FULL (160/160)', color: 'bg-red-600' };
        if (totalRegistrations >= 130) return { level: 'critical', message: `⚠️ Critical: Only ${MAX_CAPACITY - totalRegistrations} spots left! (${totalRegistrations}/160)`, color: 'bg-red-500' };
        if (totalRegistrations >= 110) return { level: 'high', message: `⚠️ High demand: ${MAX_CAPACITY - totalRegistrations} spots remaining (${totalRegistrations}/160)`, color: 'bg-orange-500' };
        if (totalRegistrations >= 100) return { level: 'warning', message: `📢 100+ registrations! ${MAX_CAPACITY - totalRegistrations} spots left (${totalRegistrations}/160)`, color: 'bg-yellow-500' };
        return null;
    };
    const capacityWarning = getCapacityWarning();

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

    // Handler to update registration status
    const handleStatusChange = async (registrationId: string, newStatus: string) => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || '/api';
            const response = await fetch(`${apiUrl}/admin/registrations/${registrationId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser?.token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            // Update local state
            const updatedReg = await response.json();
            setRegistrations(prev => prev.map(r =>
                (r._id === registrationId || r.id === registrationId) ? { ...r, status: updatedReg.status } : r
            ));
            setMerchandise(prev => prev.map(m =>
                (m._id === registrationId || m.id === registrationId) ? { ...m, status: updatedReg.status } : m
            ));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };



    const StatusDropdown = ({ id, status }: { id: string, status: string }) => (
        <select
            value={status}
            onChange={(e) => handleStatusChange(id, e.target.value)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize cursor-pointer border-0 outline-none
                ${status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'}`}
        >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="rejected">Rejected</option>
        </select>
    );

    const ScreenshotThumb = ({ url, label }: { url: string, label: string }) => {
        const [imgError, setImgError] = useState(false);

        if (!url || imgError) {
            return (
                <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    No {label}
                </span>
            );
        }

        return (
            <button
                onClick={() => setSelectedImage(url)}
                className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity mr-2 cursor-pointer border-0 bg-transparent p-0"
                title={`Click to view ${label}`}
            >
                <img
                    src={url}
                    alt={label}
                    className="h-10 w-auto rounded border border-gray-200 object-cover"
                    onError={() => setImgError(true)}
                />
                <span className='text-xs text-blue-600 underline'>{label}</span>
            </button>
        );
    };

    // Image Modal Component
    const ImageModal = () => {
        if (!selectedImage) return null;

        return (
            <div
                className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedImage(null)}
            >
                <div className="relative max-w-4xl max-h-[90vh] w-full">
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute -top-12 right-0 text-white text-lg font-bold hover:text-gray-300 flex items-center gap-2"
                    >
                        <span>Close</span>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <img
                        src={selectedImage}
                        alt="Full size preview"
                        className="max-w-full max-h-[85vh] mx-auto rounded-lg shadow-2xl object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <a
                        href={selectedImage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-white text-sm underline hover:text-gray-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        Open in new tab ↗
                    </a>
                </div>
            </div>
        );
    };

    const getDataToDisplay = () => {
        if (activeTab === 'registrations') return individualRegistrations;
        if (activeTab === 'team') return teamRegistrations;
        return merchandise;
    }

    return (
        <>
            <ImageModal />
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
                                            const dateObj = item.createdAt ? new Date(item.createdAt) : (item.timestamp?.seconds ? new Date(item.timestamp.seconds * 1000) : null);

                                            const baseData: any = {
                                                'Status': item.status,
                                                'Name': item.name,
                                                'Email': item.email,
                                                'Amount': item.amount,
                                                'Transaction ID': item.transactionId,
                                                'Upload Date': dateObj ? dateObj.toLocaleDateString('en-IN') : 'N/A',
                                                'Upload Time': dateObj ? dateObj.toLocaleTimeString('en-IN') : 'N/A',
                                                'Proof URL': item.screenshotPath ? `/${item.screenshotPath}` : 'N/A',
                                                'ID Card URL': item.idCardPath ? `/${item.idCardPath}` : 'N/A'
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
                    {/* Capacity Warning Banner */}
                    {capacityWarning && (
                        <div className={`${capacityWarning.color} text-white px-4 py-3 rounded-lg mb-4 flex items-center justify-between shadow-lg`}>
                            <span className="font-semibold">{capacityWarning.message}</span>
                        </div>
                    )}

                    {/* Capacity Counter */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-700">Registration Capacity</span>
                            <span className="text-lg font-bold text-ted-red">{totalRegistrations} / {MAX_CAPACITY}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className={`h-3 rounded-full transition-all duration-500 ${capacityPercentage >= 100 ? 'bg-red-600' :
                                    capacityPercentage >= 80 ? 'bg-orange-500' :
                                        capacityPercentage >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}
                                style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Individual: {individualRegistrations.length} | Team: {teamRegistrations.length}</span>
                            <span>{MAX_CAPACITY - totalRegistrations} spots remaining</span>
                        </div>
                    </div>

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
                                        <th className="px-6 py-4">Upload Date/Time</th>

                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {getDataToDisplay().map((item) => (
                                        <tr key={item.id || item.transactionId} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <StatusDropdown id={item._id || item.id || ''} status={item.status} />
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
                                                    <ScreenshotThumb url={item.screenshotPath ? `/${item.screenshotPath}` : ''} label="Payment" />
                                                    {item.idCardPath && <ScreenshotThumb url={`/${item.idCardPath}`} label="ID" />}
                                                    {!item.idCardPath && <span className="text-xs text-gray-400">No ID Card</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right text-xs">
                                                <div className="font-medium text-gray-900">
                                                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN') : (item.timestamp?.seconds ? new Date(item.timestamp.seconds * 1000).toLocaleDateString('en-IN') : 'N/A')}
                                                </div>
                                                <div className="text-gray-500">
                                                    {item.createdAt ? new Date(item.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : (item.timestamp?.seconds ? new Date(item.timestamp.seconds * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '')}
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
            </div>
        </>
    );
};

export default AdminDashboard;
