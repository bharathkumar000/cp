"use client";
import React, { useState, useEffect } from 'react';
import { extraAPI } from '../../services/api';
import { Briefcase, Building2, GraduationCap, Lock, Unlock, ArrowUpRight, Search, Users } from 'lucide-react';
import AlumniMatch from './AlumniMatch';
import './FeatureStyles.css';

const PlacementHub = () => {
    const [placements, setPlacements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('openings');

    useEffect(() => {
        const fetchPlacements = async () => {
            const data = await extraAPI.getPlacements();
            if (data.length === 0) {
                // Demo Data
                setPlacements([
                    { id: 1, type: 'Internship', company: 'Microsoft', role: 'Software Research Intern', stipend: '₹80,000/pm', rounds: ['OA', 'Tech 1', 'Tech 2', 'HR'], vault: true },
                    { id: 2, type: 'Full-time', company: 'Atlassian', role: 'Graduate Engineer', package: '42 LPA', rounds: ['Coding', 'System Design', 'Values'], vault: true },
                    { id: 3, type: 'Internship', company: 'Adobe', role: 'Product Intern', stipend: '₹1,00,000/pm', rounds: ['Portfolio Review', 'Design Task', 'HR'], vault: false },
                ]);
            } else {
                setPlacements(data);
            }
            setLoading(false);
        };
        fetchPlacements();
    }, []);

    const tabs = [
        { key: 'openings', label: 'Job Openings', icon: <Briefcase size={16} /> },
        { key: 'mentorship', label: 'Alumni Mentorship', icon: <Users size={16} /> },
    ];

    if (loading) return <div>Exploring opportunities...</div>;

    return (
        <div className="hub-container animate-enter">
            {/* Tab Launcher Bar */}
            <div className="placement-tab-bar">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`placement-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'openings' && (
                <div className="placement-container animate-enter">
                    <div className="placement-search-bar">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search companies or roles..."
                        />
                    </div>
                    <div className="placement-grid">
                        {placements.map(job => (
                            <div key={job.id} className="job-card">
                                <div className={`job-badge ${job.type.toLowerCase().replace(' ', '-')}`}>{job.type}</div>
                                <div className="job-header">
                                    <div className="company-logo">
                                        <Building2 size={32} />
                                    </div>
                                    <div className="job-title">
                                        <h3>{job.role}</h3>
                                        <span>{job.company}</span>
                                    </div>
                                </div>

                                <div className="job-details">
                                    <div className="detail-item">
                                        <span className="label">Package/Stipend</span>
                                        <span className="value">{job.package || job.stipend}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Interview Rounds</span>
                                        <div className="rounds-tags">
                                            {job.rounds.map((round, i) => (
                                                <span key={i} className="round-tag">{round}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="job-footer">
                                    <button className={`vault-btn ${job.vault ? 'accessible' : 'locked'}`}>
                                        {job.vault ? <Unlock size={16} /> : <Lock size={16} />}
                                        <span>Interview Vault</span>
                                    </button>
                                    <button className="apply-btn">
                                        Apply <ArrowUpRight size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'mentorship' && (
                <AlumniMatch />
            )}
        </div>
    );
};

export default PlacementHub;
