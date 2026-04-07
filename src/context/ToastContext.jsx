import { createContext, useContext, useState } from "react";
import ToastItem from "../components/toast/ToastItem";

const ToastContext = createContext();

export function ToastProvider({children}) {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = "success") => {
        const id = Date.now();

        setToasts((prev) => [...prev, {id, message, type}]);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }

    return (
        <ToastContext.Provider value={{showToast}}>
            {children}

            <div className="toast-container">
                {toasts.map((toast) => (
                    <ToastItem
                        key={toast.id}
                        {...toast}   
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    return useContext(ToastContext);
}