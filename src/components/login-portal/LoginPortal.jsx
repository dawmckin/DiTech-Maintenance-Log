import { useState } from 'react';

import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

import "./login-portal.css";
import ditechLogo from "./../../assets/ditech-logo.png";

export default function LoginPortal() {
    const [form, setForm] = useState({
        email: "",
        pass: ""
    });

    const { signIn } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("login attempt: ", form);

        setLoading(true);
        setError("");

        const result = await signIn(form.email, form.pass);

        if(result.success) {
            showToast("Login Successful.", "success");
            navigate('/dashboard');
        } else {
            setError(result.error);
            showToast("Invalid Credentials.", "error");
        }

        setLoading(false);
    }

    return (
        <div className='login-portal'>
            <div className='login-card'>
                <div className='logo'>
                    <img src={ditechLogo} alt="DITECH Logo" />
                    <h3 className='my-auto'>Maintenance Portal</h3>
                </div>

                <hr />

                <h4>Welcome Back</h4>
                <p className='login-subtitle'>Sign In</p>

                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label>Email</label>
                        <input 
                            type='email'
                            name='email'
                            value={form.email}
                            onChange={handleChange}
                            placeholder='Enter your email'
                            required
                        />
                    </div>

                    <div className='form-group'>
                        <label>Password</label>
                        <div className='password-input'>
                            <input 
                                type={showPassword ? 'text' : 'password'}
                                name='pass'
                                value={form.pass}
                                onChange={handleChange}
                                placeholder='Enter your password'
                                required
                            />
                            <span 
                                className='toggle-password' 
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </span>
                        </div>
                    </div>

                    <button type='submit' className='login-btn primary'>Sign In</button>
                </form>
            </div>
        </div>
    )
}