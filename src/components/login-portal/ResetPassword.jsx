import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

import "./reset-password.css";
import ditechLogo from "../../assets/ditech-logo.png";

export default function ResetPassword() {
    const navigate = useNavigate();
    const { signOut } = useAuth();
    const { showToast } = useToast();

    const [form, setForm] = useState({
        password: "",
        confirmPassword: ""
    });

    const [sessionReady, setSessionReady] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const initRecovery = async () => {
            const hash = window.location.hash;

            if(hash.includes("access_token")) {
                const {error} = await supabase.auth.exchangeCodeForSession(window.location.href);

                if(!error) {
                    setSessionReady(true);
                }
            } else {
                const { data } = await supabase.auth.getSession();
                
                if(data.session) {
                    setSessionReady(true);
                }
            }
        }

        initRecovery();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!sessionReady) {
            showToast("Recovery session not ready, please wait.", "warning");
            return;
        }

        if(form.password !== form.confirmPassword) {
            showToast("Passwords do not match.", "error");
            return;
        }

        if(form.password.length < 6) {
            showToast("Password must be at least 6 characters.", "error");
            return;
        }

        setLoading(true);

        const {error} = await supabase.auth.updateUser({
            password: form.password
        })

        if(error) {
            console.log(error);

            showToast("Unable to reset password.", "error");
        } else {
            showToast("Password updated successfully", "success");
            setTimeout(async () => {
                await signOut();
                navigate("/");
            }, 1200);
        }

        setLoading(false);
    };

    return (
        <div className="reset-page">
            <div className="reset-card">
                <div className="reset-logo">
                    <img src={ditechLogo} alt="Logo"/>
                    <h3>Maintenance Portal</h3>
                </div>

                <hr />

                <h2>Reset Password</h2>
                <p className="reset-subtitle"></p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>New Password</label>
                        <div className="password-input">
                            <input 
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                            <span className="toggle-password"
                                onClick={() => {
                                    setShowPassword(prev => !prev);
                                }}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input 
                            type={showPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="primary reset-btn"
                        disabled={loading || !sessionReady}
                    >
                        {!sessionReady ?
                            "Loading" :
                            loading ?
                                "Resetting..." :
                                "Reset Password"
                        }
                    </button>
                </form>
            </div>
        </div>
    )
}