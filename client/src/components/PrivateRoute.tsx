import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
    children: JSX.Element;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const auth = useAuth();

    if (!auth) return null; // Should not happen if wrapped in AuthProvider

    if (!auth.currentUser && !auth.isAdmin) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default PrivateRoute;
