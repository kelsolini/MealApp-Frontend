import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function RequireAuth() {
    const { user, loading } = useAuth();

    if (loading) return null; // evt. en spinner
    if (!user) return <Navigate to="/login" replace />;
    return <Outlet />;
}