'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Award, FileText, Download, GraduationCap, Calendar, User, ChevronDown, Check } from 'lucide-react';
import './Results.css';

const studentInfo = {
    name: 'BHARATH KUMAR A',
    usn: '4VV25EC032',
    program: 'Bachelor of Engineering in Electronics & Communication Engineering',
    year: '2nd Year',
    currentSem: 4
};

const semestersData = {
    1: {
        sem: 1,
        sgpa: 9.05,
        cgpa: 9.05,
        totalCredits: 20,
        status: 'PASSED',
        courses: [
            { name: 'Applied Mathematics - I for EEE Stream', code: '1BMATE101', credits: 4, cie: 44, see: 33, total: 77, grade: 'A', earned: 4, gradePoints: 8, creditPoints: 32 },
            { name: 'Applied Chemistry for EEE Stream', code: '1BCHEE102', credits: 3, cie: 43, see: 44, total: 87, grade: 'A+', earned: 3, gradePoints: 9, creditPoints: 27 },
            { name: 'Elements of Electronics Engineering', code: '1BEECT103', credits: 3, cie: 47, see: 36, total: 83, grade: 'A+', earned: 3, gradePoints: 9, creditPoints: 27 },
            { name: 'Introduction to AI & its Applications', code: '1BAIAK104', credits: 2, cie: 48, see: 43, total: 91, grade: 'O', earned: 2, gradePoints: 10, creditPoints: 20 },
            { name: 'Introduction to Mechanical Engineering', code: '1BIMEK105', credits: 3, cie: 46, see: 36, total: 82, grade: 'A+', earned: 3, gradePoints: 9, creditPoints: 27 },
            { name: 'Applied Chemistry Lab for EEE Stream', code: '1BCHEEL106', credits: 1, cie: 50, see: 49, total: 99, grade: 'O', earned: 1, gradePoints: 10, creditPoints: 10 },
            { name: 'Elements of Electronics Engineering Lab', code: '1BEECTL107', credits: 1, cie: 45, see: 44, total: 89, grade: 'A+', earned: 1, gradePoints: 9, creditPoints: 9 },
            { name: 'Communication Skills - I', code: '1BENGK108', credits: 1, cie: 44, see: 46, total: 90, grade: 'O', earned: 1, gradePoints: 10, creditPoints: 10 },
            { name: 'Design Thinking and Tinkering Lab', code: '1BDTTK109', credits: 1, cie: 45, see: 48, total: 93, grade: 'O', earned: 1, gradePoints: 10, creditPoints: 10 },
            { name: 'Samskruthika Kannada', code: '1BKSKK110', credits: 1, cie: 50, see: 38, total: 88, grade: 'A+', earned: 1, gradePoints: 9, creditPoints: 9 }
        ]
    },
    2: {
        sem: 2,
        sgpa: 9.20,
        cgpa: 9.13,
        totalCredits: 20,
        status: 'PASSED',
        courses: [
            { name: 'Applied Mathematics - II', code: '1BMATE201', credits: 4, cie: 45, see: 42, total: 87, grade: 'A+', earned: 4, gradePoints: 9, creditPoints: 36 },
            { name: 'Applied Physics for ECE', code: '1BPHY202', credits: 3, cie: 48, see: 45, total: 93, grade: 'O', earned: 3, gradePoints: 10, creditPoints: 30 },
            { name: 'Basic Electrical Engineering', code: '1BEE203', credits: 3, cie: 42, see: 38, total: 80, grade: 'A', earned: 3, gradePoints: 8, creditPoints: 24 },
            { name: 'Introduction to Python Programming', code: '1BPY204', credits: 2, cie: 49, see: 46, total: 95, grade: 'O', earned: 2, gradePoints: 10, creditPoints: 20 },
            { name: 'Digital Electronics', code: '1BDE205', credits: 3, cie: 48, see: 44, total: 92, grade: 'O', earned: 3, gradePoints: 10, creditPoints: 30 },
            { name: 'Applied Physics Lab', code: '1BPHYL206', credits: 1, cie: 50, see: 48, total: 98, grade: 'O', earned: 1, gradePoints: 10, creditPoints: 10 },
            { name: 'Basic Electrical Lab', code: '1BEEL207', credits: 1, cie: 44, see: 38, total: 82, grade: 'A', earned: 1, gradePoints: 8, creditPoints: 8 },
            { name: 'Constitution of India', code: '1BCOI208', credits: 1, cie: 45, see: 36, total: 81, grade: 'A', earned: 1, gradePoints: 8, creditPoints: 8 },
            { name: 'English for Engineers', code: '1BENG209', credits: 1, cie: 48, see: 46, total: 94, grade: 'O', earned: 1, gradePoints: 10, creditPoints: 10 },
            { name: 'Innovation & Design Thinking Lab', code: '1BIDT210', credits: 1, cie: 43, see: 39, total: 82, grade: 'A', earned: 1, gradePoints: 8, creditPoints: 8 }
        ]
    },
    3: {
        sem: 3,
        sgpa: 9.50,
        cgpa: 9.25,
        totalCredits: 20,
        status: 'PASSED',
        courses: [
            { name: 'Network Analysis', code: '1BECT301', credits: 4, cie: 46, see: 42, total: 88, grade: 'A+', earned: 4, gradePoints: 9, creditPoints: 36 },
            { name: 'Analog Electronics', code: '1BECT302', credits: 4, cie: 49, see: 48, total: 97, grade: 'O', earned: 4, gradePoints: 10, creditPoints: 40 },
            { name: 'Signals and Systems', code: '1BECT303', credits: 3, cie: 48, see: 46, total: 94, grade: 'O', earned: 3, gradePoints: 10, creditPoints: 30 },
            { name: 'Microcontroller & Applications', code: '1BECT304', credits: 3, cie: 46, see: 41, total: 87, grade: 'A+', earned: 3, gradePoints: 9, creditPoints: 27 },
            { name: 'Electronic Devices & Circuits', code: '1BECT305', credits: 3, cie: 45, see: 42, total: 87, grade: 'A+', earned: 3, gradePoints: 9, creditPoints: 27 },
            { name: 'Analog Electronics Lab', code: '1BECTL306', credits: 1, cie: 50, see: 47, total: 97, grade: 'O', earned: 1, gradePoints: 10, creditPoints: 10 },
            { name: 'Microcontroller Lab', code: '1BECTL307', credits: 1, cie: 48, see: 48, total: 96, grade: 'O', earned: 1, gradePoints: 10, creditPoints: 10 },
            { name: 'Social Connect & Ethics', code: '1BSCE308', credits: 1, cie: 50, see: 49, total: 99, grade: 'O', earned: 1, gradePoints: 10, creditPoints: 10 }
        ]
    },
    4: {
        sem: 4,
        sgpa: null,
        cgpa: 9.25,
        totalCredits: 18,
        status: 'CURRENT SEMESTER (AWAITING SEE)',
        courses: [
            { name: 'Electromagnetic Field Theory', code: '1BECT401', credits: 4, cie: 46, see: 'Awaiting', total: 'Awaiting', grade: '-', earned: 0, gradePoints: 0, creditPoints: 0 },
            { name: 'Linear Integrated Circuits', code: '1BECT402', credits: 4, cie: 48, see: 'Awaiting', total: 'Awaiting', grade: '-', earned: 0, gradePoints: 0, creditPoints: 0 },
            { name: 'Communication Theory', code: '1BECT403', credits: 3, cie: 45, see: 'Awaiting', total: 'Awaiting', grade: '-', earned: 0, gradePoints: 0, creditPoints: 0 },
            { name: 'Control Systems', code: '1BECT404', credits: 3, cie: 42, see: 'Awaiting', total: 'Awaiting', grade: '-', earned: 0, gradePoints: 0, creditPoints: 0 },
            { name: 'LIC & Communication Lab', code: '1BECTL405', credits: 2, cie: 49, see: 'Awaiting', total: 'Awaiting', grade: '-', earned: 0, gradePoints: 0, creditPoints: 0 },
            { name: 'Constitution of India', code: '1BCOI406', credits: 1, cie: 47, see: 'Awaiting', total: 'Awaiting', grade: '-', earned: 0, gradePoints: 0, creditPoints: 0 },
            { name: 'Biology for Engineers', code: '1BBIO407', credits: 1, cie: 45, see: 'Awaiting', total: 'Awaiting', grade: '-', earned: 0, gradePoints: 0, creditPoints: 0 }
        ]
    }
};

