"use client";
import React, { useState, useEffect } from 'react';
import { mockBackend } from '../../services/mockBackend';
import { useAuth } from '../../context/AuthContext';
import { AlertTriangle, Calendar, Clock } from 'lucide-react';
import './FeatureStyles.css';

// Subject → Color scheme configurations
const subjectColors = {
    'CSE': { border: '#6366f1', bg: 'rgba(99, 102, 241, 0.08)', text: '#818cf8', borderTint: 'rgba(99, 102, 241, 0.15)' },  // Indigo
    'ECE': { border: '#10b981', bg: 'rgba(16, 185, 129, 0.08)', text: '#34d399', borderTint: 'rgba(16, 185, 129, 0.15)' },  // Emerald
    'AIML': { border: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.08)', text: '#a78bfa', borderTint: 'rgba(139, 92, 246, 0.15)' }, // Purple
    'EEE': { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)', text: '#fbbf24', borderTint: 'rgba(245, 158, 11, 0.15)' },  // Amber
    'ME': { border: '#ef4444', bg: 'rgba(239, 68, 68, 0.08)', text: '#f87171', borderTint: 'rgba(239, 68, 68, 0.15)' },   // Rose
    'CV': { border: '#06b6d4', bg: 'rgba(20, 184, 166, 0.08)', text: '#2dd4bf', borderTint: 'rgba(20, 184, 166, 0.15)' },   // Teal
};

const defaultColors = { border: '#64748b', bg: 'rgba(148, 163, 184, 0.04)', text: '#94a3b8', borderTint: 'rgba(148, 163, 184, 0.1)' };

// BREAK and LUNCH letters
const breakLetters = ['B', 'R', 'E', 'A', 'K'];
const lunchLetters = ['L', 'U', 'N', 'C', 'H'];

