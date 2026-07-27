'use client';

import React, { useState } from 'react';
import { Megaphone, Bell, Calendar, ShieldAlert, CheckCircle, Search, Filter, Plus, X } from 'lucide-react';
import './NoticeBoard.css';

const initialNotices = [
    {
        id: 1,
        type: 'ANNOUNCEMENT',
        date: 'May 15, 2026',
        title: 'Annual Day Celebration',
        content: 'The Annual Day celebration will be held on May 28th, 2026 at the School Auditorium. All parents are cordially invited. Students participating in cultural programs must attend rehearsals from May 20th onwards.',
        parentSignatureRequired: true,
        signed: false,
        color: '#fbbf24',
    },
    {
        id: 2,
        type: 'HOLIDAY',
        date: 'May 12, 2026',
        title: 'Summer Vacation Notice',
        content: 'School will remain closed for summer vacation from June 1st to June 30th, 2026. School reopens on July 1st. Summer homework packets will be distributed on May 25th.',
        parentSignatureRequired: false,
        color: '#10b981',
        highlight: true,
    },
    {
        id: 3,
        type: 'EVENT',
        date: 'May 10, 2026',
        title: 'Field Trip to Science Museum',
        content: 'A field trip to the Regional Science Museum is planned for May 22nd for Classes 7-9. Permission slips must be signed and returned by May 18th. Bus fee: ₹200. Lunch will be provided.',
        parentSignatureRequired: true,
        urgent: true,
        signed: false,
        color: '#ef4444',
    }
];

