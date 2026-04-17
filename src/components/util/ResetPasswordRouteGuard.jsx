import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ResetPasswordGuard() {
    const { isRecoveryMode, loading } = useAuth();

    if(loading) return <div />;

    if(!isRecoveryMode) {
        return <Navigate to="/" replace/>
    }

    return <Outlet />
}