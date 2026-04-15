import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

import ditechLogo from "./../../assets/ditech-logo.png";

export default function Header() {
    const isAdmin = useAuth().user.user_metadata.user_role === 'admin';
    const { signOut } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();

        showToast("Logged out successfully.", "success");

        navigate('/');
    };

    return (
        <div className="header">
            <div className="logo">
                <img src={ditechLogo} alt="DITECH Logo" />
                <span>Maintenance Log</span>
                {
                    isAdmin ? (
                        <span className='role-indicator ml-2 px-2 py-1 text-center'>Admin</span>
                    ) : (
                        <span></span>
                    )
                }
            </div>
            <nav>
                <Link to="/dashboard">Dashboard</Link>
                {
                    isAdmin ? (
                        <>
                            <Link to="/logs">Logs</Link>
                            <Link to="/settings">Settings</Link>
                        </>
                    ) : (
                        <></>
                    )
                }
                <Link onClick={handleLogout}>Logout</Link>
            </nav>
        </div>
    );
}