import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    token: string;
}

interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setCurrentUser(user);
            setIsAdmin(user.role === 'admin');
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL || '/api'}/auth/login`, {
            email,
            password
        });
        localStorage.setItem('userInfo', JSON.stringify(data));
        setCurrentUser(data);
        setIsAdmin(data.role === 'admin');
    };

    const signup = async (name: string, email: string, password: string) => {
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL || '/api'}/auth/register`, {
            name,
            email,
            password
        });
        localStorage.setItem('userInfo', JSON.stringify(data));
        setCurrentUser(data);
        setIsAdmin(data.role === 'admin');
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setCurrentUser(null);
        setIsAdmin(false);
    };

    const value = {
        currentUser,
        loading,
        isAdmin,
        login,
        signup,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
