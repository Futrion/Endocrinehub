import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';

export function ProtectedRoute({ children }) {
    const { session } = useAuth();
    const location = useLocation();

    // session === undefined means still loading
    if (session === undefined) {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <CircularProgress />
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}
