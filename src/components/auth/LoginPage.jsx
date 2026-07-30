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

    const { login, loginWithGoogle } = useAuth();
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

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            const result = await loginWithGoogle();
            if (!result.success) {
                setError(result.error || 'Google login failed');
                setLoading(false);
            }
        } catch (err) {
            setError(err.message || 'Google login execution error');
            setLoading(false);
        }
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

                            <button 
                                type="button" 
                                onClick={handleGoogleLogin} 
                                className="google-signin-btn" 
                                disabled={loading}
                            >
                                <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                                </svg>
                                Sign in with Google
                            </button>

                            <div className="demo-credentials-container">
                                <div className="demo-credentials-title">Demo Credentials</div>
                                <div className="demo-credentials-pills">
                                    <button 
                                        type="button" 
                                        className="demo-pill" 
                                        onClick={() => { setEmail('1'); setPassword('1'); }}
                                        title="Click to auto-fill Student credentials"
                                    >
                                        <span className="demo-code">1</span> Student
                                    </button>
                                    <button 
                                        type="button" 
                                        className="demo-pill" 
                                        onClick={() => { setEmail('2'); setPassword('2'); }}
                                        title="Click to auto-fill Teacher credentials"
                                    >
                                        <span className="demo-code">2</span> Teacher
                                    </button>
                                    <button 
                                        type="button" 
                                        className="demo-pill" 
                                        onClick={() => { setEmail('3'); setPassword('3'); }}
                                        title="Click to auto-fill Parent credentials"
                                    >
                                        <span className="demo-code">3</span> Parent
                                    </button>
                                    <button 
                                        type="button" 
                                        className="demo-pill" 
                                        onClick={() => { setEmail('admin'); setPassword('admin'); }}
                                        title="Click to auto-fill Admin credentials"
                                    >
                                        <span className="demo-code">admin</span> Admin
                                    </button>
                                </div>
                            </div>

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
