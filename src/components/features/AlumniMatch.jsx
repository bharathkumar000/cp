'use client';
import React, { useState } from 'react';
import { Heart, X, Briefcase, GraduationCap, Star, Calendar, MessageSquare, Sparkles } from 'lucide-react';
import './FeatureStyles.css';

const Linkedin = ({ size = 18 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect width="4" height="12" x="2" y="9"/>
        <circle cx="4" cy="4" r="2"/>
    </svg>
);

const MENTORS_DATA = [
    {
        id: 1,
        name: 'Arjun Mehta',
        role: 'SDE-2 @ Amazon',
        batch: 'Batch of 2018',
        matchPercent: 98,
        expertise: ['System Design', 'Backend Engineering', 'AWS'],
        image: '/arjun_mehta.png',
        available: 'Next Friday, 4 PM',
        linkedin: 'https://linkedin.com',
        bio: 'Ex-Flipkart, Ex-Directi. Happy to discuss building scalable distributed systems and backend architecture.'
    },
    {
        id: 2,
        name: 'Sara Khan',
        role: 'PM @ Google',
        batch: 'Batch of 2020',
        matchPercent: 95,
        expertise: ['Product Management', 'Strategy', 'UI/UX'],
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400',
        available: 'Tomorrow, 6 PM',
        linkedin: 'https://linkedin.com',
        bio: 'Currently scaling Google Cloud products. Let’s talk about how to pivot from SDE to PM and product strategy.'
    },
    {
        id: 3,
        name: 'Rohit Sharma',
        role: 'Data Scientist @ Tesla',
        batch: 'Batch of 2019',
        matchPercent: 92,
        expertise: ['Machine Learning', 'Big Data', 'Python'],
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=400',
        available: 'Monday, 10 AM',
        linkedin: 'https://linkedin.com',
        bio: 'Building autonomous driving models. Ask me about ML modeling and data engineering pipelines at scale.'
    },
    {
        id: 4,
        name: 'Priya Nair',
        role: 'Research Scientist @ OpenAI',
        batch: 'Batch of 2017',
        matchPercent: 99,
        expertise: ['LLMs', 'Transformer Models', 'PyTorch'],
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400',
        available: 'Thursday, 3 PM',
        linkedin: 'https://linkedin.com',
        bio: 'Researching multi-modal reasoning. Keen to help students interested in pursuing research and publication in AI/ML.'
    },
    {
        id: 5,
        name: 'Vikram Singh',
        role: 'Hardware Architect @ Apple',
        batch: 'Batch of 2016',
        matchPercent: 94,
        expertise: ['VLSI Design', 'ASIC', 'Embedded Systems'],
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400',
        available: 'Wednesday, 5 PM',
        linkedin: 'https://linkedin.com',
        bio: 'Designing custom silicon chips for consumer tech. Reach out to discuss digital electronics, Verilog, and hardware design.'
    },
    {
        id: 6,
        name: 'Divya Hegde',
        role: 'Founder @ Web3Labs',
        batch: 'Batch of 2019',
        matchPercent: 89,
        expertise: ['Solidity', 'Decentralized Apps', 'Funding'],
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400',
        available: 'Saturday, 11 AM',
        linkedin: 'https://linkedin.com',
        bio: 'Built Web3Labs from ground up. Let\'s chat about starting up, fundraising, and the transition from campus to startup life.'
    },
    {
        id: 7,
        name: 'Rahul Verma',
        role: 'Quant Trader @ Jane Street',
        batch: 'Batch of 2021',
        matchPercent: 97,
        expertise: ['Algorithms', 'Probability', 'C++'],
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400&h=400',
        available: 'Tuesday, 8 PM',
        linkedin: 'https://linkedin.com',
        bio: 'Ex-Citadel. Specialized in algorithmic strategy. Let\'s discuss competitive programming, math challenges, and finance careers.'
    },
    {
        id: 8,
        name: 'Shalini Sen',
        role: 'Engineering Lead @ Netflix',
        batch: 'Batch of 2015',
        matchPercent: 96,
        expertise: ['Microservices', 'Node.js', 'System Architecture'],
        image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400&h=400',
        available: 'Next Monday, 4 PM',
        linkedin: 'https://linkedin.com',
        bio: 'Managing cloud infrastructure for global streaming. Happy to share lessons on scaling large architectures and career growth.'
    }
];

const AlumniMatch = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [matches, setMatches] = useState([]);
    const [lastAction, setLastAction] = useState(null); // 'match' or 'skip'

    const currentMentor = MENTORS_DATA[currentIndex];

    const handleAction = (type) => {
        setLastAction(type);
        if (type === 'match') {
            setMatches([...matches, currentMentor]);
        }
        
        setTimeout(() => {
            setLastAction(null);
            if (currentIndex < MENTORS_DATA.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else {
                setCurrentIndex(-1); // No more mentors
            }
        }, 600);
    };

    if (currentIndex === -1) {
        return (
            <div className="alumni-match-complete animate-enter">
                <div className="match-success-card card" style={{ textAlign: 'center', padding: '3rem', maxWidth: '600px', margin: '0 auto' }}>
                    <div className="heart-icon-pulsing">
                        <Heart size={64} color="var(--accent-action, #fbbf24)" fill="var(--accent-action, #fbbf24)" />
                    </div>
                    <h2 style={{ margin: '1.5rem 0 1rem', color: '#fff' }}>No more mentors for now!</h2>
                    <p style={{ color: 'var(--text-secondary, #9ca3af)', marginBottom: '1.5rem' }}>You have viewed all available mentors. Schedule quick calls below.</p>
                    <button className="primary-btn-brutal" onClick={() => setCurrentIndex(0)} style={{ background: '#fbbf24', border: '2px solid #000', padding: '10px 24px', fontWeight: '800', cursor: 'pointer', borderRadius: '8px' }}>
                        Restart Discovery
                    </button>
                </div>

                {matches.length > 0 && (
                    <div className="matches-list" style={{ marginTop: '3rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
                            <Star size={20} color="#fbbf24" fill="#fbbf24" /> Your Matches ({matches.length})
                        </h3>
                        <div className="matches-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                            {matches.map(m => (
                                <div key={m.id} className="match-item-card card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(21, 24, 31, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1rem' }}>
                                    <img src={m.image} alt={m.name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #fbbf24' }} />
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: 0, color: '#fff' }}>{m.name}</h4>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary, #9ca3af)', margin: '4px 0' }}>{m.role}</p>
                                    </div>
                                    <button className="icon-btn-highlight" style={{ background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.3)', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}><Calendar size={18} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="alumni-match-container animate-enter">
            <div className="match-header-text" style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-1px', color: '#fff' }}>
                    Alumni Match <span style={{ color: '#fbbf24' }}>Beta</span>
                </h2>
                <p style={{ color: 'var(--text-secondary, #9ca3af)' }}>Find your perfect mentor. Swipe right to connect for a 15-min call.</p>
            </div>

            <div className={`mentor-card-stack ${lastAction ? `action-${lastAction}` : ''}`}>
                <div className="mentor-card-main card">
                    <div className="mentor-image-container">
                        <img src={currentMentor.image} alt={currentMentor.name} className="mentor-img" />
                        <div className="mentor-overlay-info">
                            <span className="batch-tag">{currentMentor.batch}</span>
                            <span className="match-percent-badge"><Sparkles size={12} /> {currentMentor.matchPercent}% Match</span>
                        </div>
                    </div>

                    <div className="mentor-content">
                        <div className="mentor-meta">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1.8rem', margin: 0, color: '#fff' }}>{currentMentor.name}</h3>
                                <a href={currentMentor.linkedin} target="_blank" rel="noopener noreferrer" className="linkedin-link">
                                    <Linkedin size={18} />
                                </a>
                            </div>
                            <div className="mentor-role-pill">
                                <Briefcase size={14} />
                                <span>{currentMentor.role}</span>
                            </div>
                        </div>

                        <p className="mentor-bio">{currentMentor.bio}</p>

                        <div className="mentor-skills">
                            {currentMentor.expertise.map(skill => (
                                <span key={skill} className="skill-tag">{skill}</span>
                            ))}
                        </div>

                        <div className="availability-hint">
                            <Calendar size={14} color="#818cf8" />
                            <span>Available: <strong style={{ color: '#818cf8' }}>{currentMentor.available}</strong></span>
                        </div>
                    </div>

                    {/* Action Stamps */}
                    {lastAction === 'match' && <div className="stamp match-stamp">CONNECT</div>}
                    {lastAction === 'skip' && <div className="stamp skip-stamp">PASS</div>}
                </div>

                {/* Deck visual */}
                <div className="card-behind-1"></div>
                <div className="card-behind-2"></div>
            </div>

            <div className="match-controls">
                <button className="control-btn skip" onClick={() => handleAction('skip')}>
                    <X size={28} />
                </button>
                <button className="control-btn match" onClick={() => handleAction('match')}>
                    <Heart size={28} fill="#fbbf24" color="#fbbf24" />
                </button>
            </div>

            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'inline-flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex' }}>
                        {[
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=40&h=40',
                            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=40&h=40',
                            'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=40&h=40',
                            'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=40&h=40'
                        ].map((src, i) => (
                            <img key={i} src={src} alt="student" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', marginLeft: i === 0 ? 0 : '-10px', border: '2px solid #000' }} />
                        ))}
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #9ca3af)' }}>
                        <strong>64 students</strong> scheduled calls with alumni this week.
                    </span>
                </div>
            </div>

            <style>{`
                .mentor-card-stack {
                    position: relative;
                    max-width: 450px;
                    margin: 0 auto;
                    height: 560px;
                    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .mentor-card-main {
                    position: relative;
                    z-index: 10;
                    height: 100%;
                    padding: 0 !important;
                    overflow: hidden;
                    background: rgba(18, 20, 26, 0.8) !important;
                    border: 1px solid rgba(255, 255, 255, 0.08) !important;
                    border-radius: 16px !important;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5) !important;
                    backdrop-filter: blur(12px);
                }

                .mentor-image-container {
                    position: relative;
                    height: 48%;
                    width: 100%;
                }

                .mentor-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .mentor-overlay-info {
                    position: absolute;
                    bottom: 1rem;
                    left: 1rem;
                    right: 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .batch-tag {
                    background: #fbbf24;
                    color: #000;
                    padding: 4px 12px;
                    border-radius: 6px;
                    font-weight: 800;
                    font-size: 0.75rem;
                    box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
                }

                .match-percent-badge {
                    background: rgba(13, 15, 18, 0.75);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    color: #fbbf24;
                    padding: 4px 12px;
                    border-radius: 6px;
                    font-weight: 700;
                    font-size: 0.75rem;
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    backdrop-filter: blur(6px);
                }

                .mentor-content {
                    padding: 1.25rem 1.5rem;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 0.85rem;
                }

                .linkedin-link {
                    color: #9ca3af;
                    transition: color 0.15s ease;
                }

                .linkedin-link:hover {
                    color: #0077b5;
                }

                .mentor-role-pill {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    background: rgba(129, 140, 248, 0.1);
                    color: #818cf8;
                    padding: 5px 12px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    width: fit-content;
                    margin-top: 6px;
                }

                .mentor-bio {
                    font-size: 0.9rem;
                    color: var(--text-secondary, #9ca3af);
                    line-height: 1.5;
                    margin: 0;
                }

                .mentor-skills {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                }

                .skill-tag {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    color: var(--text-secondary, #9ca3af);
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                .availability-hint {
                    margin-top: auto;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.8rem;
                    color: var(--text-secondary, #9ca3af);
                    border-top: 1px solid rgba(255, 255, 255, 0.06);
                    padding-top: 8px;
                }

                .match-controls {
                    display: flex;
                    justify-content: center;
                    gap: 1.5rem;
                    margin-top: 1.5rem;
                }

                .control-btn {
                    width: 58px;
                    height: 58px;
                    border-radius: 50%;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    background: rgba(21, 24, 31, 0.8);
                    color: #9ca3af;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                }

                .control-btn.skip:hover {
                    border-color: #ef4444;
                    color: #ef4444;
                    box-shadow: 0 0 15px rgba(239, 68, 68, 0.25);
                    transform: scale(1.08);
                }

                .control-btn.match:hover {
                    border-color: #fbbf24;
                    color: #fbbf24;
                    box-shadow: 0 0 15px rgba(251, 191, 36, 0.25);
                    transform: scale(1.08);
                }

                .card-behind-1, .card-behind-2 {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(18, 20, 26, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 16px;
                    z-index: 5;
                    transform: translateY(12px) scale(0.95);
                    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.4);
                }

                .card-behind-2 {
                    z-index: 1;
                    transform: translateY(24px) scale(0.9);
                    background: rgba(18, 20, 26, 0.4);
                }

                .stamp {
                    position: absolute;
                    top: 15%;
                    font-size: 2.2rem;
                    font-weight: 900;
                    padding: 4px 16px;
                    border: 4px solid;
                    border-radius: 8px;
                    opacity: 0;
                    transition: opacity 0.2s;
                    z-index: 20;
                    letter-spacing: 2px;
                }

                .match-stamp {
                    right: 30px;
                    color: #fbbf24;
                    border-color: #fbbf24;
                    transform: rotate(-10deg);
                }

                .skip-stamp {
                    left: 30px;
                    color: #ef4444;
                    border-color: #ef4444;
                    transform: rotate(10deg);
                }

                .action-match .mentor-card-main {
                    transform: translateX(200%) rotate(30deg);
                    opacity: 0;
                    transition: all 0.5s ease-in;
                }
                .action-match .match-stamp { opacity: 1; }

                .action-skip .mentor-card-main {
                    transform: translateX(-200%) rotate(-30deg);
                    opacity: 0;
                    transition: all 0.5s ease-in;
                }
                .action-skip .skip-stamp { opacity: 1; }

                .heart-icon-pulsing {
                    animation: heartPulse 2s infinite;
                }

                @keyframes heartPulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.08); }
                    100% { transform: scale(1); }
                }

                @media (max-width: 768px) {
                    .mentor-card-stack {
                        max-width: 100%;
                        height: 520px;
                    }

                    .mentor-content {
                        padding: 1rem 1.25rem;
                        gap: 0.75rem;
                    }

                    .mentor-meta h3 {
                        font-size: 1.4rem !important;
                    }

                    .mentor-bio {
                        font-size: 0.85rem;
                    }

                    .control-btn {
                        width: 52px;
                        height: 52px;
                    }

                    .match-controls {
                        gap: 1.25rem;
                        margin-top: 1.25rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default AlumniMatch;
