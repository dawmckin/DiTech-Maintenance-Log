import { useEffect } from "react";
import "./toast.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function ToastItem({message, type = 'success', onClose}) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`toast toast-${type}`}>
            <div>
                {type === "success" && <i className="bi bi-check-circle-fill"></i>}
                {type === "warning" && <i className="bi bi-exclamation-triangle-fill"></i>}
                {type === "error" && <i className="bi bi-x-circle-fill"></i>}
                <span>{message}</span>
            </div>

        </div>
    );
}