export default function ResultsPage() {
    const [selectedSem, setSelectedSem] = useState(4);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close custom dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handlePrint = () => {
        window.print();
    };

    const getGradeColor = (grade) => {
        if (grade === 'O') return '#10b981';
        if (grade === 'A+') return '#6366f1';
        if (grade === 'A') return '#3b82f6';
        return '#9ca3af';
    };

    const currentData = semestersData[selectedSem] || {
        sem: selectedSem,
        sgpa: null,
        cgpa: 9.25,
        totalCredits: 0,
        status: 'AWAITING REGISTRATION / FUTURE SEMESTER',
        courses: []
    };

    return (
        <div className="results-container animate-fade-in">
            {/* Header Title & Print Action */}
            <div className="results-header-row">
                <div className="results-title-pill">
                    PROVISIONAL RESULTS OF SEE
                </div>
                <button className="download-btn" onClick={handlePrint}>
                    <Download size={16} /> Print Report
                </button>
            </div>

            {/* Student Info Card */}
            <div className="student-info-card">
                <div className="card-overlay-glow" />
                <div className="info-grid">
                    <div className="info-item">
                        <span className="info-label">STUDENT NAME</span>
                        <span className="info-value text-glow">{studentInfo.name}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">USN / REGISTRATION NO.</span>
                        <span className="info-value text-indigo">{studentInfo.usn}</span>
                    </div>
                    <div className="info-item col-span-2">
                        <span className="info-label">ACADEMIC PROGRAM</span>
                        <span className="info-value">{studentInfo.program}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">ACADEMIC YEAR</span>
                        <span className="info-value">{studentInfo.year}</span>
                    </div>
                    
                    {/* Custom Styled Custom React Dropdown */}
                    <div className="info-item" ref={dropdownRef}>
                        <span className="info-label">SELECT SEMESTER</span>
                        <div className="custom-sem-dropdown-wrapper">
                            <button 
                                type="button" 
                                className="custom-sem-dropdown-toggle"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <span>Semester {selectedSem} {selectedSem === studentInfo.currentSem ? '(Current)' : ''}</span>
                                <ChevronDown size={16} className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`} />
                            </button>
                            
                            {isDropdownOpen && (
                                <ul className="custom-sem-dropdown-menu">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                                        <li 
                                            key={s} 
                                            className={`custom-sem-dropdown-item ${selectedSem === s ? 'active' : ''}`}
                                            onClick={() => {
                                                setSelectedSem(s);
                                                setIsDropdownOpen(false);
                                            }}
                                        >
                                            <span>Semester {s} {s === studentInfo.currentSem ? '(Current)' : ''}</span>
                                            {selectedSem === s && <Check size={14} className="check-icon" />}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    <div className="info-item">
                        <span className="info-label">CREDITS REGISTERED</span>
                        <span className="info-value">{currentData.totalCredits}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">STATUS</span>
                        <span className="info-value" style={{ color: currentData.sgpa ? '#10b981' : '#fbbf24' }}>
                            {currentData.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* Results Table */}
            <div className="table-card">
                {currentData.courses.length > 0 ? (
                    <div className="table-responsive">
                        <table className="results-table">
                            <thead>
                                <tr>
                                    <th>Course Name</th>
                                    <th>Code</th>
                                    <th className="text-center">Credits</th>
                                    <th className="text-center">CIE</th>
                                    <th className="text-center">SEE</th>
                                    <th className="text-center">Total</th>
                                    <th className="text-center">Letter Grade</th>
                                    <th className="text-center">Earned</th>
                                    <th className="text-center">GP</th>
                                    <th className="text-center">Credit Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.courses.map((course, idx) => (
                                    <tr key={idx}>
                                        <td className="course-name">{course.name}</td>
                                        <td className="course-code">{course.code}</td>
                                        <td className="text-center font-semibold">{course.credits}</td>
                                        <td className="text-center text-muted-gray">{course.cie}</td>
                                        <td className="text-center text-muted-gray">{course.see}</td>
                                        <td className="text-center font-bold text-white">{course.total}</td>
                                        <td className="text-center">
                                            <span 
                                                className="grade-badge"
                                                style={{
                                                    borderColor: getGradeColor(course.grade),
                                                    color: getGradeColor(course.grade),
                                                    backgroundColor: `${getGradeColor(course.grade)}12`
                                                }}
                                            >
                                                {course.grade}
                                            </span>
                                        </td>
                                        <td className="text-center">{course.earned}</td>
                                        <td className="text-center">{course.gradePoints}</td>
                                        <td className="text-center font-semibold text-glow-blue">{course.creditPoints}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <GraduationCap size={44} style={{ opacity: 0.4, margin: '0 auto 12px' }} />
                        <p>Academic registrations and results are currently unavailable for Semester {selectedSem}.</p>
                    </div>
                )}
            </div>

            {/* SGPA & CGPA Footer Panel */}
            <div className="gpa-summary-panel">
                <div className="gpa-card border-emerald">
                    <div className="gpa-label">SEMESTER GPA (SGPA)</div>
                    <div className="gpa-value text-emerald">
                        {currentData.sgpa ? currentData.sgpa.toFixed(2) : 'N/A'}
                    </div>
                </div>
                
                <div className="gpa-card border-indigo">
                    <div className="gpa-label">CUMULATIVE GPA (CGPA)</div>
                    <div className="gpa-value text-indigo">
                        {currentData.cgpa.toFixed(2)}
                    </div>
                </div>

                <div className="gpa-card border-blue">
                    <div className="gpa-label">TOTAL CREDITS EARNED</div>
                    <div className="gpa-value text-blue">
                        {currentData.courses.reduce((acc, c) => acc + (c.grade !== '-' ? c.credits : 0), 0)}
                    </div>
                </div>
            </div>
        </div>
    );
}
