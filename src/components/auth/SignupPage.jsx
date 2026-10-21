'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { Lock, ArrowRight, GraduationCap, Users, Building2, Mail, Eye, EyeOff, User } from 'lucide-react';
import './SignupPage.css';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const router = useRouter();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("PROTOCOL ERROR: PASSWORDS DO NOT MATCH");
            return;
        }

        setLoading(true);
        // Mock signup logic
        setTimeout(() => {
            setLoading(false);
            router.push('/dashboard');
        }, 1500);
    };

    return (
        <div className="login-wrapper">
            <div className="login-dual-panel signup-mode" style={{ width: '1000px', height: '720px' }}>
                {/* Right Sidebar - Info Panel */}
                <div className="login-sidebar" style={{ background: '#000000', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '3rem' }}>
                    <div className="sidebar-logo" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 auto 2rem auto', textAlign: 'center' }}>
                        <img src="/logo.png" alt="Connect & Prep" style={{ width: '220px', height: 'auto', objectFit: 'contain' }} />
                    </div>

                    <div className="sidebar-content" style={{ textAlign: 'center', marginTop: '-1rem' }}>
                        <h2 className="system-title" style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', color: '#fff' }}>Join the Community</h2>
                        <p className="system-sub" style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '2.5rem' }}>Access shared resources, collaborate with fellow students, and build your engineering profile.</p>
                        
                        <div className="stats-row" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '2rem' }}>
                            <div className="stat-col" style={{ textAlign: 'center' }}>
                                <Users size={24} style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }} />
                                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff' }}>10K+</div>
                                <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', marginTop: '2px' }}>Students</div>
                            </div>
                            <div style={{ width: '1px', height: '40px', background: 'rgba(255, 255, 255, 0.1)' }}></div>
                            <div className="stat-col" style={{ textAlign: 'center' }}>
                                <GraduationCap size={24} style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }} />
                                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff' }}>500+</div>
                                <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', marginTop: '2px' }}>Faculty</div>
                            </div>
                            <div style={{ width: '1px', height: '40px', background: 'rgba(255, 255, 255, 0.1)' }}></div>
                            <div className="stat-col" style={{ textAlign: 'center' }}>
                                <Building2 size={24} style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }} />
                                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff' }}>50+</div>
                                <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', marginTop: '2px' }}>Institutions</div>
                            </div>
                        </div>
                    </div>

                    <div className="sidebar-illustration" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 'auto' }}>
                        <img src="/mockup.png" alt="Illustration" style={{ width: '100%', maxWidth: '280px', height: 'auto', objectFit: 'contain' }} />
                    </div>
                </div>

                {/* Left Panel - Form Area */}
                <div className="login-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3.5rem' }}>
                    <div className="form-container" style={{ width: '100%', maxWidth: '400px' }}>
                        <div className="sync-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                            <h1 style={{ fontSize: '2.2rem', fontWeight: '700', color: '#fff', marginBottom: '0.5rem' }}>Create Account</h1>
                            <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.5)', margin: 0 }}>Sign up to get started</p>
                            <div style={{ width: '32px', height: '3px', background: 'var(--accent-primary)', margin: '16px auto 0 auto', borderRadius: '2px' }}></div>
                        </div>

                        <form onSubmit={handleSignup} className="sync-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="input-group">
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem', textTransform: 'none', letterSpacing: 'normal' }}>Name</label>
                                <div className="input-field-wrap">
                                    <User size={18} className="field-icon" />
                                    <input
                                        type="text"
                                        placeholder="Your full name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem', textTransform: 'none', letterSpacing: 'normal' }}>Institutional Email</label>
                                <div className="input-field-wrap">
                                    <Mail size={18} className="field-icon" />
                                    <input
                                        type="email"
                                        placeholder="you@institution.edu"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem', textTransform: 'none', letterSpacing: 'normal' }}>Password</label>
                                <div className="input-field-wrap">
                                    <Lock size={18} className="field-icon" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ background: 'transparent', border: 'none', color: 'rgba(255, 255, 255, 0.4)', cursor: 'pointer', paddingRight: '12px', display: 'flex', alignItems: 'center' }}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="input-group">
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem', textTransform: 'none', letterSpacing: 'normal' }}>Confirm Password</label>
                                <div className="input-field-wrap">
                                    <Lock size={18} className="field-icon" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        style={{ background: 'transparent', border: 'none', color: 'rgba(255, 255, 255, 0.4)', cursor: 'pointer', paddingRight: '12px', display: 'flex', alignItems: 'center' }}
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {error && <div className="sync-error-msg">{error}</div>}

                            <button type="submit" className="establish-link-btn" disabled={loading} style={{ background: 'var(--accent-primary)', color: '#fff', fontWeight: '700', height: '52px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: 'none', cursor: 'pointer', fontSize: '1rem', marginTop: '0.5rem' }}>
                                {loading ? 'Registering...' : (
                                    <>
                                        Create Account <ArrowRight size={20} />
                                    </>
                                )}
                            </button>

                            <div className="form-alt-footer" style={{ marginTop: '1.5rem', fontSize: '0.85rem' }}>
                                <span>Already have an account?</span>
                                <Link href="/login" className="register-link">Sign In</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
