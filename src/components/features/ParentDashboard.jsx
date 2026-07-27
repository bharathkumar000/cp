"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createClient } from '../../utils/supabase/client';
import { mockBackend } from '../../services/mockBackend';
import { 
    Users, Activity, Wallet, Bell, 
    TrendingUp, User, Home, BookOpen, 
    Calendar, CheckCircle2, AlertTriangle, 
    ShieldAlert, Clock, Award, LineChart as ChartIcon
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './FeatureStyles.css';

const childNameMap = {
    'mock-student-id': 'Demo Student',
    '00000000-0000-0000-0000-000000000001': 'Bharath Kumar A (bk@vvce)',
    '00000000-0000-0000-0000-000000000002': 'Ananya Yk (ananya@vvce)',
    '00000000-0000-0000-0000-000000000003': 'Riddhi (riddhi@vvce)',
    '00000000-0000-0000-0000-000000000007': 'Rishith (rishith@vvce)',
    '00000000-0000-0000-0000-000000000008': 'Bharath P (bp@vvce)',
    '00000000-0000-0000-0000-000000000009': 'Anagha (anagha@vvce)'
};

const childUsnMap = {
    'mock-student-id': '4VV25EC001',
    '00000000-0000-0000-0000-000000000001': '4VV25EC001',
    '00000000-0000-0000-0000-000000000002': '4VV25EC002',
    '00000000-0000-0000-0000-000000000003': '4VV25EC099',
    '00000000-0000-0000-0000-000000000007': '4VV25EC007',
    '00000000-0000-0000-0000-000000000008': '4VV25EC008',
    '00000000-0000-0000-0000-000000000009': '4VV25EC009'
};

const ParentDashboard = () => {
    const { user } = useAuth();
    const supabase = useMemo(() => createClient(), []);

    // Component states
    const [loading, setLoading] = useState(true);
    const [childName, setChildName] = useState('Bharath P');
    const [attendancePct, setAttendancePct] = useState(92);
    const [attendanceCount, setAttendanceCount] = useState({ present: 23, total: 25 });
    
    // Parent warning electronic signature lockout states
    const [signatureName, setSignatureName] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [compulsoryRemarks, setCompulsoryRemarks] = useState(mockBackend.compulsoryRemarks);

    // Event listener for backend updates
    useEffect(() => {
        const handleBackendUpdate = () => {
            setCompulsoryRemarks([...mockBackend.compulsoryRemarks]);
        };
        if (typeof window !== 'undefined') {
            window.addEventListener('mock-backend-update', handleBackendUpdate);
        }
        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('mock-backend-update', handleBackendUpdate);
            }
        };
    }, []);

    const activeChildId = user?.childId || '00000000-0000-0000-0000-000000000002'; // default to bp@vvce
    const parentEmailNormalized = (user?.email || '').toLowerCase().trim();

    const activeCriticalRemark = useMemo(() => {
        return compulsoryRemarks.find(rem => 
            rem.priority === 'critical' && 
            !rem.isAcknowledged && 
            (rem.studentId === activeChildId || (rem.parentEmail || '').toLowerCase().trim() === parentEmailNormalized)
        );
    }, [compulsoryRemarks, activeChildId, parentEmailNormalized]);

    const handleAcknowledgeAndSign = (remarkId) => {
        if (!signatureName.trim()) {
            setErrorMsg('Please input your signature to sign off.');
            return;
        }

        const result = mockBackend.acknowledgeRemark(remarkId, signatureName);
        if (result.success) {
            // Trigger local sync
            setCompulsoryRemarks([...mockBackend.compulsoryRemarks]);
            setSignatureName('');
            setErrorMsg('');
            
            // Dispatch event for other components (e.g., DashboardHome) to refresh
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('mock-backend-update'));
            }
        } else {
            setErrorMsg(result.error || 'Failed to sign the remark.');
        }
    };

    // Lists fetched from Supabase
    const [timetables, setTimetables] = useState([]);
    const [exams, setExams] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [notices, setNotices] = useState([]);

    useEffect(() => {
        if (!user || user.role !== 'parent') {
            setLoading(false);
            return;
        }

        const fetchChildData = async () => {
            try {
                const childId = user.childId || '00000000-0000-0000-0000-000000000002'; // Default to bp@vvce

                // 1. Fetch child profile name
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('id', childId)
                    .single();
                
                setChildName(childNameMap[childId] || user.childEmail || 'Demo Student');

                // 2. Fetch child attendance
                const { data: attData } = await supabase
                    .from('attendance')
                    .select('present, total')
                    .eq('student_id', childId);

                let basePresent = 23;
                let baseTotal = 25;
                if (childId === 'mock-student-id') {
                    basePresent = 37;
                    baseTotal = 40;
                } else if (childId === '00000000-0000-0000-0000-000000000002') {
                    basePresent = 22;
                    baseTotal = 35;
                } else if (childId === '00000000-0000-0000-0000-000000000001') {
                    basePresent = 41;
                    baseTotal = 46;
                } else if (childId === '00000000-0000-0000-0000-000000000007') {
                    basePresent = 27;
                    baseTotal = 35;
                } else if (childId === '00000000-0000-0000-0000-000000000008') {
                    basePresent = 32;
                    baseTotal = 35;
                } else if (childId === '00000000-0000-0000-0000-000000000009') {
                    basePresent = 27;
                    baseTotal = 35;
                }

                let totalPresent = basePresent;
                let totalClasses = baseTotal;

                if (attData && attData.length > 0) {
                    attData.forEach(item => {
                        totalPresent += item.present;
                        totalClasses += item.total;
                    });
                }

                setAttendanceCount({ present: totalPresent, total: totalClasses });
                setAttendancePct(Math.round((totalPresent / totalClasses) * 100));

                // 3. Fetch child timetables
                const { data: ttData } = await supabase
                    .from('timetables')
                    .select('*')
                    .eq('student_id', childId);
                if (ttData && ttData.length > 0) {
                    setTimetables(ttData);
                } else {
                    // Fallback to default timetable
                    setTimetables([
                        { id: '1', subject: '1BCS201 - Introduction to Computer Science', day: 'Monday', time: '09:00 AM - 10:00 AM', room: 'L-301' },
                        { id: '2', subject: '1BPLCO203 - Introduction to C Programming', day: 'Monday', time: '10:15 AM - 11:15 AM', room: 'CS-Lab' },
                        { id: '3', subject: '1BPHYT202 - Applied Physics', day: 'Tuesday', time: '11:30 AM - 12:30 PM', room: 'Physics-Lab' }
                    ]);
                }

                // 4. Fetch child exams
                const { data: exData } = await supabase
                    .from('exams')
                    .select('*')
                    .eq('student_id', childId);
                if (exData && exData.length > 0) {
                    setExams(exData);
                } else {
                    // Fallback
                    setExams([
                        { id: '1', subject: '1BCS201 - Introduction to Computer Science', type: 'Internals 1', date: '15-06-2026', time: '10:00 AM' },
                        { id: '2', subject: '1BPLCO203 - Introduction to C Programming', type: 'Final Exam', date: '22-06-2026', time: '02:00 PM' }
                    ]);
                }

                // 5. Fetch child quizzes
                const { data: qzData } = await supabase
                    .from('quizzes')
                    .select('*')
                    .eq('student_id', childId);
                if (qzData && qzData.length > 0) {
                    setQuizzes(qzData);
                } else {
                    // Fallback
                    setQuizzes([
                        { id: '1', subject: '1BCS201 - Introduction to Computer Science', title: 'Unit Test 1', score: '8', total: '10', date: '12-05-2026' },
                        { id: '2', subject: '1BPLCO203 - Introduction to C Programming', title: 'Quiz 1', score: '9', total: '10', date: '19-05-2026' }
                    ]);
                }

                // 6. Fetch notices
                const { data: ntData } = await supabase
                    .from('notices')
                    .select('*')
                    .or('target_role.eq.all,target_role.eq.parent');
                if (ntData && ntData.length > 0) {
                    setNotices(ntData);
                } else {
                    setNotices([
                        { id: '1', title: 'Internals Notice', message: 'Semester 2 first internal assessment will commence from 15th June 2026. Attendance is mandatory.', date: '24-05-2026' },
                        { id: '2', title: 'Parent Teacher Association Meeting', message: 'PTA meeting scheduled for 30th May 2026 at 10 AM in the main auditorium.', date: '24-05-2026' }
                    ]);
                }

            } catch (err) {
                console.error("Error fetching child performance data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchChildData();

        // Subscribe to real-time updates for parent queries
        const channel = supabase.channel('parent_realtime_feed');
        
        channel.on('postgres_changes', { event: '*', schema: 'public', table: 'attendance' }, () => {
            fetchChildData();
        });
        channel.on('postgres_changes', { event: '*', schema: 'public', table: 'exams' }, () => {
            fetchChildData();
        });
        channel.on('postgres_changes', { event: '*', schema: 'public', table: 'quizzes' }, () => {
            fetchChildData();
        });
        channel.on('postgres_changes', { event: '*', schema: 'public', table: 'notices' }, () => {
            fetchChildData();
        });
        
        channel.subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, supabase]);

    // CGPA growth trends (using static student indicators with internals)
    const cgpaTrends = [
        { sem: 'Sem 1', gpa: 8.2 },
        { sem: 'IA 1', gpa: 7.8 },
        { sem: 'IA 2', gpa: 8.4 },
        { sem: 'IA 3', gpa: 8.1 },
        { sem: 'Sem 2', gpa: 8.6 },
    ];

    if (loading) {
        return (
            <div style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', fontWeight: 600 }}>
                LOADING CHILD NODES AND ACADEMIC FEEDS...
            </div>
        );
    }

    return (
        <div className="parent-dashboard-container animate-enter" style={{ position: 'relative', padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            {activeCriticalRemark && (
                <div className="lockout-overlay" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 99999,
                    background: 'var(--lockout-overlay-bg)',
                    backdropFilter: 'blur(20px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                }}>
                    <div className="lockout-box" style={{
                        background: 'var(--bg-card)',
                        border: '2px solid var(--error)',
                        borderRadius: '16px',
                        padding: '32px',
                        maxWidth: '550px',
                        width: '100%',
                        boxShadow: 'var(--shadow-hard)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        color: 'var(--text-primary)',
                        textAlign: 'center'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div className="pulse-anim" style={{
                                background: 'rgba(239, 68, 68, 0.12)',
                                border: '2.5px solid var(--error)',
                                borderRadius: '50%',
                                padding: '16px',
                                display: 'inline-flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <ShieldAlert size={48} color="var(--error)" />
                            </div>
                        </div>

                        <div>
                            <span style={{
                                background: 'rgba(239, 68, 68, 0.15)',
                                color: 'var(--error)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '0.72rem',
                                fontWeight: '800',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                fontFamily: "'Space Grotesk', sans-serif"
                            }}>
                                High Priority Parent Acknowledgment Lockout
                            </span>
                            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '12px', letterSpacing: '-0.5px' }}>
                                Administrative Warning Interceptor
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '6px', lineHeight: '1.5' }}>
                                A critical academic compliance alert has been issued by the Class Mentor. Access to the dashboard operations is temporarily locked until your electronic signature acknowledgment is captured.
                            </p>
                        </div>

                        <div style={{
                            background: 'var(--bg-secondary)',
                            border: '1.5px solid var(--border-color)',
                            borderRadius: '10px',
                            padding: '20px',
                            textAlign: 'left',
                            fontSize: '0.9rem',
                            lineHeight: '1.6',
                            color: 'var(--text-primary)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', fontFamily: "'Space Grotesk', sans-serif" }}>Issuer / Section</span>
                                <span style={{ color: 'var(--accent-primary)', fontWeight: '700', fontFamily: "'Space Grotesk', sans-serif" }}>{activeCriticalRemark.teacherName} ({activeCriticalRemark.sectionCode})</span>
                            </div>
                            <div style={{ color: 'var(--error)', fontWeight: '600', fontStyle: 'italic', marginBottom: '12px', lineHeight: 1.4 }}>
                                "{activeCriticalRemark.message}"
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>Student: <strong style={{ color: 'var(--text-primary)' }}>{childNameMap[activeChildId]?.split(' (')[0] || 'Bharath P'}</strong></span>
                                    <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>USN: {childUsnMap[activeChildId] || '4VV25EC008'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', borderTop: '1px dashed var(--border-color)', paddingTop: '4px' }}>
                                    <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>Date: {new Date(activeCriticalRemark.createdAt).toLocaleString('en-GB')}</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                            <label style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: '700', fontFamily: "'Space Grotesk', sans-serif" }}>Parent Electronic Signature *</label>
                            <input 
                                type="text"
                                placeholder="Type your name (e.g. Abhi) to sign off..."
                                value={signatureName}
                                onChange={(e) => {
                                    setSignatureName(e.target.value);
                                    if (errorMsg) setErrorMsg('');
                                }}
                                style={{
                                    background: 'var(--bg-secondary)',
                                    border: errorMsg ? '2px solid var(--error)' : '2px solid var(--border-color)',
                                    borderRadius: '10px',
                                    padding: '12px 14px',
                                    fontSize: '0.92rem',
                                    color: 'var(--text-primary)',
                                    outline: 'none',
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    transition: 'all 0.2s ease'
                                }}
                                onFocus={(e) => {
                                    if (!errorMsg) e.target.style.borderColor = 'var(--accent-primary)';
                                }}
                                onBlur={(e) => {
                                    if (!errorMsg) e.target.style.borderColor = 'var(--border-color)';
                                }}
                            />
                            {errorMsg && (
                                <span style={{ color: 'var(--error)', fontSize: '0.78rem', fontWeight: '700', marginTop: '2px' }}>
                                    ⚠️ {errorMsg}
                                </span>
                            )}
                        </div>

                        <style>{`
                            @keyframes pulseButtonGlow {
                                0% { transform: scale(1); box-shadow: 0 0 15px rgba(251, 191, 36, 0.45), inset 0 0 10px rgba(255,255,255,0.1); }
                                50% { transform: scale(1.02); box-shadow: 0 0 32px rgba(251, 191, 36, 0.8), inset 0 0 15px rgba(255,255,255,0.25); }
                                100% { transform: scale(1); box-shadow: 0 0 15px rgba(251, 191, 36, 0.45), inset 0 0 10px rgba(255,255,255,0.1); }
                            }
                            .glowing-btn-pulse {
                                animation: pulseButtonGlow 1.8s infinite cubic-bezier(0.4, 0, 0.2, 1);
                            }
                        `}</style>

                        <button 
                            onClick={() => handleAcknowledgeAndSign(activeCriticalRemark.id)}
                            className="glowing-btn-pulse"
                            style={{
                                border: 'none',
                                background: 'linear-gradient(135deg, #fbbf24, #d97706)',
                                color: '#000',
                                padding: '14px',
                                borderRadius: '30px',
                                fontSize: '0.92rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.25s ease',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                fontFamily: "'Space Grotesk', sans-serif"
                            }}
                        >
                            Acknowledge Remark
                        </button>
                    </div>
                </div>
            )}

            {/* Dashboard Welcome Header */}
            <div className="welcome-banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                    <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.8rem', fontWeight: '700', background: 'linear-gradient(to right, var(--text-primary), var(--text-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>Parent Control Center</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '4px 0 0 0' }}>Monitoring child node: <strong style={{ color: 'var(--accent-primary)' }}>{childName}</strong></p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <div className="date-badge" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-secondary)', padding: '6px 16px', borderRadius: '20px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', fontFamily: "'JetBrains Mono', monospace" }}>
                        USN: <strong style={{ color: 'var(--accent-primary)' }}>{childUsnMap[activeChildId] || '4VV25EC008'}</strong>
                    </div>
                </div>
            </div>

            <div className="summary-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="summary-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'var(--bg-card)', border: '2px solid var(--border-color)', borderRadius: '16px', padding: '20px', transition: 'all 0.2s ease' }}>
                    <div className="card-icon" style={{ background: 'rgba(0, 255, 204, 0.08)', borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Activity size={24} color="#00ffcc" />
                    </div>
                    <div className="card-info">
                        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.5rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>{attendancePct}%</h3>
                        <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Attendance ({attendanceCount.present}/{attendanceCount.total} hrs)</p>
                    </div>
                </div>
                <div className="summary-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'var(--bg-card)', border: '2px solid var(--border-color)', borderRadius: '16px', padding: '20px', transition: 'all 0.2s ease' }}>
                    <div className="card-icon" style={{ background: 'rgba(167, 139, 250, 0.08)', borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle2 size={24} color="#a78bfa" />
                    </div>
                    <div className="card-info">
                        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.5rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>94%</h3>
                        <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Homework Compliance</p>
                    </div>
                </div>
                <div className="summary-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'var(--bg-card)', border: '2px solid var(--border-color)', borderRadius: '16px', padding: '20px', transition: 'all 0.2s ease' }}>
                    <div className="card-icon" style={{ background: 'rgba(244, 114, 182, 0.08)', borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <TrendingUp size={24} color="#f472b6" />
                    </div>
                    <div className="card-info">
                        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.5rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>Excellent</h3>
                        <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Behavior Status</p>
                    </div>
                </div>
                <div className="summary-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'var(--bg-card)', border: '2px solid var(--border-color)', borderRadius: '16px', padding: '20px', transition: 'all 0.2s ease' }}>
                    <div className="card-icon" style={{ background: 'rgba(251, 191, 36, 0.08)', borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShieldAlert size={24} color="#fbbf24" />
                    </div>
                    <div className="card-info">
                        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.5rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>Safe</h3>
                        <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Online Presence</p>
                    </div>
                </div>
            </div>

            <div className="parent-layout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* CGPA Trend Section */}
                <div className="parent-section cgpa-trend full-width" style={{ gridColumn: 'span 2', background: 'var(--bg-card)', border: '2px solid var(--border-color)', borderRadius: '16px', padding: '24px' }}>
                    <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
                        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.15rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>CGPA Growth Trend</h3>
                        <ChartIcon size={20} color="var(--accent-primary)" />
                    </div>
                    <div className="chart-container" style={{ height: '230px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={cgpaTrends}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                <XAxis dataKey="sem" stroke="#94a3b8" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem' }} />
                                <YAxis domain={[0, 10]} stroke="#94a3b8" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem' }} />
                                <Tooltip 
                                    contentStyle={{ background: 'var(--bg-card)', border: '2px solid var(--border-color)', borderRadius: '10px' }}
                                    itemStyle={{ color: '#00ffcc', fontFamily: "'Space Grotesk', sans-serif" }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="gpa" 
                                    stroke="#818cf8" 
                                    strokeWidth={3.5} 
                                    dot={{ fill: '#818cf8', r: 6 }} 
                                    activeDot={{ r: 8, stroke: '#fff' }} 
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Timetable Section */}
                <div className="parent-section timetable" style={{ background: 'var(--bg-card)', border: '2px solid var(--border-color)', borderRadius: '16px', padding: '24px' }}>
                    <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
                        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.15rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>Child's Timetable</h3>
                        <Clock size={20} color="var(--accent-primary)" />
                    </div>
                    <div className="timetable-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {timetables.map(slot => (
                            <div key={slot.id} className="exam-card" style={{ borderLeft: '3px solid var(--accent-primary)', background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', borderLeftWidth: '3px' }}>
                                <div className="exam-subject" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{slot.subject}</div>
                                <div className="exam-details" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px', fontFamily: "'JetBrains Mono', monospace" }}>
                                    <span>{slot.day} | {slot.time}</span>
                                    <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>Room {slot.room}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Exams Section */}
                <div className="parent-section exams" style={{ background: 'var(--bg-card)', border: '2px solid var(--border-color)', borderRadius: '16px', padding: '24px' }}>
                    <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
                        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.15rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>Notice for Exams & Internals</h3>
                        <Calendar size={20} color="var(--accent-primary)" />
                    </div>
                    <div className="exam-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {exams.map(exam => (
                            <div key={exam.id} className="exam-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                <div className="exam-subject" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{exam.subject}</div>
                                <div className="exam-details" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                                    <span style={{ fontFamily: "'JetBrains Mono', monospace" }}><Calendar size={12} style={{ marginRight: '4px', display: 'inline' }} /> {exam.date}</span>
                                    <span className="exam-tag" style={{ 
                                        backgroundColor: exam.type.toLowerCase().includes('final') ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                                        color: exam.type.toLowerCase().includes('final') ? 'var(--error)' : '#f59e0b',
                                        border: exam.type.toLowerCase().includes('final') ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                                        padding: '2px 10px',
                                        borderRadius: '20px',
                                        fontSize: '0.7rem',
                                        fontWeight: '700',
                                        fontFamily: "'Space Grotesk', sans-serif"
                                    }}>
                                        {exam.type}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quizzes and Class Tests Section */}
                <div className="parent-section grades" style={{ background: 'var(--bg-card)', border: '2px solid var(--border-color)', borderRadius: '16px', padding: '24px' }}>
                    <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
                        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.15rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>Quizzes & Class Tests</h3>
                        <Award size={20} color="var(--accent-primary)" />
                    </div>
                    <div className="grade-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {quizzes.map(quiz => (
                            <div key={quiz.id} className="grade-row" style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                <div className="subject-icon" style={{ background: 'rgba(129, 140, 248, 0.08)', borderRadius: '6px', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}><BookOpen size={16} color="var(--accent-primary)" /></div>
                                <div className="subject-name" style={{ flex: 1, fontFamily: "'Space Grotesk', sans-serif", fontWeight: '600', fontSize: '0.88rem', color: 'var(--text-primary)' }}>{quiz.subject}</div>
                                <div className="grade-value" style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: '700', fontSize: '0.88rem', color: parseFloat(quiz.score)/parseFloat(quiz.total) >= 0.75 ? 'var(--success)' : 'var(--error)', marginRight: '12px' }}>
                                    {quiz.score}/{quiz.total}
                                </div>
                                <div className="grade-date" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{quiz.date}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* School Notices */}
                <div className="parent-section notices" style={{ background: 'var(--bg-card)', border: '2px solid var(--border-color)', borderRadius: '16px', padding: '24px' }}>
                    <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
                        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.15rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>School Notice Board</h3>
                        <Bell size={20} color="var(--accent-primary)" />
                    </div>
                    <div className="notice-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {notices.map(notice => (
                            <div key={notice.id} className="notice-item" style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                <div className="notice-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                    <span className="notice-title" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{notice.title}</span>
                                    <span className="notice-date" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{notice.date}</span>
                                </div>
                                <p className="notice-msg" style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{notice.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentDashboard;
