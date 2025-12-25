import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    teamRole?: string;
}

interface Registration {
    userId: string;
    transactionId: string;
    screenshotUrl: string;
    status: string;
    timestamp: any;
}

interface MergedUser extends User {
    registration?: Registration;
}

const AdminDashboard = () => {
    const [users, setUsers] = useState<MergedUser[]>([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth()!;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all users
                const usersSnap = await getDocs(collection(db, "users"));
                const usersMap = new Map<string, User>();
                usersSnap.forEach(doc => {
                    usersMap.set(doc.id, { id: doc.id, ...doc.data() } as User);
                });

                // Fetch all registrations
                const regsSnap = await getDocs(collection(db, "registrations"));
                const regsMap = new Map<string, Registration>();
                regsSnap.forEach(doc => {
                    const data = doc.data() as Registration;
                    regsMap.set(data.userId, data);
                });

                // Merge data
                const merged: MergedUser[] = [];
                usersMap.forEach((user) => {
                    merged.push({
                        ...user,
                        registration: regsMap.get(user.id)
                    });
                });

                setUsers(merged);
            } catch (error) {
                console.error("Error fetching admin data: ", error);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchData();
        }
    }, [currentUser]);



    if (loading) {
        return <div className="min-h-screen bg-ted-black flex items-center justify-center text-white">Loading Admin Data...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
            <div className="flex bg-white shadow-sm border-b border-gray-200">
                <div className="p-4 w-64 border-r border-gray-200 bg-gray-50">
                    <h1 className="text-xl font-bold text-ted-red">TEDx Admin</h1>
                </div>
                <div className="flex-1 p-4 flex justify-between items-center">
                    <h2 className="font-semibold text-lg">User Registry</h2>
                    <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-500 hover:text-black">
                        Back to App
                    </button>
                </div>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <div className="w-64 bg-white h-[calc(100vh-64px)] border-r border-gray-200 hidden md:block">
                    <nav className="p-4 space-y-1">
                        <button className="w-full text-left px-4 py-2 bg-red-50 text-ted-red font-medium rounded-md">
                            All Users
                        </button>
                        {/* Add more admin links here */}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8 overflow-auto h-[calc(100vh-64px)]">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4">User Details</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4">Payment Status</th>
                                        <th className="px-6 py-4">Transaction ID</th>
                                        <th className="px-6 py-4">Screenshot</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-semibold text-gray-900">{user.name}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                    {user.role} {user.teamRole ? `(${user.teamRole})` : ''}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.registration ? (
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                        ${user.registration.status === 'verified' ? 'bg-green-100 text-green-800' :
                                                            user.registration.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                                'bg-yellow-100 text-yellow-800'}`}>
                                                        {user.registration.status === 'pending' ? 'Paid (Pending)' : user.registration.status}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 italic">Not Registered</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-gray-600">
                                                {user.registration ? user.registration.transactionId : '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.registration ? (
                                                    <a
                                                        href={user.registration.screenshotUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-block"
                                                    >
                                                        <img
                                                            src={user.registration.screenshotUrl}
                                                            alt="Proof"
                                                            className="h-12 w-auto rounded border border-gray-200 hover:scale-150 transition-transform origin-left"
                                                        />
                                                    </a>
                                                ) : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                                No users found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
