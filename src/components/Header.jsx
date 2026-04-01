import { Link } from "react-router-dom";
import ditechLogo from "./../assets/ditech-logo.png"

export default function Header() {
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
                <Link to="#">Logout</Link>

            </nav>
        </div>
    );
}