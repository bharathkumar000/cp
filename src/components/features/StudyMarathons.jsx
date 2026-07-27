"use client";
import React, { useState } from 'react';
import { mockBackend } from '../../services/mockBackend';
import { useAuth } from '../../context/AuthContext';
import { Timer, MapPin, Plus, CheckCircle, PlayCircle, Trophy } from 'lucide-react';
import './FeatureStyles.css';

const StudyMarathons = () => {
    const { user } = useAuth();
    const { marathons } = mockBackend;
    const [showHostForm, setShowHostForm] = useState(false);
    const [takingTest, setTakingTest] = useState(null); // ID of marathon
    const [testScore, setTestScore] = useState(null);

    const handleCreate = (e) => {
        e.preventDefault();
        alert("Marathon Session Created!");
        setShowHostForm(false);
    };

    const handleTakeTest = (id) => {
        setTakingTest(id);
        // Simulate Score Generation
        setTimeout(() => {
            const score = Math.floor(Math.random() * (100 - 60 + 1)) + 60;
            setTestScore(score);
        }, 2000);
    };

    return (
        <div className="feature-container">
            {showHostForm && (
                <div className="card" style={{ marginBottom: '2rem', borderColor: 'rgba(245, 158, 11, 0.2)' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '1.25rem' }}>Host Study Marathon</h3>
                    <form onSubmit={handleCreate} className="grid-container" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <input placeholder="Topic (e.g. 12hr Calculus)" className="filter-select" style={{ cursor: 'text' }} required />
                        <input placeholder="Venue" className="filter-select" style={{ cursor: 'text' }} required />
                        <input placeholder="Duration" className="filter-select" style={{ cursor: 'text' }} required />
                        <input type="date" className="filter-select" style={{ cursor: 'text' }} required />
                        <button type="submit" className="login-btn" style={{ gridColumn: 'span 2' }}>Broadcast</button>
                    </form>
                </div>
            )}

            {/* Test Result Modal Simulation */}
            {testScore !== null && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: '90%', maxWidth: '400px', textAlign: 'center', borderColor: 'rgba(16, 185, 129, 0.3)', padding: '2rem' }}>
                        <Trophy size={64} color="#fbbf24" style={{ margin: '0 auto 1.25rem' }} />
                        <h2 style={{ marginTop: 0, color: '#ffffff' }}>Marathon Completed!</h2>
                        <p style={{ color: '#94a3b8' }}>You scored</p>
                        <h1 style={{ fontSize: '4.5rem', color: '#34d399', margin: '0.5rem 0', fontWeight: 800 }}>{testScore}%</h1>
                        <p style={{ color: '#94a3b8' }}>in the post-session assessment.</p>
                        <button className="login-btn" style={{ marginTop: '1.5rem', width: '100%' }} onClick={() => { setTestScore(null); setTakingTest(null); }}>Close & Save to Results</button>
                    </div>
                </div>
            )}

            <div className="grid-container">
                {marathons.map((m) => (
                    <div key={m.id} className="card" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#ffffff' }}>{m.topic}</h3>
                                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Hosted by {m.host}</span>
                            </div>
                            <span style={{
                                background: m.status === 'Upcoming' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                color: m.status === 'Upcoming' ? '#818cf8' : '#34d399',
                                padding: '4px 10px',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                border: m.status === 'Upcoming' ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid rgba(16, 185, 129, 0.2)'
                            }}>
                                {m.status}
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '0.5rem', fontWeight: '500' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Timer size={16} color="#6366f1" /> <span>{m.duration}</span></div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><MapPin size={16} color="#6366f1" /> <span>{m.venue}</span></div>
                        </div>

                        {m.status === 'Upcoming' ? (
                            <button className="login-btn" style={{ marginTop: 'auto', width: '100%' }}>Register Now</button>
                        ) : (
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: 'auto' }}>
                                <button
                                    className="login-btn"
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flex: 1 }}
                                    onClick={() => handleTakeTest(m.id)}
                                    disabled={!!m.userScore}
                                >
                                    {takingTest === m.id ? (
                                        'Generating Test...'
                                    ) : m.userScore ? (
                                        <>Score: {m.userScore}%</>
                                    ) : (
                                        <><PlayCircle size={18} /> Take Unit Test</>
                                    )}
                                </button>
                                {m.userScore && <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>Added to Analysis</span>}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudyMarathons;
