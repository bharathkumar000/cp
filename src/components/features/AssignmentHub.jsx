"use client";
import React, { useState } from 'react';
import { mockBackend } from '../../services/mockBackend';
import { 
    Calendar, CheckCircle2, Clock, AlertCircle, 
    BookOpen, Sparkles, Filter, Plus, X, GraduationCap, ClipboardList, BookOpenCheck 
} from 'lucide-react';
import './FeatureStyles.css';
import { useAuth } from '../../context/AuthContext';

const AssignmentHub = () => {
    const { user } = useAuth();
    const [filter, setFilter] = useState('All');
    const [homework, setHomework] = useState(mockBackend.homework || []);
    
    // Teacher states
    const initialTeacherAssignments = [
        {
            id: 'ta-1',
            classTarget: 'ECE - Section A',
            subject: 'Engineering Mathematics-II',
            title: "Complete Lagrange's Theorem (4 Questions)",
            dueDate: 'Tomorrow',
            priority: 'High',
            submissions: '18 / 42',
            status: 'Active',
            instructions: 'Solve questions 1-4 on Lagrange Mean Value Theorem from the prescribed textbook and submit steps in PDF format.'
        },
        {
            id: 'ta-2',
            classTarget: 'CSE - Section B',
            subject: 'Linear Algebra',
            title: 'Fourier Transform Practice Sheet',
            dueDate: 'Friday',
            priority: 'Medium',
            submissions: '25 / 60',
            status: 'Active',
            instructions: 'Solve all the 5 problems on Fourier Transform and Dirichlet conditions.'
        },
        {
            id: 'ta-3',
            classTarget: 'AIML - Section A',
            subject: 'Probability & Statistics',
            title: 'Bayes Theorem Practice Problems',
            dueDate: 'Last Week',
            priority: 'Low',
            submissions: '38 / 38',
            status: 'Graded',
            instructions: 'Solve Bayes theorem problems on disease prediction and spam email filtering.'
        }
    ];

    const [teacherAssignments, setTeacherAssignments] = useState(initialTeacherAssignments);
    const [showTeacherModal, setShowTeacherModal] = useState(false);
    const [targetClass, setTargetClass] = useState('ECE - Section A');
    const [hwTitle, setHwTitle] = useState('');
    const [hwDueDate, setHwDueDate] = useState('');
    const [hwPriority, setHwPriority] = useState('Medium');
    const [hwInstructions, setHwInstructions] = useState('');

    const TEACHER_CLASSES = [
        { code: 'MAT-ECE-A', name: 'ECE - Section A', subject: 'Engineering Mathematics-II', students: 42, term: 'Sem 4' },
        { code: 'MAT-CSE-B', name: 'CSE - Section B', subject: 'Linear Algebra', students: 60, term: 'Sem 4' },
        { code: 'MAT-AIML-A', name: 'AIML - Section A', subject: 'Probability & Statistics', students: 38, term: 'Sem 6' },
        { code: 'MAT-EEE-A', name: 'EEE - Section A', subject: 'Advanced Calculus', students: 35, term: 'Sem 2' },
        { code: 'MAT-ME-B', name: 'ME - Section B', subject: 'Differential Equations', students: 45, term: 'Sem 4' },
        { code: 'MAT-CV-A', name: 'CV - Section A', subject: 'Numerical Methods', students: 30, term: 'Sem 6' }
    ];

    // Student Modal states
    const [showModal, setShowModal] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newSubject, setNewSubject] = useState('');
    const [newPriority, setNewPriority] = useState('Medium');
    const [newDueDate, setNewDueDate] = useState('');

    const filteredHomework = homework.filter(hw => 
        filter === 'All' ? true : hw.status === filter
    );

    const getPriorityColor = (priority) => {
        switch(priority.toLowerCase()) {
            case 'high': return 'var(--error)';
            case 'medium': return 'var(--accent-action)';
            case 'low': return 'var(--success)';
            default: return 'var(--text-secondary)';
        }
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTitle.trim() || !newSubject.trim() || !newDueDate) {
            return;
        }

        const newTask = {
            id: `hw-${Date.now()}`,
            subject: newSubject.trim(),
            title: newTitle.trim(),
            dueDate: newDueDate,
            priority: newPriority,
            status: 'Pending'
        };

        const updated = [newTask, ...homework];
        setHomework(updated);

        if (mockBackend.homework) {
            mockBackend.homework.unshift(newTask);
        }

        // Reset
        setNewTitle('');
        setNewSubject('');
        setNewPriority('Medium');
        setNewDueDate('');
        setShowModal(false);
    };

    const handleTeacherDispatch = (e) => {
        e.preventDefault();
        if (!hwTitle.trim() || !hwDueDate || !targetClass) return;

        const matchedClass = TEACHER_CLASSES.find(c => c.name === targetClass);

        const newHw = {
            id: `ta-${Date.now()}`,
            classTarget: targetClass,
            subject: matchedClass ? matchedClass.subject : 'Mathematics',
            title: hwTitle.trim(),
            dueDate: hwDueDate,
            priority: hwPriority,
            submissions: `0 / ${matchedClass ? matchedClass.students : 40}`,
            status: 'Active',
            instructions: hwInstructions.trim()
        };

        setTeacherAssignments([newHw, ...teacherAssignments]);

        // Clear states
        setHwTitle('');
        setHwDueDate('');
        setHwPriority('Medium');
        setHwInstructions('');
        setShowTeacherModal(false);
    };

    const toggleStatus = (id) => {
        const updated = homework.map(hw => {
            if (hw.id === id) {
                const nextStatus = hw.status === 'Completed' ? 'Pending' : 'Completed';
                return { ...hw, status: nextStatus };
            }
            return hw;
        });
        setHomework(updated);
        
        if (mockBackend.homework) {
            const item = mockBackend.homework.find(hw => hw.id === id);
            if (item) {
                item.status = item.status === 'Completed' ? 'Pending' : 'Completed';
            }
        }
    };

    // TEACHER VIEW RENDER
    if (user?.role === 'teacher') {
        return (
            <div className="feature-container" style={{ color: '#fff' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                            Dr. Bhavana's Assignment Control <Sparkles size={22} color="#fbbf24" />
                        </h2>
                        <p style={{ color: '#888', margin: '4px 0 0 0', fontSize: '0.95rem' }}>Create, dispatch, and monitor coursework and homework for active engineering sections.</p>
                    </div>
                    <button className="add-task-btn" style={{ margin: 0, padding: '12px 24px', background: '#fbbf24', color: '#000', border: 'none', fontWeight: 'bold' }} onClick={() => setShowTeacherModal(true)}>
                        <Plus size={18} /> Dispatch Homework
                    </button>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    <div style={{ background: '#111', border: '2px solid #333', padding: '1.5rem', borderRadius: '12px' }}>
                        <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#888', textTransform: 'uppercase' }}>Active Assignments</span>
                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fbbf24', marginTop: '6px' }}>
                            {teacherAssignments.filter(a => a.status === 'Active').length}
                        </div>
                    </div>
                    <div style={{ background: '#111', border: '2px solid #333', padding: '1.5rem', borderRadius: '12px' }}>
                        <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#888', textTransform: 'uppercase' }}>Classes Managed</span>
                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#60a5fa', marginTop: '6px' }}>6 Sections</div>
                    </div>
                    <div style={{ background: '#111', border: '2px solid #333', padding: '1.5rem', borderRadius: '12px' }}>
                        <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#888', textTransform: 'uppercase' }}>Total Students</span>
                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#34d399', marginTop: '6px' }}>250</div>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2.5rem', alignItems: 'start' }}>
                    
                    {/* Left Column: Dispatched homework tracker */}
                    <div style={{ background: '#111', border: '3px solid #fff', padding: '2rem', borderRadius: '12px', boxShadow: '10px 10px 0px rgba(255,255,255,0.05)' }}>
                        <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.3rem', fontWeight: 900, borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                            Dispatched Homework Tracker
                        </h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {teacherAssignments.map(a => (
                                <div key={a.id} style={{ background: '#000', border: '1px solid #333', borderRadius: '8px', padding: '1.25rem', position: 'relative' }}>
                                    <span style={{ 
                                        position: 'absolute', 
                                        top: '12px', 
                                        right: '12px', 
                                        fontSize: '0.65rem', 
                                        fontWeight: 'bold', 
                                        padding: '3px 8px', 
                                        borderRadius: '4px',
                                        background: a.priority === 'High' ? 'rgba(239, 68, 68, 0.1)' : (a.priority === 'Medium' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)'),
                                        color: a.priority === 'High' ? '#ef4444' : (a.priority === 'Medium' ? '#f59e0b' : '#10b981'),
                                        border: a.priority === 'High' ? '1px solid #ef4444' : (a.priority === 'Medium' ? '1px solid #f59e0b' : '1px solid #10b981')
                                    }}>
                                        {a.priority} Priority
                                    </span>

                                    <div style={{ fontWeight: 800, color: '#fbbf24', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                                        {a.classTarget} • {a.subject}
                                    </div>
                                    <h4 style={{ margin: '8px 0', fontSize: '1.1rem', fontWeight: 900 }}>{a.title}</h4>
                                    <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: '#aaa', lineHeight: 1.4 }}>{a.instructions}</p>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #222', paddingTop: '10px', fontSize: '0.8rem', color: '#666' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Calendar size={14} />
                                            <span>Due: {a.dueDate}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24', fontWeight: 'bold' }}>
                                            <BookOpenCheck size={14} />
                                            <span>Submissions: {a.submissions}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Classes Taken by Dr. Bhavana */}
                    <div style={{ background: '#111', border: '3px solid #fff', padding: '2rem', borderRadius: '12px', boxShadow: '10px 10px 0px rgba(255,255,255,0.05)' }}>
                        <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.3rem', fontWeight: 900, borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                            Your Classes / Lectures
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {TEACHER_CLASSES.map(cls => (
                                <div key={cls.code} style={{ background: '#000', border: '1px solid #222', borderRadius: '8px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ margin: 0, fontWeight: 900, fontSize: '0.95rem', color: '#fff' }}>{cls.name}</h4>
                                        <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 'bold' }}>{cls.subject}</span>
                                        <div style={{ fontSize: '0.7rem', color: '#555', marginTop: '4px' }}>{cls.term}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: 900, color: '#60a5fa' }}>{cls.students}</span>
                                        <span style={{ fontSize: '0.65rem', color: '#666', textTransform: 'uppercase', fontWeight: 'bold' }}>Students</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Dispatch HW Modal */}
                {showTeacherModal && (
                    <div className="hub-modal-backdrop" style={{ display: 'flex', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }} onClick={() => setShowTeacherModal(false)}>
                        <div className="hub-modal-dialog" style={{ background: '#09090b', border: '1px solid #27272a', borderRadius: 12, width: '100%', maxWidth: '480px', padding: '20px' }} onClick={e => e.stopPropagation()}>
                            <div className="hub-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #27272a', paddingBottom: '10px' }}>
                                <span style={{ fontWeight: 800, color: '#fff', fontSize: '1.1rem' }}>Dispatch Homework Assignment</span>
                                <button style={{ background: 'none', border: 'none', color: '#888', fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => setShowTeacherModal(false)}>×</button>
                            </div>
                            <form onSubmit={handleTeacherDispatch} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#aaa', textTransform: 'uppercase' }}>Target Class / Section</label>
                                    <select 
                                        style={{ width: '100%', background: '#000', border: '2px solid #333', color: '#fff', padding: '10px', borderRadius: '6px', fontSize: '0.9rem', outline: 'none' }}
                                        value={targetClass}
                                        onChange={e => setTargetClass(e.target.value)}
                                    >
                                        {TEACHER_CLASSES.map(c => (
                                            <option key={c.code} value={c.name}>{c.name} — {c.subject}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#aaa', textTransform: 'uppercase' }}>Homework Title / Topic</label>
                                    <input 
                                        type="text" 
                                        style={{ width: '100%', background: '#000', border: '2px solid #333', color: '#fff', padding: '10px', borderRadius: '6px', fontSize: '0.9rem', outline: 'none' }}
                                        placeholder="e.g. Complete Lagrange's Theorem (4 Questions)"
                                        value={hwTitle}
                                        onChange={e => setHwTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#aaa', textTransform: 'uppercase' }}>Due Date</label>
                                    <input 
                                        type="text" 
                                        style={{ width: '100%', background: '#000', border: '2px solid #333', color: '#fff', padding: '10px', borderRadius: '6px', fontSize: '0.9rem', outline: 'none' }}
                                        placeholder="e.g. Tomorrow, or Friday"
                                        value={hwDueDate}
                                        onChange={e => setHwDueDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#aaa', textTransform: 'uppercase' }}>Priority Level</label>
                                    <select 
                                        style={{ width: '100%', background: '#000', border: '2px solid #333', color: '#fff', padding: '10px', borderRadius: '6px', fontSize: '0.9rem', outline: 'none' }}
                                        value={hwPriority}
                                        onChange={e => setHwPriority(e.target.value)}
                                    >
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#aaa', textTransform: 'uppercase' }}>Instructions / Details</label>
                                    <textarea 
                                        style={{ width: '100%', minHeight: '80px', background: '#000', border: '2px solid #333', color: '#fff', padding: '10px', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', resize: 'vertical' }}
                                        placeholder="Solve Lagrange mean value theorem questions 1-4..."
                                        value={hwInstructions}
                                        onChange={e => setHwInstructions(e.target.value)}
                                    />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1rem' }}>
                                    <button type="button" className="hub-btn hub-btn-secondary" style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #333', color: '#fff', borderRadius: '6px', cursor: 'pointer' }} onClick={() => setShowTeacherModal(false)}>CANCEL</button>
                                    <button type="submit" className="hub-btn hub-btn-primary" style={{ padding: '8px 16px', background: '#fbbf24', border: 'none', color: '#000', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer' }}>DISPATCH</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="feature-container">
            <div className="feature-header">
                <div className="header-text">
                    <h3>Assignment Hub <Sparkles size={20} className="sparkle-icon" /></h3>
                    <p>Track your assignments and deadlines in real-time.</p>
                </div>
                <div className="header-actions">
                    <div className="filter-pills">
                        {['ALL', 'PENDING', 'COMPLETED'].map(f => (
                            <button 
                                key={f} 
                                className={`pill ${filter === f.charAt(0) + f.slice(1).toLowerCase() || filter === f ? 'active' : ''}`}
                                onClick={() => setFilter(f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase())}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <button className="add-task-btn" onClick={() => setShowModal(true)}>
                        <Plus size={18} /> New Task
                    </button>
                </div>
            </div>

            <div className="homework-grid">
                {filteredHomework.map(hw => (
                    <div key={hw.id} className={`hw-card ${hw.status.toLowerCase()}`}>
                        <div className="hw-status-indicator" style={{ background: getPriorityColor(hw.priority) }} />
                        <div className="hw-content">
                            <div className="hw-top">
                                <span className="hw-subject">{hw.subject}</span>
                                <span className="hw-priority" style={{ color: getPriorityColor(hw.priority) }}>
                                    {hw.priority} Priority
                                </span>
                            </div>
                            <h4 className="hw-title">{hw.title}</h4>
                            <div className="hw-footer">
                                <div className="hw-meta">
                                    <Calendar size={14} />
                                    <span>Due: {hw.dueDate}</span>
                                </div>
                                <div 
                                    className={`hw-badge ${hw.status.toLowerCase()}`}
                                    onClick={() => toggleStatus(hw.id)}
                                    style={{ cursor: 'pointer' }}
                                    title="Click to toggle status"
                                >
                                    {hw.status === 'Completed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                    {hw.status}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="stats-mini-grid">
                <div className="stat-box cyan">
                    <div className="stat-label">Completion Rate</div>
                    <div className="stat-value">
                        {homework.length > 0 
                            ? `${Math.round((homework.filter(h => h.status === 'Completed').length / homework.length) * 100)}%`
                            : '0%'
                        }
                    </div>
                </div>
                <div className="stat-box purple">
                    <div className="stat-label">Pending Units</div>
                    <div className="stat-value">
                        {homework.filter(h => h.status === 'Pending').length}
                    </div>
                </div>
                <div className="stat-box orange">
                    <div className="stat-label">Total Assignments</div>
                    <div className="stat-value">{homework.length}</div>
                </div>
            </div>

            {/* Modal Dialog for New Task */}
            {showModal && (
                <div className="hub-modal-backdrop" onClick={() => setShowModal(false)}>
                    <div className="hub-modal-dialog" onClick={(e) => e.stopPropagation()}>
                        <div className="hub-modal-header">
                            <h4 className="hub-modal-title">Establish New Assignment Task</h4>
                            <button className="hub-modal-close-btn" onClick={() => setShowModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddTask}>
                            <div className="hub-modal-body">
                                <div className="hub-form-group">
                                    <label>Task Title</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. PCB Design lab report"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        required 
                                    />
                                </div>
                                <div className="hub-form-group">
                                    <label>Subject / Topic</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Electronic Design"
                                        value={newSubject}
                                        onChange={(e) => setNewSubject(e.target.value)}
                                        required 
                                    />
                                </div>
                                <div className="hub-form-group">
                                    <label>Priority Level</label>
                                    <select 
                                        className="filter-select"
                                        value={newPriority}
                                        onChange={(e) => setNewPriority(e.target.value)}
                                        style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '12px' }}
                                    >
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>
                                <div className="hub-form-group">
                                    <label>Due Date</label>
                                    <input 
                                        type="text"
                                        placeholder="e.g. 20 March, Tomorrow, or Friday"
                                        value={newDueDate}
                                        onChange={(e) => setNewDueDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="hub-modal-footer">
                                <button type="button" className="hub-btn hub-btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="hub-btn hub-btn-primary">
                                    Add Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignmentHub;
