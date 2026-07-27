"use client";
import React, { useState } from 'react';
import { mockBackend } from '../../services/mockBackend';
import { FileText, Download, Folder, ChevronRight, Home, ArrowLeft, Star, FileQuestion, Mic, Volume2 } from 'lucide-react';
import './FeatureStyles.css';
import { useAuth } from '../../context/AuthContext';

const Notes = () => {
    const { user } = useAuth();
    let teacherSubject = 'C Programming';
    let teacherName = 'Demo Teacher';
    if (user?.role === 'teacher') {
        const nameLower = user?.name?.toLowerCase() || '';
        const emailVal = user?.email || '';
        if (nameLower.includes('bhavana') || emailVal === 'bhav@vvce') {
            teacherSubject = 'Mathematics';
            teacherName = 'Dr. Bhavana';
        } else if (nameLower.includes('demo teacher') || emailVal === '2') {
            teacherSubject = 'C Programming';
            teacherName = 'Demo Teacher';
        }
    }

    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedModule, setSelectedModule] = useState(null);
    const [viewType, setViewType] = useState('folders'); // 'folders', 'modules', 'notes', or 'pyqs'

    const { studyMaterials, pyqs } = mockBackend;
    const [localNotes, setLocalNotes] = useState(studyMaterials);
    const [uploadTitle, setUploadTitle] = useState('');
    const [uploadModule, setUploadModule] = useState(1);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    // Classroom Recording Terminal States (Bhavana)
    const [targetBranch, setTargetBranch] = useState('CSE');
    const [targetSection, setTargetSection] = useState('A');
    const [recordingState, setRecordingState] = useState('idle'); // 'idle', 'recording', 'processing', 'generated'
    const [recordingTime, setRecordingTime] = useState(0);
    const [timerId, setTimerId] = useState(null);
    const [summaryText, setSummaryText] = useState('');
    const [isEditingSummary, setIsEditingSummary] = useState(false);
    const [publishModule, setPublishModule] = useState(1);
    const [successMessage, setSuccessMessage] = useState('');

    const generatePdfBytes = async (text) => {
        try {
            // Import pdf-lib dynamically in the browser
            const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage([600, 800]);
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            
            const lines = text.split('\n');
            let y = 750;
            for (const line of lines) {
                if (y < 50) break; // page boundary
                page.drawText(line, {
                    x: 50,
                    y: y,
                    size: 11,
                    font: font,
                    color: rgb(0.1, 0.1, 0.1),
                });
                y -= 18;
            }
            
            const pdfBytes = await pdfDoc.save();
            return pdfBytes;
        } catch (e) {
            console.warn("[PDF GENERATOR WARNING] Client pdf-lib load failed:", e.message);
            // Return simple valid dummy PDF structure (%PDF-1.4 header)
            return new Uint8Array([37, 80, 68, 70, 45, 49, 46, 52, 10]);
        }
    };

    const startRecording = () => {
        setRecordingTime(0);
        setRecordingState('recording');
        setSuccessMessage('');
        const id = setInterval(() => {
            setRecordingTime(prev => prev + 1);
        }, 1000);
        setTimerId(id);
    };

    const stopRecording = () => {
        if (timerId) {
            clearInterval(timerId);
            setTimerId(null);
        }
        setRecordingState('processing');
        
        setTimeout(() => {
            const currentDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
            const subUpper = teacherSubject.toUpperCase();
            const courseText = teacherSubject === 'C Programming' 
                ? 'Course: 1BPLCO203 - Introduction to C Programming' 
                : 'Course: 1BMATE201 - Applied Mathematics - II';
            const topicText = teacherSubject === 'C Programming'
                ? `TOPIC DISCUSSED: Dynamic Memory Allocation & Pointers
- Discussed pointers, reference, and dereference operations.
- Covered dynamic memory allocation functions: malloc, calloc, realloc, and free.
- Analyzed memory leak scenarios and standard practices to avoid them.
- Solved previous year question on dynamic arrays.`
                : `TOPIC DISCUSSED: Binary Search Trees & Complexity Analysis
- Discussed BST properties: left child less than root, right child greater.
- Covered traversal algorithms: In-order, Pre-order, and Post-order tree walking.
- Analyzed time complexity: O(log n) for balanced tree operations vs O(n) worst-case.
- Solved previous year question on BST reconstruction from pre-order sequence.`;

            setSummaryText(`LECTURE SUMMARY & REPORT - ${subUpper} (${currentDate})
${courseText}
Branch & Section: ${targetBranch} - Section ${targetSection}
Date: ${currentDate}

${topicText}
- Practical assignment: Implement the exercise in lab.`);
            setRecordingState('generated');
        }, 2000);
    };

    const handleApproveAndPublish = async () => {
        const dateStr = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
        let filename = `${dateStr}.pdf`;
        let path = '';

        try {
            // Generate valid PDF bytes using pdf-lib in browser
            const pdfBytes = await generatePdfBytes(summaryText);
            const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
            const pdfFile = new File([pdfBlob], `${dateStr}.pdf`, { type: 'application/pdf' });

            const formData = new FormData();
            formData.append('file', pdfFile);

            const response = await fetch('/api/files/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                filename = data.filename || `${dateStr}.pdf`;
                path = data.path || '';
            } else {
                const errData = await response.json();
                console.warn(`[RECORDER BACKEND WARNING] Status ${response.status}: ${errData.message}`);
            }
        } catch (err) {
            console.warn("[RECORDER BACKEND OFFLINE/MOCK] Network fallback to local mock state:", err.message);
        }

        const newNote = {
            id: mockBackend.studyMaterials.length + 1,
            title: `${dateStr} - Lecture Notes (Class: ${targetBranch} - ${targetSection})`,
            type: 'PDF',
            author: teacherName,
            category: 'Teacher Note',
            verifiedBy: 'Self',
            subject: teacherSubject,
            module: Number(publishModule),
            file: filename,
            path: path
        };

        const newPyq = {
            id: mockBackend.pyqs.length + 1,
            question: `${dateStr}: Solve the BST traversal and time complexity analysis problem from the CSE lecture report.`,
            subject: teacherSubject,
            yearsAsked: [2026]
        };

        mockBackend.studyMaterials.push(newNote);
        mockBackend.pyqs.push(newPyq);
        setLocalNotes([...mockBackend.studyMaterials]);

        setRecordingState('idle');
        setSuccessMessage(`Lecture notes successfully approved and published as PDF notes under Module ${publishModule} and in the PYQ collection.`);
        setTimeout(() => setSuccessMessage(''), 8000);
    };

    // Derived Data - include Mathematics in default subjects list
    const defaultSubjects = [...new Set([...studyMaterials.map(m => m.subject), ...pyqs.map(q => q.subject), 'Mathematics', 'C Programming'])];
    const subjects = user?.role === 'teacher' ? [teacherSubject] : defaultSubjects;
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

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!uploadTitle.trim()) return;

        let filename = selectedFile ? selectedFile.name : 'Uploaded Note.pdf';
        let path = '';
        let uploadSuccess = false;

        if (selectedFile) {
            try {
                const formData = new FormData();
                formData.append('file', selectedFile);

                const response = await fetch('/api/files/upload', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const data = await response.json();
                    filename = data.filename || selectedFile.name;
                    path = data.path || '';
                    uploadSuccess = true;
                } else {
                    const errText = await response.text().catch(() => '');
                    let errMsg = 'Unknown error';
                    try {
                        const errData = JSON.parse(errText);
                        errMsg = errData.message || errMsg;
                    } catch (_) {}
                    console.warn(`[UPLOAD BACKEND WARNING] Status ${response.status}: ${errMsg}`);
                }
            } catch (err) {
                console.warn("[UPLOAD BACKEND OFFLINE/MOCK] Network fallback to local mock state:", err.message);
            }
        }

        const newNote = {
            id: mockBackend.studyMaterials.length + 1,
            title: uploadTitle,
            type: selectedFile ? (selectedFile.name.split('.').pop()?.toUpperCase() || 'PDF') : 'PDF',
            author: user?.name || teacherName,
            category: 'Teacher Note',
            verifiedBy: 'Self',
            subject: selectedSubject || teacherSubject,
            module: Number(uploadModule),
            file: filename,
            path: path
        };

        mockBackend.studyMaterials.push(newNote);
        setLocalNotes([...mockBackend.studyMaterials]);
        setUploadTitle('');
        setSelectedFile(null);
        setShowUploadModal(false);
        setSuccessMessage(`Note "${uploadTitle}" successfully uploaded${uploadSuccess ? ' (uploaded to server)' : ' (fallback to local mock)'}.`);
        setTimeout(() => setSuccessMessage(''), 8000);
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
                <div className="folder-structure-view" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* CSS Animations & Custom Styles for Voice/Audio terminal */}
                    <style>{`
                        .class-rec-grid {
                            display: grid;
                            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                            gap: 16px;
                            width: 100%;
                        }
                        .class-select-card {
                            background: #18181b;
                            border: 2px solid #27272a;
                            border-radius: 10px;
                            padding: 16px;
                            cursor: pointer;
                            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                            display: flex;
                            flex-direction: column;
                            gap: 8px;
                            position: relative;
                            overflow: hidden;
                            text-align: left;
                        }
                        .class-select-card:hover {
                            border-color: #fbbf24;
                            transform: translateY(-2px);
                            background: rgba(251, 191, 36, 0.03);
                        }
                        .class-select-card.active {
                            border-color: #fbbf24;
                            background: rgba(251, 191, 36, 0.05);
                            box-shadow: 0 0 15px rgba(251, 191, 36, 0.15);
                        }
                        .pulse-dot-online {
                            width: 8px;
                            height: 8px;
                            background-color: #10b981;
                            border-radius: 50%;
                            display: inline-block;
                            box-shadow: 0 0 8px #10b981;
                            animation: pulse-online 1.8s infinite;
                            margin-right: 6px;
                        }
                        @keyframes pulse-online {
                            0% { transform: scale(0.9); opacity: 0.6; }
                            50% { transform: scale(1.3); opacity: 1; }
                            100% { transform: scale(0.9); opacity: 0.6; }
                        }
                        .sound-wave-container {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 4px;
                            height: 40px;
                            margin: 10px 0;
                        }
                        .sound-bar {
                            width: 4px;
                            background-color: #fbbf24;
                            border-radius: 2px;
                            height: 10px;
                            animation: bounce-bar 1s ease-in-out infinite alternate;
                        }
                        .sound-bar:nth-child(2) { animation-delay: 0.15s; background-color: #f59e0b; }
                        .sound-bar:nth-child(3) { animation-delay: 0.3s; background-color: #a78bfa; height: 15px; }
                        .sound-bar:nth-child(4) { animation-delay: 0.45s; background-color: #f59e0b; }
                        .sound-bar:nth-child(5) { animation-delay: 0.6s; background-color: #fbbf24; }
                        @keyframes bounce-bar {
                            0% { height: 8px; }
                            100% { height: 35px; }
                        }
                        .rec-badge-red {
                            background: rgba(239, 68, 68, 0.2);
                            border: 1px solid #ef4444;
                            color: #f87171;
                            padding: 4px 10px;
                            border-radius: 6px;
                            font-size: 0.75rem;
                            font-weight: 800;
                            display: flex;
                            align-items: center;
                            gap: 6px;
                            animation: flash-red 1.5s infinite;
                        }
                        @keyframes flash-red {
                            0%, 100% { opacity: 1; }
                            50% { opacity: 0.5; }
                        }
                        .success-toast-banner {
                            background: rgba(16, 185, 129, 0.1);
                            border: 1px solid rgba(16, 185, 129, 0.3);
                            color: #34d399;
                            padding: 16px;
                            border-radius: 8px;
                            font-weight: 600;
                            font-size: 0.88rem;
                            display: flex;
                            align-items: center;
                            gap: 10px;
                            animation: enter-toast 0.3s ease-out;
                            text-align: left;
                        }
                        @keyframes enter-toast {
                            from { transform: translateY(-10px); opacity: 0; }
                            to { transform: translateY(0); opacity: 1; }
                        }
                    `}</style>

                    {/* Notification feedback */}
                    {successMessage && (
                        <div className="success-toast-banner">
                            <span className="pulse-dot-online"></span>
                            {successMessage}
                        </div>
                    )}

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
                                    <Folder size={64} className="folder-icon" fill="rgba(168, 85, 247, 0.2)" />
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
                                setUploadTitle('');
                                setSelectedFile(null);
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
                                <span className="hub-modal-title" style={{ fontWeight: 800, color: '#fff', fontSize: '1.1rem' }}>Upload {teacherSubject} Note</span>
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
                                <div className="hub-form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#aaa', textTransform: 'uppercase' }}>Document File</label>
                                    <div 
                                        style={{ 
                                            border: '2px dashed #333', 
                                            borderRadius: '6px', 
                                            padding: '20px', 
                                            textAlign: 'center', 
                                            background: '#040405',
                                            cursor: 'pointer',
                                            transition: 'border-color 0.2s',
                                            position: 'relative'
                                        }}
                                        onMouseOver={e => e.currentTarget.style.borderColor = '#a855f7'}
                                        onMouseOut={e => e.currentTarget.style.borderColor = '#333'}
                                        onClick={() => document.getElementById('file-upload-input').click()}
                                    >
                                        <input 
                                            id="file-upload-input"
                                            type="file" 
                                            accept=".pdf,.docx,.png,.jpg,.jpeg"
                                            style={{ display: 'none' }}
                                            onChange={e => {
                                                const file = e.target.files ? e.target.files[0] : null;
                                                setSelectedFile(file);
                                                if (file && !uploadTitle) {
                                                    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                                                    setUploadTitle(baseName);
                                                }
                                            }}
                                            required
                                        />
                                        <div style={{ color: selectedFile ? '#a855f7' : '#888', fontSize: '0.85rem', fontWeight: '500' }}>
                                            {selectedFile ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                                    <span style={{ fontSize: '1.5rem' }}>📄</span>
                                                    <span style={{ color: '#fff', fontWeight: 'bold', wordBreak: 'break-all' }}>{selectedFile.name}</span>
                                                    <span style={{ fontSize: '0.75rem', color: '#888' }}>({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                                    <span style={{ fontSize: '1.5rem' }}>📁</span>
                                                    <span>Click to choose file</span>
                                                    <span style={{ fontSize: '0.75rem', color: '#666' }}>PDF, DOCX, PNG, or JPG (Max 10MB)</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="hub-modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1rem' }}>
                                    <button type="button" className="hub-btn hub-btn-secondary" style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #333', color: '#fff', borderRadius: '6px', cursor: 'pointer' }} onClick={() => setShowUploadModal(false)}>CANCEL</button>
                                    <button type="submit" className="hub-btn hub-btn-primary" style={{ padding: '8px 16px', background: '#818cf8', border: 'none', color: '#fff', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer' }}>UPLOAD</button>
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
