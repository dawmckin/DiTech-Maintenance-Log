import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedLayout() {
    const { user, loading, isRecoveryMode } = useAuth();

    if (loading) return null;

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (isRecoveryMode) {
        return <Navigate to="/reset-password" replace />;
    }

    return <Outlet />;
}