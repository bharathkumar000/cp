"use client";
import React, { useState } from 'react';
import { mockBackend } from '../../services/mockBackend';
import { Users, MapPin, Clock, Calendar, Plus } from 'lucide-react';
import './FeatureStyles.css';

const GroupStudy = () => {
    const { studyGroups } = mockBackend;
    const [showForm, setShowForm] = useState(false);

    // Mock Form State
    const [newGroup, setNewGroup] = useState({ topic: '', venue: '', time: '' });

    const handleCreate = (e) => {
        e.preventDefault();
        alert("Group created and broadcasted to students!");
        setShowForm(false);
    };

    return (
        <div className="feature-container">
            {showForm && (
                <div className="card" style={{ marginBottom: '2rem', borderColor: 'rgba(99, 102, 241, 0.2)' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '1.25rem' }}>Host a New Session</h3>
                    <form onSubmit={handleCreate} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                        <input placeholder="Subject / Topic" className="filter-select" style={{ cursor: 'text' }} required />
                        <input placeholder="Venue (e.g. Library)" className="filter-select" style={{ cursor: 'text' }} required />
                        <input type="datetime-local" className="filter-select" style={{ cursor: 'text' }} required />
                        <button type="submit" className="login-btn" style={{ gridColumn: 'span 2' }}>Broadcast Invite</button>
                    </form>
                </div>
            )}

            <div className="grid-container" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {studyGroups.map((group) => (
                    <div key={group.id} className="card" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#ffffff' }}>{group.name}</h3>
                            <span style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                                {group.members} Joined
                            </span>
                        </div>

                        <p style={{ color: '#94a3b8', fontWeight: '500', margin: 0 }}>Topic: {group.topic}</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: '#cbd5e1', marginTop: '0.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <MapPin size={16} color="#6366f1" /> <span>{group.venue}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Clock size={16} color="#6366f1" /> <span>{group.time}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Users size={16} color="#6366f1" /> <span>Host: {group.host}</span>
                            </div>
                        </div>

                        <button className="login-btn" style={{ marginTop: 'auto', width: '100%' }}>Register / Join</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GroupStudy;
