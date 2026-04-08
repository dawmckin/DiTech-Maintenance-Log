import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        //get current session
        const getSession = async () => {
            const { data } = await supabase.auth.getSession();
            setUser(data?.session?.user ?? null);
            setLoading(false);
        }

        getSession();

        //listen for auth changes
        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
            }
        );

        return () => {
            listener.subscription.unsubscribe(),
            user
        }
    }, []);

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({email, password});

        if (error) {
            return {success: false, error};
        }

        setUser(data.user);
        return {success: true};
    }

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
    }

    const updateAuthUser = async () => {
        await supabase.auth.updateUser({data: {display_name: "Dalton McKinney"}});
    }

    return (
        <AuthContext.Provider value={{user, loading, signIn, signOut, updateAuthUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext);

    if(!context) {
        throw new Error("useAuth must be within AuthProvider");
    }

    return context;
}