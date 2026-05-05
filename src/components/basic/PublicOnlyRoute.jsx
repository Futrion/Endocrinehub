import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';

export function PublicOnlyRoute({ children }) {
    const { session } = useAuth();

    if (session === undefined) {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <CircularProgress />
            </div>
        );
    }

    if (session) {
        return <Navigate to="/" replace />;
    }

    return children;
}