const Timetable = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('SCHOOL');
    const isTeacher = user?.role === 'teacher';

    const [timetableState, setTimetableState] = useState(() => {
        return isTeacher ? mockBackend.teacherTimetable : mockBackend.timetable;
    });

    const { personalNotes } = mockBackend;
    const [todos, setTodos] = useState(mockBackend.todos);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Slot Creator states
    const [showSlotForm, setShowSlotForm] = useState(false);
    const [newSlot, setNewSlot] = useState({
        day: 'Monday',
        period: 1,
        span: 1,
        subject: '',
        type: 'Lecture'
    });

    // Todo Form states
    const [newTodoText, setNewTodoText] = useState('');
    const [newTodoPriority, setNewTodoPriority] = useState('medium');

    const toggleTodo = (id) => {
        setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    };

    const handleAddTodo = (e) => {
        e.preventDefault();
        if (!newTodoText.trim()) return;
        const newItem = {
            id: Date.now().toString(),
            text: newTodoText.trim(),
            done: false,
            priority: newTodoPriority
        };
        setTodos(prev => [...prev, newItem]);
        setNewTodoText('');
    };

    const handleAddSlot = (e) => {
        e.preventDefault();
        if (!newSlot.subject.trim()) return;

        let conflictError = false;

        setTimetableState(prev => {
            const updatedSchedule = prev.schedule.map(dayObj => {
                if (dayObj.day.toLowerCase() === newSlot.day.toLowerCase()) {
                    // Check for overlap or period conflict
                    const hasConflict = dayObj.slots.some(slot => {
                        const newStart = parseInt(newSlot.period);
                        const newEnd = newStart + parseInt(newSlot.span) - 1;
                        const slotStart = slot.period;
                        const slotEnd = slotStart + slot.span - 1;
                        return (newStart <= slotEnd && newEnd >= slotStart);
                    });

                    if (hasConflict) {
                        conflictError = true;
                        return dayObj;
                    }

                    return {
                        ...dayObj,
                        slots: [
                            ...dayObj.slots,
                            {
                                period: parseInt(newSlot.period),
                                span: parseInt(newSlot.span),
                                subject: newSlot.subject.trim(),
                                type: newSlot.type
                            }
                        ].sort((a, b) => a.period - b.period)
                    };
                }
                return dayObj;
            });

            if (conflictError) {
                alert("Error: This slot conflicts with an existing class!");
                return prev;
            }

            return {
                ...prev,
                schedule: updatedSchedule
            };
        });

        if (!conflictError) {
            setNewSlot(prev => ({ ...prev, subject: '' }));
            setShowSlotForm(false);
        }
    };

    useEffect(() => {
        setTimetableState(isTeacher ? mockBackend.teacherTimetable : mockBackend.timetable);
    }, [isTeacher]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // Get current day
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = dayNames[new Date().getDay()];

    // Build lookup for each day: period → slot
    const dayLookup = {};
    timetableState.schedule.forEach(dayObj => {
        const map = {};
        dayObj.slots.forEach(slot => {
            map[slot.period] = slot;
        });
        dayLookup[dayObj.day] = map;
    });

    // Determine which periods are "consumed" by a spanning slot
    const getConsumedPeriods = (dayObj) => {
        const consumed = new Set();
        dayObj.slots.forEach(slot => {
            for (let p = slot.period + 1; p < slot.period + slot.span; p++) {
                consumed.add(p);
            }
        });
        return consumed;
    };

    return (
        <div className="timetable-container animate-enter" style={{ padding: '2rem 1rem', maxWidth: '100%', height: 'auto', overflow: 'visible' }}>
            
            {/* Top Layout Header & Time */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.025em', margin: 0 }}>Timetable</h1>
                    <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '0.25rem', fontWeight: 500 }}>
                        {isTeacher ? `Dr. Bhavana's Work Schedule` : 'Second Semester Student Timetable'}
                    </p>
                </div>

                <div className="current-time" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    padding: '10px 18px',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                }}>
                    <Clock size={16} color="#6366f1" />
                    <span style={{ color: '#ffffff' }}>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                </div>
            </div>

            {/* Tab Launcher Bar & Add Action */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div className="tt-tab-bar" style={{
                    display: 'flex',
                    gap: '6px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '12px',
                    padding: '6px',
                    width: 'fit-content'
                }}>
                    {['SCHOOL', 'PERSONAL', 'TODO'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '8px 20px',
                                border: 'none',
                                background: activeTab === tab ? '#6366f1' : 'transparent',
                                color: activeTab === tab ? '#ffffff' : '#94a3b8',
                                fontWeight: activeTab === tab ? '700' : '600',
                                cursor: 'pointer',
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                letterSpacing: '0.5px',
                                boxShadow: activeTab === tab ? '0 4px 12px rgba(99, 102, 241, 0.25)' : 'none',
                                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                                textTransform: 'uppercase'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {activeTab === 'SCHOOL' && (
                    <button
                        onClick={() => setShowSlotForm(!showSlotForm)}
                        className="login-btn"
                        style={{
                            width: 'auto',
                            padding: '10px 22px',
                            borderRadius: '12px',
                            fontSize: '0.85rem',
                            fontWeight: '700',
                            letterSpacing: '0.5px',
                            background: showSlotForm ? 'rgba(239, 68, 68, 0.15)' : 'linear-gradient(90deg, #6366f1, #4f46e5)',
                            color: showSlotForm ? '#f87171' : '#ffffff',
                            border: showSlotForm ? '1px solid rgba(239, 68, 68, 0.3)' : 'none',
                            boxShadow: showSlotForm ? 'none' : '0 4px 15px rgba(99, 102, 241, 0.25)'
                        }}
                    >
                        {showSlotForm ? 'Cancel' : 'Add Class Slot'}
                    </button>
                )}
            </div>

            {activeTab === 'SCHOOL' && (
                <>
                    {/* Add Slot Form Panel */}
                    {showSlotForm && (
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            borderRadius: '16px',
                            padding: '24px',
                            marginBottom: '2rem',
                            animation: 'slideUpEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}>
                            <h3 style={{ margin: '0 0 1.5rem 0', color: '#ffffff', fontSize: '1.1rem', fontWeight: 700 }}>Add New Timetable Class Slot</h3>
                            <form onSubmit={handleAddSlot} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', alignItems: 'end' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>Day of Week</label>
                                    <select
                                        value={newSlot.day}
                                        onChange={(e) => setNewSlot(prev => ({ ...prev, day: e.target.value }))}
                                        className="filter-select"
                                        style={{ width: '100%', cursor: 'pointer' }}
                                    >
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>Start Period</label>
                                    <select
                                        value={newSlot.period}
                                        onChange={(e) => setNewSlot(prev => ({ ...prev, period: parseInt(e.target.value) }))}
                                        className="filter-select"
                                        style={{ width: '100%', cursor: 'pointer' }}
                                    >
                                        {[1, 2, 3, 4, 5, 6].map(p => (
                                            <option key={p} value={p}>Period {p}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>Duration (Periods)</label>
                                    <select
                                        value={newSlot.span}
                                        onChange={(e) => setNewSlot(prev => ({ ...prev, span: parseInt(e.target.value) }))}
                                        className="filter-select"
                                        style={{ width: '100%', cursor: 'pointer' }}
                                    >
                                        <option value={1}>1 Period</option>
                                        <option value={2}>2 Periods (Lab)</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>Course Subject Code</label>
                                    <input
                                        value={newSlot.subject}
                                        onChange={(e) => setNewSlot(prev => ({ ...prev, subject: e.target.value }))}
                                        placeholder="e.g. CSE-H, ECE-A"
                                        className="filter-select"
                                        style={{ width: '100%', cursor: 'text' }}
                                        required
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>Session Type</label>
                                    <select
                                        value={newSlot.type}
                                        onChange={(e) => setNewSlot(prev => ({ ...prev, type: e.target.value }))}
                                        className="filter-select"
                                        style={{ width: '100%', cursor: 'pointer' }}
                                    >
                                        <option value="Lecture">Lecture</option>
                                        <option value="Lab">Lab</option>
                                        <option value="Tutorial">Tutorial</option>
                                    </select>
                                </div>
                                <button type="submit" className="login-btn" style={{ width: '100%', padding: '10px', height: '42px', borderRadius: '8px' }}>
                                    Save Slot
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Excel-like Table */}
                    <div className="tt-table-wrapper">
                        <table className="tt-excel-table">
                            <thead>
                                <tr>
                                    {/* Corner */}
                                    <th className="tt-corner-header">DAY</th>
                                    {/* Period 1, 2 */}
                                    <th className="tt-period-header">1</th>
                                    <th className="tt-period-header">2</th>
                                    {/* Break */}
                                    <th className="tt-separator-header" style={{ width: '28px' }}></th>
                                    {/* Period 3, 4 */}
                                    <th className="tt-period-header">3</th>
                                    <th className="tt-period-header">4</th>
                                    {/* Lunch */}
                                    <th className="tt-separator-header" style={{ width: '28px' }}></th>
                                    {/* Period 5, 6 */}
                                    <th className="tt-period-header">5</th>
                                    <th className="tt-period-header">6</th>
                                </tr>
                            </thead>
                            <tbody>
                                {timetableState.schedule.map((dayObj, rowIdx) => {
                                    const isToday = dayObj.day === todayName;
                                    const consumed = getConsumedPeriods(dayObj);
                                    const lookup = dayLookup[dayObj.day];

                                    const renderPeriodCells = (periodList) => {
                                        const cells = [];
                                        for (const p of periodList) {
                                            if (consumed.has(p)) continue; // skip, already merged
                                            const slot = lookup[p];
                                            if (!slot) {
                                                cells.push(
                                                    <td key={p} className="tt-cell tt-empty">
                                                        <span className="tt-empty-dash">—</span>
                                                    </td>
                                                );
                                            } else {
                                                let colors = defaultColors;
                                                const subName = slot.subject.toUpperCase();
                                                const matchedKey = Object.keys(subjectColors).find(key => subName.includes(key));
                                                if (matchedKey) {
                                                    colors = subjectColors[matchedKey];
                                                }

                                                cells.push(
                                                    <td
                                                        key={p}
                                                        className="tt-cell tt-filled"
                                                        colSpan={slot.span}
                                                        style={{ padding: '4px' }}
                                                    >
                                                        <div
                                                            className="tt-card"
                                                            style={{
                                                                borderLeft: `4px solid ${colors.border}`,
                                                                background: colors.bg,
                                                                borderColor: colors.borderTint
                                                            }}
                                                        >
                                                            <span className="tt-subject">{slot.subject}</span>
                                                            <span className="tt-type" style={{ color: colors.text, background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                                                {slot.type}
                                                            </span>
                                                        </div>
                                                    </td>
                                                );
                                            }
                                        }
                                        return cells;
                                    };

                                    return (
                                        <tr key={dayObj.day} className={`tt-row ${isToday ? 'tt-today-row' : ''}`} style={{ animationDelay: `${rowIdx * 80}ms` }}>
                                            {/* Day label */}
                                            <td className={`tt-day-cell ${isToday ? 'tt-today' : ''}`}>
                                                <span className="tt-day-label">{dayObj.day.toUpperCase()}</span>
                                                {isToday && <span className="tt-today-badge">TODAY</span>}
                                            </td>

                                            {/* Periods 1-2 */}
                                            {renderPeriodCells([1, 2])}

                                            {/* BREAK separator */}
                                            <td className="tt-separator-cell tt-break">
                                                <span>{breakLetters[rowIdx] || ''}</span>
                                            </td>

                                            {/* Periods 3-4 */}
                                            {renderPeriodCells([3, 4])}

                                            {/* LUNCH separator */}
                                            <td className="tt-separator-cell tt-lunch">
                                                <span>{lunchLetters[rowIdx] || ''}</span>
                                            </td>

                                            {/* Periods 5-6 */}
                                            {renderPeriodCells([5, 6])}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <style>{`
                        .timetable-container {
                            width: 100%;
                            padding: 0 !important;
                            max-width: none !important;
                            height: auto !important;
                            overflow: visible !important;
                            display: block !important;
                        }
                        .tt-table-wrapper {
                            margin: 0;
                            width: 100%;
                            background: rgba(255, 255, 255, 0.01);
                            border: 1px solid rgba(255, 255, 255, 0.08);
                            border-radius: 16px;
                            overflow: hidden;
                            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                        }
                        .tt-excel-table {
                            width: 100%;
                            border-collapse: collapse;
                            table-layout: fixed;
                        }
                        .tt-corner-header, .tt-period-header {
                            background: rgba(255, 255, 255, 0.02) !important;
                            color: #94a3b8 !important;
                            border: 1px solid rgba(255, 255, 255, 0.08) !important;
                            padding: 16px 8px !important;
                            font-size: 0.75rem;
                            font-weight: 600 !important;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            text-align: center !important;
                        }
                        .tt-day-cell {
                            background: rgba(255, 255, 255, 0.01) !important;
                            color: #ffffff !important;
                            border: 1px solid rgba(255, 255, 255, 0.08) !important;
                            padding: 12px 6px !important;
                            font-size: 0.8rem;
                            font-weight: 700;
                            vertical-align: middle !important;
                            text-align: center !important;
                            height: 64px;
                            text-transform: uppercase;
                        }
                        .tt-cell {
                            height: 64px;
                            border: 1px solid rgba(255, 255, 255, 0.08) !important;
                            vertical-align: middle !important;
                        }
                        .tt-card {
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: flex-start;
                            padding: 6px 12px;
                            margin: 2px;
                            background: rgba(255, 255, 255, 0.02);
                            border: 1px solid rgba(255, 255, 255, 0.04);
                            border-radius: 8px;
                            height: calc(100% - 4px);
                            text-align: left;
                            transition: all 0.2s ease;
                            cursor: default;
                        }
                        .tt-card:hover {
                            filter: brightness(1.2);
                            transform: translateY(-1.5px);
                            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                        }
                        .tt-subject {
                            font-size: 0.95rem;
                            font-weight: 700;
                            color: #ffffff;
                            line-height: 1.2;
                        }
                        .tt-type {
                            font-size: 0.65rem;
                            font-weight: 700;
                            padding: 2px 6px;
                            border-radius: 4px;
                            margin-top: 4px;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                        }
                        .tt-empty {
                            vertical-align: middle !important;
                            text-align: center !important;
                        }
                        .tt-empty-dash {
                            font-size: 1.1rem;
                            color: rgba(255, 255, 255, 0.1);
                        }
                        .tt-separator-cell {
                            background: rgba(255, 255, 255, 0.015) !important;
                            color: #64748b !important;
                            font-weight: 700 !important;
                            width: 28px;
                            border: 1px solid rgba(255, 255, 255, 0.08) !important;
                            font-size: 0.75rem;
                            vertical-align: middle !important;
                            text-align: center !important;
                            letter-spacing: 0.5px;
                            line-height: 1.4;
                        }
                        .tt-today-row .tt-day-cell {
                            background: rgba(99, 102, 241, 0.04) !important;
                            border-left: 3px solid #6366f1 !important;
                        }
                        .tt-today-badge {
                            display: block;
                            font-size: 0.6rem;
                            background: rgba(99, 102, 241, 0.2);
                            color: #818cf8;
                            padding: 2px 6px;
                            border-radius: 4px;
                            margin-top: 4px;
                            width: fit-content;
                            margin-left: auto;
                            margin-right: auto;
                        }
                        .tt-legend {
                            display: flex;
                            flex-wrap: wrap;
                            gap: 8px 16px;
                            margin-top: 1.5rem;
                            padding: 1rem;
                            background: rgba(255, 255, 255, 0.01);
                            border: 1px solid rgba(255, 255, 255, 0.06);
                            border-radius: 12px;
                        }
                        .tt-legend-item {
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            font-size: 0.75rem;
                            font-weight: 600;
                            color: #94a3b8;
                            text-transform: uppercase;
                        }
                        .tt-legend-dot {
                            width: 10px;
                            height: 10px;
                            border-radius: 3px;
                        }
                        .exams-section {
                            margin-top: 2.5rem !important;
                        }
                        .exams-grid {
                            display: grid;
                            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                            gap: 1.25rem !important;
                        }
                        .exam-card {
                            background: rgba(255, 255, 255, 0.01);
                            border: 1px solid rgba(255, 255, 255, 0.06);
                            border-radius: 12px;
                            padding: 16px !important;
                            display: flex;
                            align-items: center;
                            gap: 14px;
                            transition: all 0.2s ease;
                        }
                        .exam-card:hover {
                            border-color: rgba(99, 102, 241, 0.25);
                            transform: translateY(-2px);
                        }
                    `}</style>

                    {/* Upcoming Exams */}
                    <div className="exams-section" style={{ marginTop: '3rem' }}>
                        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem', color: '#ffffff' }}>
                            <AlertTriangle size={22} color="#fbbf24" /> Upcoming Exams
                        </h2>
                        <div className="exams-grid">
                            {timetableState.exams.map((exam, i) => (
                                <div key={i} className="exam-card">
                                    <Calendar size={20} color="#6366f1" />
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#ffffff' }}>{exam.subject}</h4>
                                        <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>{exam.type} — {exam.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'PERSONAL' && (
                <div className="personal-notes-grid animate-enter" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {personalNotes.map(note => (
                        <div key={note.id} className="note-card card" style={{ borderLeft: `4px solid ${note.color}` }}>
                            <h4 style={{ marginBottom: '10px', color: '#ffffff' }}>{note.title}</h4>
                            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', whiteSpace: 'pre-line' }}>{note.content}</p>
                            <small style={{ marginTop: '15px', display: 'block', color: '#64748b' }}>Updated {note.updatedAt}</small>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'TODO' && (
                <div className="todo-list-container animate-enter" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    
                    {/* Add Todo Form Panel */}
                    <form onSubmit={handleAddTodo} style={{
                        display: 'flex',
                        gap: '0.75rem',
                        marginBottom: '2rem',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        padding: '12px',
                        borderRadius: '16px',
                        flexWrap: 'wrap'
                    }}>
                        <input
                            value={newTodoText}
                            onChange={(e) => setNewTodoText(e.target.value)}
                            placeholder="Add a new task..."
                            className="filter-select"
                            style={{ flex: 1, cursor: 'text', minWidth: '200px' }}
                            required
                        />
                        <select
                            value={newTodoPriority}
                            onChange={(e) => setNewTodoPriority(e.target.value)}
                            className="filter-select"
                            style={{ width: '120px', cursor: 'pointer' }}
                        >
                            <option value="low">LOW</option>
                            <option value="medium">MEDIUM</option>
                            <option value="high">HIGH</option>
                        </select>
                        <button type="submit" className="login-btn" style={{ width: 'auto', padding: '10px 20px', borderRadius: '8px' }}>
                            Add Task
                        </button>
                    </form>

                    {/* Todo List */}
                    {todos.map(todo => (
                        <div key={todo.id} className="todo-item card" 
                            onClick={() => toggleTodo(todo.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                marginBottom: '1rem',
                                opacity: todo.done ? 0.6 : 1,
                                textDecoration: todo.done ? 'line-through' : 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{
                                width: '20px',
                                height: '20px',
                                border: '2px solid rgba(255, 255, 255, 0.15)',
                                borderRadius: '6px',
                                background: todo.done ? '#6366f1' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {todo.done && <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.75rem' }}>✓</span>}
                            </div>
                            <span style={{ fontSize: '1rem', flex: 1, color: '#cbd5e1' }}>{todo.text}</span>
                            <span className={`priority-tag ${todo.priority}`} style={{
                                fontSize: '0.65rem',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                background: todo.priority === 'high' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                                color: todo.priority === 'high' ? '#f87171' : '#94a3b8',
                                fontWeight: 700
                            }}>{todo.priority.toUpperCase()}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Timetable;
