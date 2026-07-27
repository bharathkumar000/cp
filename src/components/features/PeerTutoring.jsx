"use client";
import React, { useState } from 'react';
import { mockBackend } from '../../services/mockBackend';
import { useAuth } from '../../context/AuthContext';
import { UserCheck, Calendar, Clock, MapPin, CheckSquare } from 'lucide-react';
import './FeatureStyles.css';

const PeerTutoring = () => {
    const { user } = useAuth();
    const { p2pSchedule } = mockBackend;
    const [showAssignForm, setShowAssignForm] = useState(false);

    return (
        <div className="feature-container">
            {showAssignForm && (
                <div className="card" style={{ marginBottom: '2rem', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '1.25rem' }}>Assign Student Tutor</h3>
                    <form className="grid-container" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <input placeholder="Student Name / ID" className="filter-select" style={{ cursor: 'text' }} />
                        <input placeholder="Topic to Teach" className="filter-select" style={{ cursor: 'text' }} />
                        <input type="datetime-local" className="filter-select" style={{ cursor: 'text' }} />
                        <input placeholder="Venue" className="filter-select" style={{ cursor: 'text' }} />
                        <button className="login-btn" style={{ gridColumn: 'span 2' }}>Confirm Assignment</button>
                    </form>
                </div>
            )}

            {/* Schedule List */}
            <div className="grid-container">
                {p2pSchedule.map((session) => (
                    <div key={session.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <h3 style={{ margin: '0 0 0.25rem 0', color: '#ffffff', fontSize: '1.2rem' }}>{session.topic}</h3>
                                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500 }}>Tutor: {session.tutor}</p>
                            </div>
                            {user?.role === 'teacher' && (
                                <button className="icon-btn" title="Take Attendance">
                                    <CheckSquare size={18} />
                                </button>
                            )}
                        </div>

                        <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.01)', border: '1px solid rgba(255, 255, 255, 0.04)', borderRadius: '10px', display: 'grid', gap: '10px', fontSize: '0.9rem', color: '#cbd5e1' }}>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><Calendar size={16} color="#6366f1" /> <span>{session.time.split(' ')[0]}</span></div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><Clock size={16} color="#6366f1" /> <span>{session.time.split(' ')[1]}</span></div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><MapPin size={16} color="#6366f1" /> <span>{session.venue}</span></div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem' }}>
                            <span style={{ background: 'rgba(255, 255, 255, 0.03)', color: '#94a3b8', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 500, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                                {session.studentsRegistered} Registered
                            </span>
                            <button className="login-btn" style={{ width: 'auto', padding: '10px 24px', fontSize: '0.9rem' }}>
                                Register
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PeerTutoring;
