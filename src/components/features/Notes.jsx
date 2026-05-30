"use client";
import React, { useState } from 'react';
import { mockBackend } from '../../services/mockBackend';
import { FileText, Download, Folder, ChevronRight, Home, ArrowLeft, Star, FileQuestion } from 'lucide-react';
import './FeatureStyles.css';
import { useAuth } from '../../context/AuthContext';

const Notes = () => {
    const { user } = useAuth();
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedModule, setSelectedModule] = useState(null);
    const [viewType, setViewType] = useState('folders'); // 'folders', 'modules', 'notes', or 'pyqs'

    const { studyMaterials, pyqs } = mockBackend;
    const [localNotes, setLocalNotes] = useState(studyMaterials);
    const [uploadTitle, setUploadTitle] = useState('');
    const [uploadModule, setUploadModule] = useState(1);
    const [showUploadModal, setShowUploadModal] = useState(false);

    // Derived Data - include Mathematics in default subjects list
    const defaultSubjects = [...new Set([...studyMaterials.map(m => m.subject), ...pyqs.map(q => q.subject), 'Mathematics'])];
    const subjects = user?.role === 'teacher' ? ['Mathematics'] : defaultSubjects;
    const modules = [1, 2, 3, 4, 5];

    const filteredNotes = localNotes.filter(n => 
        n.subject === selectedSubject && n.module === selectedModule
    );

    const filteredPYQs = pyqs.filter(q => q.subject === selectedSubject);

    const handleBack = () => {
        if (viewType === 'notes') setViewType('modules');
        else if (viewType === 'pyqs' || viewType === 'modules') {
            setViewType('folders');
            setSelectedSubject(null);
        }
    };

    const handleSubjectSelect = (subject) => {
        setSelectedSubject(subject);
        setViewType('modules');
    };

    const handleUpload = (e) => {
        e.preventDefault();
        if (!uploadTitle.trim()) return;
        const newNote = {
            id: localNotes.length + 1,
            title: uploadTitle,
            type: 'PDF',
            author: user?.name || 'Dr. Bhavana',
            category: 'Teacher Note',
            verifiedBy: 'Self',
            subject: selectedSubject || 'Mathematics',
            module: Number(uploadModule)
        };
        setLocalNotes([newNote, ...localNotes]);
        setUploadTitle('');
        setShowUploadModal(false);
    };

    const renderBreadcrumbs = () => (
        <div className="folder-breadcrumbs">
            <button onClick={() => { setSelectedSubject(null); setViewType('folders'); }} className="breadcrumb-btn">
                <Home size={16} /> All Subjects
            </button>
            {selectedSubject && (
                <>
                    <ChevronRight size={16} className="divider" />
                    <button onClick={() => setViewType('modules')} className={`breadcrumb-btn ${viewType === 'modules' ? 'active' : ''}`}>
                        {selectedSubject}
                    </button>
                </>
            )}
            {viewType === 'notes' && (
                <>
                    <ChevronRight size={16} className="divider" />
                    <button className="breadcrumb-btn active">
                        Module {selectedModule}
                    </button>
                </>
            )}
            {viewType === 'pyqs' && (
                <>
                    <ChevronRight size={16} className="divider" />
                    <button className="breadcrumb-btn active">
                        PYQS
                    </button>
                </>
            )}
        </div>
    );

    const renderContent = () => {
        if (viewType === 'folders') {
            return (
                <div className="folder-grid">
                    {subjects.map(subject => (
                        <div key={subject} className="folder-card" onClick={() => handleSubjectSelect(subject)}>
                            <div className="folder-icon-wrapper">
                                <Folder size={64} className="folder-icon" fill="rgba(167, 139, 250, 0.2)" />
                            </div>
                            <span className="folder-name">{subject}</span>
                        </div>
                    ))}
                </div>
            );
        }

        if (viewType === 'modules') {
            return (
                <div className="folder-structure-view">
                    <div className="folder-grid">
                        {/* Special folder for PYQS of this subject */}
                        <div className="folder-card pyq-folder" onClick={() => setViewType('pyqs')}>
                            <div className="folder-icon-wrapper">
                                <Folder size={64} className="folder-icon" fill="rgba(248, 113, 113, 0.2)" />
                            </div>
                            <span className="folder-name">PYQS Collection</span>
                        </div>

                        {/* Module folders */}
                        {modules.map(mod => (
                            <div key={mod} className="folder-card module-folder" onClick={() => { setSelectedModule(mod); setViewType('notes'); }}>
                                <div className="folder-icon-wrapper">
                                    <Folder size={64} className="folder-icon" fill="rgba(251, 191, 36, 0.2)" />
                                </div>
                                <span className="folder-name">Module {mod}</span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (viewType === 'pyqs') {
            return (
                <div className="pyqs-list-view">
                    <div className="section-header">
                        <h3>Previous Year Questions - {selectedSubject}</h3>
                    </div>
                    <div className="pyq-grid">
                        {filteredPYQs.length > 0 ? (
                            filteredPYQs.map(q => (
                                <div key={q.id} className="pyq-card-v2">
                                    <div className="pyq-header">
                                        <div className="pyq-years">
                                            {q.yearsAsked.map(y => <span key={y} className="year-pill">{y}</span>)}
                                        </div>
                                    </div>
                                    <h3 className="pyq-question">{q.question}</h3>
                                    <button className="view-solution-btn">VIEW SOLUTION</button>
                                </div>
                            ))
                        ) : (
                            <div className="empty-folder-state">
                                <FileQuestion size={48} />
                                <p>No PYQs available for this subject yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        // notes view
        return (
            <div className="notes-list-view">
                <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
                    <h3>Files in {selectedSubject} - Module {selectedModule}</h3>
                    {user?.role === 'teacher' && (
                        <button 
                            className="add-task-btn" 
                            style={{ margin: 0, padding: '10px 20px', fontSize: '0.85rem' }}
                            onClick={() => {
                                setUploadModule(selectedModule);
                                setShowUploadModal(true);
                            }}
                        >
                            📤 Upload Note
                        </button>
                    )}
                </div>

                {showUploadModal && user?.role === 'teacher' && (
                    <div className="hub-modal-backdrop" style={{ display: 'flex', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }} onClick={() => setShowUploadModal(false)}>
                        <div className="hub-modal-dialog" style={{ background: '#09090b', border: '1px solid #27272a', borderRadius: 12, width: '100%', maxWidth: '440px', padding: '20px' }} onClick={e => e.stopPropagation()}>
                            <div className="hub-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #27272a', paddingBottom: '10px' }}>
                                <span className="hub-modal-title" style={{ fontWeight: 800, color: '#fff', fontSize: '1.1rem' }}>Upload Mathematics Note</span>
                                <button className="hub-modal-close-btn" style={{ background: 'none', border: 'none', color: '#888', fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => setShowUploadModal(false)}>×</button>
                            </div>
                            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div className="hub-form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#aaa', textTransform: 'uppercase' }}>Note Title</label>
                                    <input 
                                        type="text" 
                                        style={{ width: '100%', background: '#000', border: '2px solid #333', color: '#fff', padding: '10px', borderRadius: '6px', fontSize: '0.9rem', outline: 'none' }}
                                        placeholder="e.g. Fourier Series Derivations"
                                        value={uploadTitle}
                                        onChange={e => setUploadTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="hub-form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#aaa', textTransform: 'uppercase' }}>Module</label>
                                    <select 
                                        style={{ width: '100%', background: '#000', border: '2px solid #333', color: '#fff', padding: '10px', borderRadius: '6px', fontSize: '0.9rem', outline: 'none' }}
                                        value={uploadModule}
                                        onChange={e => setUploadModule(Number(e.target.value))}
                                    >
                                        <option value={1}>Module 1</option>
                                        <option value={2}>Module 2</option>
                                        <option value={3}>Module 3</option>
                                        <option value={4}>Module 4</option>
                                        <option value={5}>Module 5</option>
                                    </select>
                                </div>
                                <div className="hub-modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1rem' }}>
                                    <button type="button" className="hub-btn hub-btn-secondary" style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #333', color: '#fff', borderRadius: '6px', cursor: 'pointer' }} onClick={() => setShowUploadModal(false)}>CANCEL</button>
                                    <button type="submit" className="hub-btn hub-btn-primary" style={{ padding: '8px 16px', background: '#fbbf24', border: 'none', color: '#000', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer' }}>UPLOAD</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="papers-grid">
                    {filteredNotes.length > 0 ? (
                        filteredNotes.map(item => (
                            <div key={item.id} className="paper-card note-file-card">
                                <div className="paper-icon">
                                    <FileText size={32} color={item.category === 'Teacher Note' ? '#a78bfa' : '#fbbf24'} />
                                </div>
                                <div className="paper-info">
                                    <h3>{item.title}</h3>
                                    <div className="meta">
                                        <span>BY {item.author.toUpperCase()}</span>
                                        {item.category === 'Best Student Note' && (
                                            <span className="verified-tag">VERIFIED BY {item.verifiedBy.toUpperCase()}</span>
                                        )}
                                    </div>
                                </div>
                                <button className="download-btn">
                                    <Download size={16} /> DOWNLOAD
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="empty-folder-state">
                            <FileQuestion size={48} />
                            <p>No notes uploaded for this module yet.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="notes-page-container">
            <div className="notes-header">
                <div className="notes-title-section">
                    <div className="yellow-title-box">
                        <h1>NOTES & PYQS</h1>
                    </div>
                </div>
            </div>

            <div className="notes-view-content">
                <div className="notes-folder-view">
                    <div className="folder-nav-bar">
                        {viewType !== 'folders' && (
                            <button className="back-nav-btn" onClick={handleBack}>
                                <ArrowLeft size={18} /> BACK
                            </button>
                        )}
                        {renderBreadcrumbs()}
                    </div>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};



export default Notes;
