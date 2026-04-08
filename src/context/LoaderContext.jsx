import { createContext, useContext, useState } from "react";

const LoaderContext = createContext();

export function LoaderProvider({children}) {
    const [loading, setLoading] = useState(false);

    let timeout;

    const showLoader = () => {
        timeout = setTimeout(() => setLoading(true));
    }
    const hideLoader = () => {
        clearTimeout(timeout);
        setLoading(false);
    }

    return (
        <LoaderContext.Provider value={{ loading, showLoader, hideLoader }}>
            {children}
        </LoaderContext.Provider>
    );
}

export function useLoader() {
    return useContext(LoaderContext);
}