"use client";
import React from 'react';
import { mockBackend } from '../../services/mockBackend';
import { 
    MessageSquare, User, Calendar, 
    Book, MoreVertical, Search, Filter 
} from 'lucide-react';
import './FeatureStyles.css';

const TeachersDiary = () => {
    const diary = mockBackend.teachersDiary || [];

    const getTypeColor = (type) => {
        switch(type.toLowerCase()) {
            case 'positive': return '#10b981';
            case 'warning': return '#f59e0b';
            case 'alert': return '#ef4444';
            default: return '#3b82f6';
        }
    };

    return (
        <div className="feature-container teachers-diary" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Dashboard Welcome Header */}
            <div className="welcome-banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                    <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.8rem', fontWeight: '700', background: 'linear-gradient(to right, var(--text-primary), var(--text-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>Teacher's Diary</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '4px 0 0 0' }}>Chronological feed of official remarks from subject teachers.</p>
                </div>
                <div className="search-bar-wrap" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-secondary)', padding: '6px 16px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                    <Search size={16} color="var(--text-secondary)" />
                    <input type="text" placeholder="Search remarks..." style={{ background: 'none', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }} />
                </div>
            </div>

            <div className="diary-feed">
                {diary.map(entry => (
                    <div key={entry.id} className={`diary-entry-card ${entry.read ? 'read' : 'unread'}`}>
                        <div className="entry-sidebar" style={{ backgroundColor: getTypeColor(entry.type) }} />
                        <div className="entry-main">
                            <div className="entry-header">
                                <div className="teacher-info">
                                    <div className="avatar">
                                        <User size={16} />
                                    </div>
                                    <div>
                                        <span className="teacher-name" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: '700' }}>{entry.teacher}</span>
                                        <span className="subject-tag" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem' }}>{entry.subject}</span>
                                    </div>
                                </div>
                                <div className="entry-meta">
                                    <span className="entry-date" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                        <Calendar size={12} /> {entry.date}
                                    </span>
                                    <span className="entry-type" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: getTypeColor(entry.type) }}>
                                        {entry.type}
                                    </span>
                                </div>
                            </div>
                            <div className="entry-body">
                                <p>"{entry.remark}"</p>
                            </div>
                            <div className="entry-actions">
                                <button className="comment-btn">
                                    <MessageSquare size={14} /> Reply
                                </button>
                                <button className="more-btn">
                                    <MoreVertical size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeachersDiary;