export default function NoticeBoardPage() {
    const [notices, setNotices] = useState(initialNotices);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('ALL');
    const [showAddModal, setShowAddModal] = useState(false);
    
    // Form fields for new notice
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [newType, setNewType] = useState('ANNOUNCEMENT');
    const [newSignature, setNewSignature] = useState(false);
    const [newUrgent, setNewUrgent] = useState(false);

    const handleToggleSign = (id) => {
        setNotices(prev => prev.map(n => {
            if (n.id === id) {
                return { ...n, signed: !n.signed };
            }
            return n;
        }));
    };

    const handleAddNotice = (e) => {
        e.preventDefault();
        if (!newTitle.trim() || !newContent.trim()) return;

        const colorMap = {
            'ANNOUNCEMENT': '#fbbf24',
            'HOLIDAY': '#10b981',
            'EVENT': '#ef4444',
        };

        const newNotice = {
            id: Date.now(),
            type: newType,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            title: newTitle,
            content: newContent,
            parentSignatureRequired: newSignature,
            urgent: newUrgent,
            signed: false,
            color: colorMap[newType] || '#fbbf24',
            highlight: newType === 'HOLIDAY'
        };

        setNotices([newNotice, ...notices]);
        
        // Reset form fields
        setNewTitle('');
        setNewContent('');
        setNewType('ANNOUNCEMENT');
        setNewSignature(false);
        setNewUrgent(false);
        setShowAddModal(false);
    };

    const filteredNotices = notices.filter(n => {
        const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              n.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = selectedFilter === 'ALL' || n.type === selectedFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="notices-container animate-fade-in">
            {/* Header section with Notice Board pill */}
            <div className="notices-header-row">
                <div className="notice-board-pill">
                    NOTICE BOARD
                </div>
                <button className="add-notice-btn" onClick={() => setShowAddModal(true)}>
                    <Plus size={16} /> Add Notice
                </button>
            </div>

            {/* Controls Row (Search and Filters) */}
            <div className="notices-controls">
                <div className="notices-search-wrapper">
                    <Search size={18} className="search-icon" />
                    <input 
                        type="text" 
                        placeholder="Search notices, announcements..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="filter-buttons">
                    {['ALL', 'ANNOUNCEMENT', 'HOLIDAY', 'EVENT'].map(filter => (
                        <button 
                            key={filter}
                            className={`filter-btn ${selectedFilter === filter ? 'active' : ''}`}
                            onClick={() => setSelectedFilter(filter)}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Timeline + Notices List Section */}
            <div className="notices-timeline-section">
                {filteredNotices.length > 0 ? (
                    <div className="timeline-wrapper">
                        {/* Vertical Timeline line */}
                        <div className="timeline-line" />

                        <div className="notices-list">
                            {filteredNotices.map(notice => {
                                // Dynamic styling classes based on urgency or highlights
                                let cardClass = 'notice-card';
                                if (notice.urgent) cardClass += ' border-urgent';
                                else if (notice.highlight) cardClass += ' border-highlight';

                                return (
                                    <div key={notice.id} className="notice-item-row">
                                        {/* Timeline Node Dot */}
                                        <div 
                                            className="timeline-dot" 
                                            style={{ 
                                                backgroundColor: notice.color,
                                                boxShadow: `0 0 10px ${notice.color}` 
                                            }}
                                        />
                                        
                                        {/* Notice Content Card */}
                                        <div className={cardClass}>
                                            <div className="notice-card-header">
                                                <div className="badge-row">
                                                    <span 
                                                        className="type-badge" 
                                                        style={{ 
                                                            borderColor: notice.color, 
                                                            color: notice.color,
                                                            backgroundColor: `${notice.color}15`
                                                        }}
                                                    >
                                                        {notice.type}
                                                    </span>
                                                    {notice.urgent && (
                                                        <span className="urgent-badge">
                                                            <ShieldAlert size={12} /> URGENT
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="notice-date">{notice.date}</span>
                                            </div>

                                            <h3 className="notice-title">{notice.title}</h3>
                                            <p className="notice-content-text">{notice.content}</p>

                                            {/* Action footer for signature */}
                                            {notice.parentSignatureRequired && (
                                                <div className="signature-footer">
                                                    <label className="signature-label">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={notice.signed}
                                                            onChange={() => handleToggleSign(notice.id)}
                                                            className="signature-checkbox"
                                                        />
                                                        <span className="signature-text">
                                                            {notice.signed ? (
                                                                <span className="text-signed">
                                                                    <CheckCircle size={14} className="inline-icon" /> Parent Signed
                                                                </span>
                                                            ) : (
                                                                'Parent Signature Required'
                                                            )}
                                                        </span>
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="notices-empty">
                        <Megaphone size={40} className="empty-icon" />
                        <p>No notices match your current filters.</p>
                    </div>
                )}
            </div>

            {/* Add Notice Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content animate-scale-up">
                        <div className="modal-header">
                            <h3>Publish New Notice</h3>
                            <button className="close-modal-btn" onClick={() => setShowAddModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddNotice} className="modal-form">
                            <div className="form-group">
                                <label>Notice Title</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Annual Sports Meet Registration" 
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select value={newType} onChange={(e) => setNewType(e.target.value)}>
                                    <option value="ANNOUNCEMENT">ANNOUNCEMENT</option>
                                    <option value="HOLIDAY">HOLIDAY</option>
                                    <option value="EVENT">EVENT</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Message details</label>
                                <textarea 
                                    placeholder="Provide detailed description of the notice..."
                                    value={newContent}
                                    onChange={(e) => setNewContent(e.target.value)}
                                    rows={4}
                                    required
                                />
                            </div>
                            <div className="form-checkbox-row">
                                <label className="form-checkbox-label">
                                    <input 
                                        type="checkbox" 
                                        checked={newSignature}
                                        onChange={(e) => setNewSignature(e.target.checked)}
                                    />
                                    <span>Require Parent Signature</span>
                                </label>
                                <label className="form-checkbox-label">
                                    <input 
                                        type="checkbox" 
                                        checked={newUrgent}
                                        onChange={(e) => setNewUrgent(e.target.checked)}
                                    />
                                    <span style={{ color: '#ef4444' }}>Mark as Urgent</span>
                                </label>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn-submit">Publish Notice</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
