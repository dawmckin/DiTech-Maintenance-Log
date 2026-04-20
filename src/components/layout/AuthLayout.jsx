import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AuthLayout() {
    const { user, loading, isRecoveryMode } = useAuth();

    if(loading) return null;

    if(user && !isRecoveryMode) {
        return <Navigate to="/dashboard" replace/>
    }

    return (
        <div className="login-layout">
            <Outlet />
        </div>
    )
}