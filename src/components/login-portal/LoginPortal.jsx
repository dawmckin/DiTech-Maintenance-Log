import { useState } from 'react';
import "./login-portal.css";
import ditechLogo from "./../../assets/ditech-logo.png";

export default function LoginPortal() {
    const [form, setForm] = useState({
        user: "",
        pass: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("login attempt: ", form);
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
                        <label>Username</label>
                        <input 
                            type='text'
                            name='user'
                            value={form.user}
                            onChange={handleChange}
                            placeholder='Enter your username'
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