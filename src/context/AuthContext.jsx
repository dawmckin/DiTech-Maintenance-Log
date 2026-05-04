import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRecoveryMode, setIsRecoveryMode] = useState(false);

    useEffect(() => {
        const init = async () => {
            const { data } = await supabase.auth.getSession();

            const sessionUser = data?.session?.user ?? null;

            if(sessionUser?.user_metadata?.status === 'disabled') {
                await supabase.auth.signOut();
                setUser(null);
            } else {
                setUser(sessionUser);
            }

            const onResetPage =
                window.location.pathname === "/reset-password";

            const hasRecoveryToken =
                window.location.hash.includes("access_token") ||
                window.location.hash.includes("type=recovery");

            if (onResetPage && (hasRecoveryToken || data.session)) {
                setIsRecoveryMode(true);
            }

            setLoading(false);
        };

        init();

        const {data: { subscription }} = supabase.auth.onAuthStateChange(async (event, session) => {
            const sessionUser = session?.user ?? null;

            if(sessionUser?.user_metadata?.status === 'disabled') {
                await supabase.auth.signOut();
                setUser(null);
                return;
            }

            setUser(sessionUser);

            if (event === "PASSWORD_RECOVERY") {
                setIsRecoveryMode(true);
            }

            if (event === "SIGNED_OUT") {
                setIsRecoveryMode(false);
            }

            if (event === "SIGNED_IN") {
                if (window.location.pathname !== "/reset-password") {
                    setIsRecoveryMode(false);
                }
            }

            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({email, password});

        if (error) {
            return {success: false, error};
        }

        if(data?.user?.user_metadata?.status === 'disabled') {
            await supabase.auth.signOut();
            return {success: false, error: {message: 'User is disabled.'}};
        }

        setUser(data.user);
        return {success: true};
    }

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
    }

    const updateAuthUser = async (userId, userData) => {
        const session = await supabase.auth.getSession();

        const res = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-update-user`,
            {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${session.data.session.access_token}`
                },
                body: JSON.stringify({user_id: userId, ...userData})
            }
        );

        const result = await res.json();

        if(!res.ok) {
            return {success: false, error: result.error}
        }

        return {success: true, data: result.data}
    }

    const signUpUser = async (email, password, display_name, user_role) => {
        const {data, error} = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {display_name, user_role, status: 'active'}
            }
        });

        if(error) {
            console.log(error);
            return {success: false};
        }

        return {success: true, data};
    }

    const resetPassword = async (email) => {
        const {error} = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`        
        });

        if(error) {
            return {success: false, error}
        }

        return {success: true}
    }

    return (
        <AuthContext.Provider value={{user, loading, signIn, signOut, updateAuthUser, signUpUser, resetPassword, isRecoveryMode}}>
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