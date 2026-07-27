'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Lock, ArrowRight, Mail, Eye, EyeOff } from 'lucide-react';
import './LoginPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth();
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            if (result.user?.role === 'parent') {
                router.push('/dashboard/parent-dashboard');
            } else {
                router.push('/dashboard');
            }
        } else {
            setError(result.error || 'Invalid credentials');
        }
        setLoading(false);
    };

    return (
        <div className="login-wrapper">
            <div className="login-dual-panel">
                {/* Left Sidebar - Branding & Info */}
                <div className="login-sidebar">
                    <div className="brand-logo-container">
                        <img src="/logo.png" alt="Connect & Prep" className="brand-logo-img" />
                        <div className="brand-subtext">Student • Teacher Connection</div>
                    </div>

                    <div className="sidebar-content">
                        <h1 className="engineering-portal-title">Engineering Portal</h1>
                        <div className="title-underline"></div>
                        <p className="portal-sub">
                            Learn. Collaborate. Grow.<br />
                            All in one place.
                        </p>
                    </div>

                </div>

                {/* Right Panel - Login Card */}
                <div className="login-main">
                    <div className="right-card-container">
                        <div className="welcome-heading-group">
                            <h2>Welcome Back</h2>
                            <p>Sign in to continue</p>
                            <div className="welcome-underline"></div>
                        </div>

                        <form onSubmit={handleLogin} className="login-fields-form">
                            <div className="input-group">
                                <label className="field-label">Institutional Email or ID</label>
                                <div className="field-input-box">
                                    <Mail size={18} className="input-icon-left" />
                                    <input
                                        type="text"
                                        name="email"
                                        placeholder="you@institution.edu or ID"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="field-label">Password</label>
                                <div className="field-input-box">
                                    <Lock size={18} className="input-icon-left" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="password-toggle-btn"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-options-row">
                                <label className="remember-me-checkbox">
                                    <input type="checkbox" />
                                    Remember Me
                                </label>
                                <span className="forgot-password-link">Forgot Password?</span>
                            </div>

                            {error && <div className="error-feedback-alert">{error}</div>}

                            <button type="submit" className="signin-action-btn" disabled={loading}>
                                {loading ? 'Logging in...' : (
                                    <>
                                        Sign In <ArrowRight size={20} />
                                    </>
                                )}
                            </button>

                            <div className="right-card-footer">
                                <div className="need-access-divider">
                                    <div className="divider-line"></div>
                                    <div className="divider-label">Need access?</div>
                                    <div className="divider-line"></div>
                                </div>

                                <div className="admin-contact-text">
                                    Contact your institution <span className="admin-highlight">administrator</span>.
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
