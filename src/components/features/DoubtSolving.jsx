'use client';
import React, { useState } from 'react';
import { mockBackend } from '../../services/mockBackend';
import { MessageCircle, Video, Upload, User, Check, Clock, Mic, Bell, Send, UserPlus, Sparkles } from 'lucide-react';
import CustomDropdown from '../layout/CustomDropdown';
import './FeatureStyles.css';
import { useAuth } from '../../context/AuthContext';

const DoubtSolving = () => {
    const { user } = useAuth();
    const { doubts: initialDoubts, tutors } = mockBackend;
    const [doubts, setDoubts] = useState(initialDoubts);

    const initialMathDoubts = [
        {
            id: 'math-1',
            studentName: 'Ananya Y. K.',
            usn: '4VV25EC012',
            question: 'How do we find the eigenvalues and eigenvectors of a 3x3 matrix using the characteristic equation?',
            subject: 'Mathematics',
            status: 'Pending',
            time: '10 mins ago',
            replies: []
        },
        {
            id: 'math-2',
            studentName: 'Riddhi',
            usn: '4VV25EC099',
            question: 'Can you explain the difference between ordinary and partial differential equations with an example?',
            subject: 'Mathematics',
            status: 'Pending',
            time: '1 hour ago',
            replies: []
        },
        {
            id: 'math-3',
            studentName: 'Bharath Kumar A.',
            usn: '4VV25EC001',
            question: "What is the physical significance of the curl and divergence of a vector field in Green's theorem?",
            subject: 'Mathematics',
            status: 'Resolved',
            time: '2 hours ago',
            replies: [{ by: 'Dr. Bhavana', text: "Divergence measures source strength (flux density expansion), while curl measures local rotation velocity.", date: 'Today' }]
        }
    ];

    const [mathDoubts, setMathDoubts] = useState(initialMathDoubts);
    const [selectedMathDoubt, setSelectedMathDoubt] = useState(null);
    const [mathReplyText, setMathReplyText] = useState('');

    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [doubtText, setDoubtText] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [status, setStatus] = useState('idle'); // 'idle', 'submitting', 'pending', 'resolved'
    const [activeDoubt, setActiveDoubt] = useState(null);
    const [showHistory, setShowHistory] = useState(false);
    const [notification, setNotification] = useState(null);

    const imageInputRef = React.useRef(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioUrl, setAudioUrl] = useState(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const timerRef = React.useRef(null);

    const handleImageClick = () => {
        if (imageInputRef.current) {
            imageInputRef.current.click();
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (e) => {
        e.stopPropagation();
        setSelectedFile(null);
        setImagePreview(null);
        if (imageInputRef.current) {
            imageInputRef.current.value = '';
        }
    };

    const startRecording = async () => {
        try {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const recorder = new MediaRecorder(stream);
                const chunks = [];
                
                recorder.ondataavailable = (e) => {
                    if (e.data.size > 0) chunks.push(e.data);
                };

                recorder.onstop = () => {
                    const blob = new Blob(chunks, { type: 'audio/webm' });
                    const url = URL.createObjectURL(blob);
                    setAudioUrl(url);
                    stream.getTracks().forEach(track => track.stop());
                };

                recorder.start();
                setMediaRecorder(recorder);
                setIsRecording(true);
                setRecordingTime(0);
                
                timerRef.current = setInterval(() => {
                    setRecordingTime(prev => prev + 1);
                }, 1000);
            } else {
                throw new Error("MediaDevices not supported");
            }
        } catch (err) {
            console.warn("Audio recording error, using simulation:", err);
            setIsRecording(true);
            setRecordingTime(0);
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        } else {
            clearInterval(timerRef.current);
            setIsRecording(false);
            setAudioUrl("mock-audio");
        }
        clearInterval(timerRef.current);
        setIsRecording(false);
    };

    const removeAudio = (e) => {
        e.stopPropagation();
        setAudioUrl(null);
        setMediaRecorder(null);
    };

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const teacherOptions = [
        'Dr. Emily (Chemistry)',
        'Prof. Alan (Mathematics)',
        'Tutor Mike (Computer Science)',
        'Dr. Bhavana (Electronics)',
        'Prof. Suresh (Physics)',
        'Dr. Rajesh (Mechanical)',
        'Prof. Sneha (Info Science)',
        'Tutor Priya (Electrical)'
    ];

    const handlePostDoubt = (e) => {
        e.preventDefault();
        if (!selectedTeacher) {
            alert("Please tag a teacher first!");
            return;
        }

        setStatus('submitting');

        // Simulate Notification Send
        setTimeout(() => {
            const newDoubt = {
                id: Date.now(),
                question: doubtText,
                subject: selectedTeacher.split('(')[1].replace(')', ''),
                teacher: selectedTeacher.split(' (')[0],
                status: 'Pending',
                time: 'Just now'
            };
            
            setActiveDoubt(newDoubt);
            setDoubts([newDoubt, ...doubts]);
            setStatus('pending');
            setDoubtText('');
            setSelectedTeacher('');
            setSelectedFile(null);
            setImagePreview(null);
            setAudioUrl(null);
        }, 1500);
    };

    const simulateTeacherSolve = () => {
        if (!activeDoubt) return;
        
        // Simulate teacher taking time to solve
        setTimeout(() => {
            const resolvedDoubt = { ...activeDoubt, status: 'Resolved' };
            setDoubts(prev => prev.map(d => d.id === activeDoubt.id ? resolvedDoubt : d));
            setActiveDoubt(resolvedDoubt);
            setStatus('resolved');
            
            // Show notification toast in the app only
            setNotification({
                message: `${resolvedDoubt.teacher} has solved your doubt: "${resolvedDoubt.question.substring(0, 20)}..."`
            });
            
            setTimeout(() => {
                setNotification(null);
            }, 6000);
        }, 2000);
    };

    return (
        <div className="feature-container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            {user?.role === 'teacher' ? (
                <div style={{ color: '#fff' }}>
                    <div className="yellow-title-box" style={{ marginBottom: '2rem' }}>
                        <h1>TEACHER DOUBT PORTAL</h1>
                    </div>
                    
                    <div className="tutor-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem', alignItems: 'start' }}>
                        {/* Left Column: Student Doubt List */}
                        <div className="premium-card" style={{ padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                                Students' Math Questions
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {mathDoubts.map(d => (
                                    <div 
                                        key={d.id} 
                                        onClick={() => setSelectedMathDoubt(d)}
                                        className={`list-item-hover ${selectedMathDoubt?.id === d.id ? 'active' : ''}`}
                                        style={{ 
                                            background: 'rgba(255,255,255,0.02)', 
                                            border: selectedMathDoubt?.id === d.id ? '1px solid #fbbf24' : '1px solid rgba(255,255,255,0.08)', 
                                            padding: '1.25rem', 
                                            borderRadius: '12px', 
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            position: 'relative'
                                        }}
                                    >
                                        <span style={{ 
                                            position: 'absolute', 
                                            top: '12px', 
                                            right: '12px', 
                                            fontSize: '0.65rem', 
                                            fontWeight: 'bold', 
                                            padding: '3px 8px', 
                                            borderRadius: '4px',
                                            background: d.status === 'Resolved' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                                            color: d.status === 'Resolved' ? '#4ade80' : '#fbbf24',
                                            border: d.status === 'Resolved' ? '1px solid rgba(74, 222, 128, 0.3)' : '1px solid rgba(251, 191, 36, 0.3)'
                                        }}>
                                            {d.status.toUpperCase()}
                                        </span>
                                        <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.9rem', marginBottom: '4px' }}>{d.studentName}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '8px' }}>USN: {d.usn} • {d.time}</div>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#ccc', paddingRight: '80px', lineHeight: 1.5 }}>{d.question}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column: Solve Panel */}
                        <div className="premium-card" style={{ padding: '2rem' }}>
                            {selectedMathDoubt ? (
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', color: '#fbbf24', margin: '0 0 1rem' }}>Formulate Answer</h3>
                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', borderLeft: '3px solid #fbbf24' }}>
                                        <span style={{ fontSize: '0.75rem', color: '#888', display: 'block', marginBottom: '4px' }}>Question from {selectedMathDoubt.studentName}:</span>
                                        <p style={{ margin: 0, fontSize: '0.88rem', fontStyle: 'italic' }}>"{selectedMathDoubt.question}"</p>
                                    </div>

                                    {selectedMathDoubt.status === 'Resolved' ? (
                                        <div style={{ background: 'rgba(74, 222, 128, 0.05)', border: '1px solid rgba(74, 222, 128, 0.15)', padding: '1rem', borderRadius: '8px' }}>
                                            <span style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '0.85rem', display: 'block', marginBottom: '4px' }}>✓ Resolved Answer Sent:</span>
                                            <p style={{ margin: 0, fontSize: '0.88rem', color: '#ccc' }}>{selectedMathDoubt.replies[0]?.text}</p>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            <textarea 
                                                value={mathReplyText}
                                                onChange={e => setMathReplyText(e.target.value)}
                                                placeholder="Write your explanation or mathematical formulation..."
                                                style={{ width: '100%', minHeight: '120px', background: '#15181f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', padding: '0.8rem', fontSize: '0.9rem', outline: 'none' }}
                                            />
                                            <button 
                                                onClick={() => {
                                                    if (!mathReplyText.trim()) return;
                                                    setMathDoubts(prev => prev.map(d => d.id === selectedMathDoubt.id ? { ...d, status: 'Resolved', replies: [{ by: 'You', text: mathReplyText, date: 'Just now' }] } : d));
                                                    setSelectedMathDoubt(prev => ({ ...prev, status: 'Resolved', replies: [{ by: 'You', text: mathReplyText, date: 'Just now' }] }));
                                                    setMathReplyText('');
                                                }}
                                                style={{ background: '#818cf8', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                                            >
                                                Send Solution
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
                                    <MessageCircle size={44} style={{ opacity: 0.3, marginBottom: '10px' }} />
                                    <p>Select a student question from the list to formulate a solution.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <div className="yellow-title-box">
                            <h1>DOUBT SOLVING HUB</h1>
                        </div>
                        <button 
                            onClick={() => setShowHistory(!showHistory)}
                            style={{ 
                                background: 'rgba(255, 255, 255, 0.03)', 
                                color: showHistory ? '#fbbf24' : '#fff', 
                                border: '1px solid rgba(255,255,255,0.08)', 
                                padding: '10px 20px', 
                                fontWeight: '800', 
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                textTransform: 'uppercase',
                                fontSize: '0.8rem',
                                borderRadius: '8px',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Clock size={18} />
                            {showHistory ? 'Hide History' : 'View History'}
                        </button>
                    </div>

                    <div className="doubt-layout" style={{ 
                        display: 'grid', 
                        gridTemplateColumns: showHistory ? '1.2fr 0.8fr' : '1fr', 
                        gap: '2.5rem', 
                        alignItems: 'start',
                        transition: 'all 0.3s'
                    }}>
                        
                        {/* Left Column: Tag & Ask */}
                        <div className="premium-card" style={{ padding: '2.5rem' }}>
                            {status === 'idle' || status === 'submitting' ? (
                                <>
                                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.6rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#fff' }}>
                                        <UserPlus color="#fbbf24" size={24} /> Tag Your Teacher
                                    </h3>
                                    <p style={{ color: 'var(--text-secondary, #9ca3af)', marginBottom: '2rem' }}>Choose a teacher to notify. They will be alerted to solve your problem.</p>

                                    {status === 'submitting' ? (
                                        <div className="loading-state" style={{ padding: '3rem', textAlign: 'center' }}>
                                            <div className="spinner" style={{ margin: '0 auto 1.5rem', width: '50px', height: '50px', border: '3px solid rgba(255,255,255,0.05)', borderTop: '3px solid #fbbf24', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                            <p style={{ fontWeight: '900', letterSpacing: '1px' }}>NOTIFYING TEACHER...</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handlePostDoubt} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                            <CustomDropdown 
                                                label="Select Teacher to Tag *"
                                                options={teacherOptions}
                                                value={selectedTeacher}
                                                onChange={setSelectedTeacher}
                                                placeholder="Choose Teacher"
                                                layout="grid"
                                            />

                                            <div className="textarea-wrapper" style={{ position: 'relative' }}>
                                                <textarea
                                                    placeholder="Describe your problem in detail..."
                                                    style={{ width: '100%', minHeight: '180px', background: '#15181f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff', padding: '1.2rem', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s ease', resize: 'vertical' }}
                                                    value={doubtText}
                                                    onChange={(e) => setDoubtText(e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                                {/* Image Upload Zone */}
                                                <div 
                                                    className="upload-zone" 
                                                    onClick={handleImageClick}
                                                    style={{ 
                                                        flex: 1, 
                                                        minWidth: '200px',
                                                        border: imagePreview ? '1px solid #fbbf24' : '1px dashed rgba(255,255,255,0.12)', 
                                                        borderRadius: '12px',
                                                        padding: '1.5rem 1rem', 
                                                        textAlign: 'center', 
                                                        cursor: 'pointer',
                                                        position: 'relative',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        minHeight: '110px',
                                                        background: imagePreview ? 'rgba(251, 191, 36, 0.03)' : 'rgba(255, 255, 255, 0.01)',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    <input 
                                                        type="file" 
                                                        ref={imageInputRef} 
                                                        accept="image/*" 
                                                        onChange={handleImageChange} 
                                                        style={{ display: 'none' }} 
                                                    />
                                                    {imagePreview ? (
                                                        <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                            <img src={imagePreview} alt="Preview" style={{ maxHeight: '80px', maxWidth: '100%', borderRadius: '6px', marginBottom: '8px' }} />
                                                            <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#fbbf24', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                {selectedFile?.name || 'image.png'}
                                                            </div>
                                                            <button 
                                                                onClick={removeImage} 
                                                                style={{ 
                                                                    position: 'absolute', 
                                                                    top: '-8px', 
                                                                    right: '-8px', 
                                                                    background: '#ef4444', 
                                                                    color: '#fff', 
                                                                    border: 'none', 
                                                                    borderRadius: '50%', 
                                                                    width: '20px', 
                                                                    height: '20px', 
                                                                    cursor: 'pointer',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    fontSize: '0.8rem',
                                                                    fontWeight: 'bold'
                                                                }}
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <Upload size={22} color="#fbbf24" style={{ marginBottom: '8px' }} />
                                                            <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#9ca3af', letterSpacing: '0.5px' }}>UPLOAD IMAGE</div>
                                                        </>
                                                    )}
                                                </div>

                                                {/* Audio Record Zone */}
                                                <div 
                                                    className="upload-zone" 
                                                    onClick={isRecording ? stopRecording : (audioUrl ? undefined : startRecording)}
                                                    style={{ 
                                                        flex: 1, 
                                                        minWidth: '200px',
                                                        border: audioUrl ? '1px solid #f87171' : (isRecording ? '1px dashed #f87171' : '1px dashed rgba(255,255,255,0.12)'), 
                                                        borderRadius: '12px',
                                                        padding: '1.5rem 1rem', 
                                                        textAlign: 'center', 
                                                        cursor: 'pointer',
                                                        position: 'relative',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        minHeight: '110px',
                                                        background: isRecording ? 'rgba(248, 113, 113, 0.03)' : 'rgba(255, 255, 255, 0.01)',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    {isRecording ? (
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                                                            <div className="pulse-mic" style={{ width: '12px', height: '12px', background: '#ef4444', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
                                                            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#f87171' }}>RECORDING {formatTime(recordingTime)}</div>
                                                            <div style={{ fontSize: '0.65rem', color: '#888' }}>Click to Stop</div>
                                                        </div>
                                                    ) : audioUrl ? (
                                                        <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                                            <Mic size={18} color="#f87171" />
                                                            {audioUrl === 'mock-audio' ? (
                                                                <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#4ade80' }}>🎙️ Voice note recorded (Simulated)</div>
                                                            ) : (
                                                                <audio src={audioUrl} controls style={{ width: '100%', height: '32px' }} onClick={e => e.stopPropagation()} />
                                                            )}
                                                            <button 
                                                                onClick={removeAudio} 
                                                                style={{ 
                                                                    position: 'absolute', 
                                                                    top: '-8px', 
                                                                    right: '-8px', 
                                                                    background: '#ef4444', 
                                                                    color: '#fff', 
                                                                    border: 'none', 
                                                                    borderRadius: '50%', 
                                                                    width: '20px', 
                                                                    height: '20px', 
                                                                    cursor: 'pointer',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    fontSize: '0.8rem',
                                                                    fontWeight: 'bold'
                                                                }}
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <Mic size={22} color="#f87171" style={{ marginBottom: '8px' }} />
                                                            <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#9ca3af', letterSpacing: '0.5px' }}>RECORD AUDIO</div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <button 
                                                type="submit" 
                                                style={{ 
                                                    padding: '1.1rem', 
                                                    fontWeight: '800', 
                                                    fontSize: '1rem', 
                                                    cursor: 'pointer', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center', 
                                                    gap: '0.75rem',
                                                    background: '#818cf8',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: '10px',
                                                    boxShadow: '0 4px 20px rgba(129, 140, 248, 0.25)',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                className="btn-glow-purple"
                                            >
                                                <Send size={18} /> SEND TO TEACHER
                                            </button>
                                        </form>
                                    )}
                                </>
                            ) : (
                                <div className="status-container" style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
                                    <div className={`status-icon-box ${status}`} style={{ width: '80px', height: '80px', margin: '0 auto 1.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid', borderColor: status === 'resolved' ? '#4ade80' : '#fbbf24' }}>
                                        {status === 'resolved' ? <Check size={40} color="#4ade80" /> : <Clock size={40} color="#fbbf24" />}
                                    </div>
                                    
                                    <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: '#fff' }}>
                                        {status === 'resolved' ? "PROBLEM SOLVED!" : "TEACHER NOTIFIED"}
                                    </h2>
                                    <p style={{ color: 'var(--text-secondary, #9ca3af)', marginBottom: '2rem' }}>
                                        {status === 'resolved' 
                                            ? `Teacher ${activeDoubt.teacher} has resolved your doubt.` 
                                            : `Waiting for ${activeDoubt.teacher} to review and solve your problem.`}
                                    </p>

                                    <div className="active-doubt-preview" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '12px', textAlign: 'left', marginBottom: '2rem', borderLeft: '3px solid #fbbf24', border: '1px solid rgba(255,255,255,0.06)' }}>
                                        <strong style={{ display: 'block', fontSize: '0.75rem', color: '#888', marginBottom: '0.5rem' }}>YOUR QUESTION:</strong>
                                        <p style={{ margin: 0, fontStyle: 'italic', fontSize: '0.9rem', color: '#eee' }}>"{activeDoubt.question}"</p>
                                    </div>

                                    {status === 'pending' && (
                                        <button className="sim-btn" onClick={simulateTeacherSolve} style={{ background: 'rgba(255,255,255,0.05)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.2)', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                            (DEMO: Simulate Teacher Solve)
                                        </button>
                                    )}

                                    {status === 'resolved' && (
                                        <button 
                                            onClick={() => setStatus('idle')}
                                            style={{ 
                                                width: '100%', 
                                                padding: '1rem', 
                                                background: '#818cf8', 
                                                border: 'none', 
                                                borderRadius: '8px', 
                                                color: '#fff', 
                                                fontWeight: '800', 
                                                cursor: 'pointer' 
                                            }}
                                        >
                                            ASK ANOTHER DOUBT
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Right Column: History Sidebar (Conditional) */}
                        {showHistory && (
                            <div className="premium-card animate-fadeIn" style={{ padding: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
                                <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h3 style={{ margin: 0, letterSpacing: '0.5px', color: '#fff', fontSize: '1.1rem' }}>DOUBT HISTORY</h3>
                                    <Bell size={18} color="var(--text-secondary, #9ca3af)" />
                                </div>

                                <div className="doubt-stack" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {doubts.map((d) => (
                                        <div key={d.id} className="history-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '1.2rem', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
                                            <div className={`status-stripe ${d.status.toLowerCase()}`} style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px', background: d.status === 'Resolved' ? '#4ade80' : '#fbbf24' }} />
                                            <div style={{ marginLeft: '10px' }}>
                                                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', fontWeight: '800', color: '#fff', lineHeight: 1.4 }}>{d.question}</h4>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary, #9ca3af)', fontWeight: '700' }}>{d.subject.toUpperCase()} • {d.time}</span>
                                                    <span style={{ fontSize: '0.7rem', fontWeight: '800', color: d.status === 'Resolved' ? '#4ade80' : '#fbbf24' }}>
                                                        {d.status.toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    {notification && (
                        <div className="toast-notification-pop">
                            <div className="toast-icon">🔔</div>
                            <div className="toast-content">
                                <span className="toast-title">New Notification</span>
                                <p className="toast-msg">{notification.message}</p>
                            </div>
                            <button className="toast-close" onClick={() => setNotification(null)}>×</button>
                        </div>
                    )}

                    <style>{`
                        .premium-card {
                            background: rgba(21, 24, 31, 0.75);
                            border: 1px solid rgba(255, 255, 255, 0.08);
                            border-radius: 16px;
                            box-shadow: 0 10px 45px rgba(0, 0, 0, 0.5);
                            backdrop-filter: blur(12px);
                        }
                        .upload-zone:hover {
                            border-color: #818cf8 !important;
                            background: rgba(129, 140, 248, 0.08) !important;
                            transform: translateY(-1px);
                        }
                        .btn-glow-purple:hover {
                            transform: translateY(-1px);
                            box-shadow: 0 6px 24px rgba(129, 140, 248, 0.35);
                        }
                        .list-item-hover:hover {
                            background: rgba(255, 255, 255, 0.04) !important;
                        }
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                        @keyframes pulse {
                            0% { transform: scale(1); opacity: 1; }
                            50% { transform: scale(1.3); opacity: 0.5; }
                            100% { transform: scale(1); opacity: 1; }
                        }
                    `}</style>
                </div>
            )}
        </div>
    );
};

export default DoubtSolving;
