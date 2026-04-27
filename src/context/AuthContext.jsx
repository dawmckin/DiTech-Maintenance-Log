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

            setUser(data?.session?.user ?? null);

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

        const {
        data: { subscription }
        } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);

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

        setUser(data.user);
        return {success: true};
    }

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
    }

    const updateAuthUser = async (userId, userData) => {
        // console.log(userId, userData)
        const {data, error} = await supabase.auth.admin.updateUserById(userId, userData);
        // const {data, error} = await supabase.auth.updateUser({
        //     data: {
        //         display_name: "Jhonny Test"
        //     }
        // });

        if(error) {
            console.log(error);
            return {success: false};
        }

        return {success: true, data};
    }

    const signUpUser = async (email, password, display_name, user_role) => {
        const {data, error} = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {display_name, user_role}
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