import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

import ditechLogo from "./../../assets/ditech-logo.png";

export default function Header() {
    const { signOut } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();

        showToast("Logged out successfully.", "success");

        navigate('/login');
    };

    return (
        <div className="header">
            <div className="logo">
                <img src={ditechLogo} alt="DITECH Logo" />
                <span>Maintenance Log</span>
            </div>
            <nav>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/logs">Logs</Link>
                <Link to="#">Settings</Link>
                <Link onClick={handleLogout}>Logout</Link>

            </nav>
        </div>
    );
}