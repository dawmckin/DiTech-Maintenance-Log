import { useEffect } from "react";
import "./toast.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

function Toast({message, type = 'success', onClose}) {
    const icons = {
        "success": (<i class="bi-check-circle-fill"></i>)
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            console.log(message, type);
            console.log("Closing toast");
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [message, onClose]);

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

export default Toast;