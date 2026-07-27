"use client";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Calendar, Search, X, Upload, Check, Bell, User as UserIcon, PlusCircle, Trash2, Eye } from 'lucide-react';
import { createClient } from '../../utils/supabase/client';

import { useAuth } from '../../context/AuthContext';
import './Attendance.css';

// Deterministic generator lists of Indian names for seeded student accounts
const firstNames = [
    'Aarav', 'Aditya', 'Amit', 'Arjun', 'Ashok', 'Chaitanya', 'Deepak', 'Ganesh', 'Hari',
    'Ishaan', 'Kartik', 'Kiran', 'Madhav', 'Nikhil', 'Pranav', 'Rahul', 'Rohan', 'Sanjay', 'Vikram',
    'Abhishek', 'Harish', 'Manjunath', 'Pradeep', 'Rajesh', 'Suresh', 'Vijay', 'Yash',
    'Ananya', 'Divya', 'Jyothi', 'Kavya', 'Meera', 'Neha', 'Pooja', 'Priya', 'Sneha',
    'Swati', 'Tanvi', 'Aishwarya', 'Deepa', 'Geetha', 'Latha', 'Nisha', 'Radha', 'Sandhya', 'Shalini', 'Uma', 'Vidya'
];
const lastNames = [
    'Kumar', 'Sharma', 'Patel', 'Joshi', 'Rao', 'Nair', 'Singh', 'Reddy', 'Gowda', 'Prasad',
    'Pai', 'Shenoy', 'Murthy', 'Kulkarni', 'Bhat', 'Hegde', 'Desai', 'Shetty', 'Acharya', 'Naidu'
];

const generateIndianName = (branch, section, index) => {
    const hash = (branch.charCodeAt(0) * 7 + section.charCodeAt(0) * 13 + index * 17);
    const first = firstNames[hash % firstNames.length];
    const last = lastNames[(hash * 3) % lastNames.length];
    const shortName = `${first.toLowerCase()}@vvce`;
    return { name: `${first} ${last} (${shortName})` };
};

const studentNameMap = {};
const studentBranchSectionMap = {};

// Base profiles that must remain unchanged (ECE A)
const baseProfiles = [
    { id: 'mock-student-id', name: 'Demo Student', branch: 'ECE', section: 'A' },
    { id: '00000000-0000-0000-0000-000000000001', name: 'Bharath Kumar A (bk@vvce)', branch: 'ECE', section: 'A' },
    { id: '00000000-0000-0000-0000-000000000002', name: 'Ananya Yk (ananya@vvce)', branch: 'ECE', section: 'A' },
    { id: '00000000-0000-0000-0000-000000000003', name: 'Riddhi (riddhi@vvce)', branch: 'ECE', section: 'A' },
    { id: '00000000-0000-0000-0000-000000000007', name: 'Rishith (rishith@vvce)', branch: 'ECE', section: 'A' },
    { id: '00000000-0000-0000-0000-000000000008', name: 'Bharath P (bp@vvce)', branch: 'ECE', section: 'A' },
    { id: '00000000-0000-0000-0000-000000000009', name: 'Anagha (anagha@vvce)', branch: 'ECE', section: 'A' },
];

baseProfiles.forEach(p => {
    studentNameMap[p.id] = p.name;
    studentBranchSectionMap[p.id] = { branch: p.branch, section: p.section };
});

const seededBranches = ['CSE', 'ISE', 'ECE', 'EEE', 'AIML'];
const seededSections = ['A', 'B', 'C', 'D'];

const allSeededStudentsList = [...baseProfiles.map(p => ({ id: p.id, college: 'VVCE', role: 'student' }))];

seededBranches.forEach(branch => {
    seededSections.forEach(section => {
        const existingCount = baseProfiles.filter(p => p.branch === branch && p.section === section).length;
        const countToAdd = 8 - existingCount; // 8 students per class
        
        for (let i = 1; i <= countToAdd; i++) {
            const id = `mock-student-${branch.toLowerCase()}-${section.toLowerCase()}-${i}`;
            const { name } = generateIndianName(branch, section, i);
            
            studentNameMap[id] = name;
            studentBranchSectionMap[id] = { branch, section };
            allSeededStudentsList.push({ id, college: 'VVCE', role: 'student' });
        }
    });
});

// Premium Custom Month Picker Component
function MonthPicker({ value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentYear, setCurrentYear] = useState(() => {
        const parts = value.split('-');
        return parts[1] ? parseInt(parts[1]) : 2026;
    });
    
    const wrapperRef = useRef(null);

    const months = [
        { label: 'Jan', value: 1 },
        { label: 'Feb', value: 2 },
        { label: 'Mar', value: 3 },
        { label: 'Apr', value: 4 },
        { label: 'May', value: 5 },
        { label: 'Jun', value: 6 },
        { label: 'Jul', value: 7 },
        { label: 'Aug', value: 8 },
        { label: 'Sep', value: 9 },
        { label: 'Oct', value: 10 },
        { label: 'Nov', value: 11 },
        { label: 'Dec', value: 12 }
    ];

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMonthSelect = (monthVal) => {
        const monthStr = monthVal < 10 ? `0${monthVal}` : `${monthVal}`;
        onChange(`${monthStr}-${currentYear}`);
        setIsOpen(false);
    };

    const handlePrevYear = (e) => {
        e.stopPropagation();
        setCurrentYear(y => y - 1);
    };

    const handleNextYear = (e) => {
        e.stopPropagation();
        setCurrentYear(y => y + 1);
    };

    const [valMonth, valYear] = value.split('-').map(Number);

    return (
        <div className="lms-custom-month-picker" ref={wrapperRef}>
            <div className="lms-date-input-wrapper" onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
                <input 
                    type="text" 
                    value={value} 
                    readOnly
                    className="lms-date-select-field"
                    style={{ cursor: 'pointer' }}
                />
                <button type="button" className="lms-calendar-btn" style={{ pointerEvents: 'none' }}>
                    <Calendar size={16} />
                </button>
            </div>

            {isOpen && (
                <div className="lms-month-popover" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    zIndex: 1000,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    padding: '16px',
                    width: '260px',
                    marginTop: '8px'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '16px',
                        fontWeight: '700',
                        fontSize: '1rem',
                        color: '#1e293b'
                    }}>
                        <button 
                            type="button" 
                            onClick={handlePrevYear}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                color: '#64748b',
                                padding: '4px 8px',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            &laquo;
                        </button>
                        <span>{currentYear}</span>
                        <button 
                            type="button" 
                            onClick={handleNextYear}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                color: '#64748b',
                                padding: '4px 8px',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            &raquo;
                        </button>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '8px',
                        textAlign: 'center'
                    }}>
                        {months.map(m => {
                            const isSelected = valMonth === m.value && valYear === currentYear;
                            return (
                                <button
                                    key={m.value}
                                    type="button"
                                    onClick={() => handleMonthSelect(m.value)}
                                    style={{
                                        padding: '8px 4px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        fontSize: '0.875rem',
                                        fontWeight: isSelected ? '700' : '500',
                                        backgroundColor: isSelected ? '#1d4ed8' : 'transparent',
                                        color: isSelected ? '#ffffff' : '#334155',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s ease'
                                    }}
                                >
                                    {m.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

// 1st Semester Courses
const semester1CourseSummary = [
    { course: '1BEECT103 - Elements of Electronics Engineering', present: 42, total: 50, percentage: 84 },
    { course: '1BIMEK105 - Introduction to Mechanical Engineering', present: 45, total: 50, percentage: 90 },
    { course: '1BEECTL107 - Elements of Electronics Engineering Lab', present: 15, total: 15, percentage: 100 },
    { course: '1BENGK108 - Communication Skills - I', present: 18, total: 30, percentage: 60 },
    { course: '1BDTTK109 - Design Thinking and Tinkering Lab', present: 14, total: 15, percentage: 93 },
    { course: '1BKSKK110 - Samskruthika Kannada', present: 20, total: 20, percentage: 100 },
    { course: '1BMATE101 - Applied Mathematics - I for EE Stream', present: 40, total: 50, percentage: 80 }
];

const semester1Daywise = [
    { id: 'mock-s1-1', course: '1BEECT103 - Elements of Electronics Engineering', date: '21-10-2025', day: 'Tuesday', present: 1, total: 1, doc: '', docStatus: '', sem: '1 - Semester' },
    { id: 'mock-s1-2', course: '1BENGK108 - Communication Skills - I', date: '21-10-2025', day: 'Tuesday', present: 0, total: 1, doc: '', docStatus: '', sem: '1 - Semester' },
    { id: 'mock-s1-3', course: '1BIMEK105 - Introduction to Mechanical Engineering', date: '22-10-2025', day: 'Wednesday', present: 1, total: 1, doc: '', docStatus: '', sem: '1 - Semester' },
    { id: 'mock-s1-4', course: '1BMATE101 - Applied Mathematics - I for EE Stream', date: '23-10-2025', day: 'Thursday', present: 1, total: 1, doc: '', docStatus: '', sem: '1 - Semester' }
];

// 2nd Semester Courses
const semester2CourseSummary = [
    { course: '1BCEDT204 - Computer Aided Engineering Drawing for ECE Stream', present: 23, total: 36, percentage: 63.89 },
    { course: '1BENGK208 - Communication Skills - 2', present: 10, total: 10, percentage: 100.00 },
    { course: '1BICOK210 - Indian Constitution and Engineering Ethics', present: 9, total: 10, percentage: 90.00 },
    { course: '1BIEEK205 - Introduction to Electrical Engineering', present: 21, total: 28, percentage: 75.00 },
    { course: '1BMATE201 - Applied Mathematics - II for EE Stream', present: 41, total: 47, percentage: 87.23 },
    { course: '1BPBLK209 - Interdisciplinary Project - Based Learning (Social Innovation Project)', present: 7, total: 7, percentage: 100.00 },
    { course: '1BPHYT202 - Applied Physics for ECE Stream', present: 25, total: 29, percentage: 86.21 },
    { course: '1BPHYTL206 - Applied Physics Lab for ECE Stream', present: 8, total: 8, percentage: 100.00 },
    { course: '1BPLCO203 - Introduction to C Programming', present: 35, total: 36, percentage: 97.22 },
    { course: '1BPLCOL207 - C Programming Lab', present: 11, total: 12, percentage: 91.67 }
];

const semester2Daywise = [
    { id: 'mock-s2-1', course: '1BPLCOL207 - C Programming Lab', date: '01-04-2026', day: 'Wednesday', present: 1, total: 1, doc: '', docStatus: '', sem: '2 - Semester' },
    { id: 'mock-s2-2', course: '1BPBLK209 - Interdisciplinary Project - Based Learning (Social Innovation Project)', date: '02-03-2026', day: 'Monday', present: 1, total: 1, doc: '', docStatus: '', sem: '2 - Semester' },
    { id: 'mock-s2-3', course: '1BENGK208 - Communication Skills - 2', date: '02-03-2026', day: 'Monday', present: 1, total: 1, doc: '', docStatus: '', sem: '2 - Semester' },
    { id: 'mock-s2-4', course: '1BPHYTL206 - Applied Physics Lab for ECE Stream', date: '02-03-2026', day: 'Monday', present: 1, total: 1, doc: '', docStatus: '', sem: '2 - Semester' },
    { id: 'mock-s2-5', course: '1BPHYT202 - Applied Physics for ECE Stream', date: '02-04-2026', day: 'Thursday', present: 1, total: 1, doc: '', docStatus: '', sem: '2 - Semester' },
    { id: 'mock-s2-6', course: '1BIEEK205 - Introduction to Electrical Engineering', date: '02-04-2026', day: 'Thursday', present: 1, total: 1, doc: '', docStatus: '', sem: '2 - Semester' },
    { id: 'mock-s2-7', course: '1BMATE201 - Applied Mathematics - II for EE Stream', date: '02-04-2026', day: 'Thursday', present: 1, total: 1, doc: '', docStatus: '', sem: '2 - Semester' },
    { id: 'mock-s2-8', course: '1BPLCO203 - Introduction to C Programming', date: '02-04-2026', day: 'Thursday', present: 1, total: 1, doc: '', docStatus: '', sem: '2 - Semester' },
    { id: 'mock-s2-9', course: '1BCEDT204 - Computer Aided Engineering Drawing for ECE Stream', date: '02-04-2026', day: 'Thursday', present: 1, total: 1, doc: '', docStatus: '', sem: '2 - Semester' },
    { id: 'mock-s2-10', course: '1BIEEK205 - Introduction to Electrical Engineering', date: '03-03-2026', day: 'Tuesday', present: 1, total: 1, doc: '', docStatus: '', sem: '2 - Semester' },
    { id: 'mock-s2-11', course: '1BMATE201 - Applied Mathematics - II for EE Stream', date: '04-03-2026', day: 'Wednesday', present: 1, total: 2, doc: '', docStatus: '', sem: '2 - Semester' }
];

const auditCardStyle = {
    background: 'var(--bg-card)',
    border: '2px solid var(--border-color)',
    borderRadius: '12px',
    padding: '1.25rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
};

const auditLabelStyle = {
    fontSize: '0.72rem',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    marginBottom: '4px'
};

const auditSubStyle = {
    fontSize: '0.65rem',
    color: '#666',
    display: 'block',
    marginTop: '2px'
};

const auditPanelStyle = {
    background: 'var(--bg-card)',
    border: '2px solid var(--border-color)',
    borderRadius: '12px',
    padding: '1.25rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
};

const auditPanelTitleStyle = {
    fontSize: '0.95rem',
    fontWeight: '800',
    color: 'var(--text-primary)'
};

const Attendance = () => {
    const { user } = useAuth();
    const supabase = useMemo(() => createClient(), []);

    // Admin specific audit states
    const [auditAlerts, setAuditAlerts] = useState([
        { id: '1', name: 'Bharath P', usn: '4VV25EC032', gateway: 'CSE Block Gate A', conflictGate: 'Library Gate 1', timeGap: 8, status: 'unresolved' },
        { id: '2', name: 'Anagha', usn: '4VV25CS014', gateway: 'Science Block Main', conflictGate: 'Hostel Outer Ring', timeGap: 14, status: 'unresolved' },
        { id: '3', name: 'Bharath Kumar A', usn: '4VV25EE008', gateway: 'Admin Gate 2', conflictGate: 'Mechanical Lab Entrance', timeGap: 22, status: 'unresolved' }
    ]);
    const [isGateScanRunning, setIsGateScanRunning] = useState(false);
    const [scanMessage, setScanMessage] = useState('');

    // Filter lists
    const curriculums = [
        'B.E in FY 2025-2026',
        'B.E in FY 2024-2025',
        'B.E in FY 2023-2024',
        'B.Tech in FY 2025-2026',
        'M.Tech in FY 2025-2026',
        'MCA in FY 2025-2026'
    ];

    const terms = [
        '1 - Semester',
        '2 - Semester',
        '3 - Semester',
        '4 - Semester',
        '5 - Semester',
        '6 - Semester',
        '7 - Semester',
        '8 - Semester'
    ];

    const branches = [
        'None',
        'CSE',
        'ISE',
        'ECE',
        'EEE',
        'AIML'
    ];

    const sections = [
        'None',
        'A',
        'B',
        'C',
        'D'
    ];

    const monthOptions = useMemo(() => {
        const list = [];
        const years = [2025, 2026];
        years.forEach(year => {
            for (let month = 1; month <= 12; month++) {
                const monthStr = month < 10 ? `0${month}` : `${month}`;
                list.push(`${monthStr}-${year}`);
            }
        });
        return list;
    }, []);

    // Filter states
    const [curriculum, setCurriculum] = useState('B.E in FY 2025-2026');
    const [term, setTerm] = useState('2 - Semester');
    const [selectedBranch, setSelectedBranch] = useState('ECE');
    const [selectedSection, setSelectedSection] = useState('A');
    const [fromMonth, setFromMonth] = useState('01-2026');
    const [toMonth, setToMonth] = useState('12-2026');
    
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // Live state synced from Supabase
    const [supabaseRecords, setSupabaseRecords] = useState([]);
    const [studentProfiles, setStudentProfiles] = useState([]);
    const [liveNotification, setLiveNotification] = useState(null);

    const filteredStudentProfiles = useMemo(() => {
        if (selectedBranch === 'None' || selectedSection === 'None') {
            return [];
        }
        return studentProfiles.filter(student => {
            const studentInfo = studentBranchSectionMap[student.id];
            if (!studentInfo) return false;
            const branchMatch = studentInfo.branch === selectedBranch;
            const sectionMatch = studentInfo.section === selectedSection;
            return branchMatch && sectionMatch;
        });
    }, [studentProfiles, selectedBranch, selectedSection]);

    // Timetable slots state
    const [timetableSlots, setTimetableSlots] = useState([]);
    const [selectedTimeSlotId, setSelectedTimeSlotId] = useState('');

    // Class-wide Attendance states for teachers
    const [classTeacherCourse, setClassTeacherCourse] = useState('1BMATE201 - Applied Mathematics - II for EE Stream');
    const [classTeacherDate, setClassTeacherDate] = useState(() => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    });
    const [classRosterStatus, setClassRosterStatus] = useState({}); // student_id -> boolean (true=present, false=absent)
    const [classAttendanceSummary, setClassAttendanceSummary] = useState([]);
    const [classSessionHistory, setClassSessionHistory] = useState([]);
    const [classCourseLogs, setClassCourseLogs] = useState([]);
    const [classMessage, setClassMessage] = useState('');
    const [isSavingClass, setIsSavingClass] = useState(false);

    // Load timetable slots for teachers
    useEffect(() => {
        if (user?.role === 'teacher' || user?.role === 'admin') {
            const fetchSlots = async () => {
                try {
                    const { data, error } = await supabase
                        .from('timetables')
                        .select('*');
                    
                    let resolvedSlots = [];
                    if (!error && data && data.length > 0) {
                        resolvedSlots = data;
                    } else {
                        resolvedSlots = [
                            { id: '00000000-0000-0000-0000-000000000002', subject: '1BMATE201 - Applied Mathematics - II', day: 'Wednesday', time: '11:15 AM - 01:15 PM' },
                            { id: 'mock-slot-2', subject: '1BPLCO203 - Introduction to C Programming', day: 'Thursday', time: '09:00 AM - 11:00 AM' },
                            { id: 'mock-slot-3', subject: '1BPHYT202 - Applied Physics', day: 'Monday', time: '02:00 PM - 04:00 PM' }
                        ];
                    }

                    // Apply teacher subject constraints
                    const nameLower = user?.name?.toLowerCase() || '';
                    const emailVal = user?.email || '';
                    if (nameLower.includes('demo teacher') || emailVal === '2') {
                        resolvedSlots = resolvedSlots.filter(s => s.subject.toLowerCase().includes('c programming'));
                    } else if (nameLower.includes('bhavana') || emailVal === 'bhav@vvce') {
                        resolvedSlots = resolvedSlots.filter(s => s.subject.toLowerCase().includes('mathematics'));
                    }

                    setTimetableSlots(resolvedSlots);
                    if (resolvedSlots.length > 0) {
                        setSelectedTimeSlotId(resolvedSlots[0].id);
                        setClassTeacherCourse(resolvedSlots[0].subject);
                    }
                } catch (e) {
                    console.log("Error fetching slots, falling back to mock slots:", e);
                    let resolvedSlots = [
                        { id: '00000000-0000-0000-0000-000000000002', subject: '1BMATE201 - Applied Mathematics - II', day: 'Wednesday', time: '11:15 AM - 01:15 PM' },
                        { id: 'mock-slot-2', subject: '1BPLCO203 - Introduction to C Programming', day: 'Thursday', time: '09:00 AM - 11:00 AM' },
                        { id: 'mock-slot-3', subject: '1BPHYT202 - Applied Physics', day: 'Monday', time: '02:00 PM - 04:00 PM' }
                    ];

                    const nameLower = user?.name?.toLowerCase() || '';
                    const emailVal = user?.email || '';
                    if (nameLower.includes('demo teacher') || emailVal === '2') {
                        resolvedSlots = resolvedSlots.filter(s => s.subject.toLowerCase().includes('c programming'));
                    } else if (nameLower.includes('bhavana') || emailVal === 'bhav@vvce') {
                        resolvedSlots = resolvedSlots.filter(s => s.subject.toLowerCase().includes('mathematics'));
                    }

                    setTimetableSlots(resolvedSlots);
                    if (resolvedSlots.length > 0) {
                        setSelectedTimeSlotId(resolvedSlots[0].id);
                        setClassTeacherCourse(resolvedSlots[0].subject);
                    }
                }
            };
            fetchSlots();
        }
    }, [user]);

    // Helper: Fetch class summaries and session history for the selected course
    const fetchClassAttendanceSummary = async () => {
        try {
            // 1. Get all students
            let { data: students, error: studentError } = await supabase
                .from('profiles')
                .select('id, college')
                .eq('role', 'student');
            
            let merged = [...allSeededStudentsList];
            if (!studentError && students && students.length > 0) {
                students.forEach(s => {
                    if (!merged.find(ms => ms.id === s.id)) {
                        merged.push(s);
                    }
                });
            }
            students = merged;

            // 2. Fetch all attendance logs for the selected course
            const { data: logs, error: logsError } = await supabase
                .from('attendance')
                .select('*')
                .eq('course', classTeacherCourse);
            
            if (logsError) return;

            setClassCourseLogs(logs || []);

            // Build map of studentId -> { present, total }
            const statsMap = {};
            students.forEach(s => {
                statsMap[s.id] = { present: 0, total: 0 };
            });

            const historyMap = {};

            if (logs && logs.length > 0) {
                logs.forEach(log => {
                    // Summary map
                    if (statsMap[log.student_id]) {
                        statsMap[log.student_id].present += log.present;
                        statsMap[log.student_id].total += log.total;
                    }
                    // History map
                    const dateKey = log.date;
                    if (!historyMap[dateKey]) {
                        historyMap[dateKey] = { date: log.date, day: log.day, present: 0, total: 0 };
                    }
                    historyMap[dateKey].present += log.present;
                    historyMap[dateKey].total += log.total;
                });
            }

            // Convert summary map to array
            const summaryList = students.map(s => {
                const stats = statsMap[s.id];
                let present = stats.present;
                let total = stats.total;
                
                // Fallback consistent mock seeds if no logs in database to keep page beautiful at first load
                if (total === 0) {
                    if (s.id === '00000000-0000-0000-0000-000000000001') {
                        present = 41; total = 47;
                    } else if (s.id === '00000000-0000-0000-0000-000000000002') {
                        present = 23; total = 36;
                    } else if (s.id === '00000000-0000-0000-0000-000000000003') {
                        present = 25; total = 29;
                    } else if (s.id === '00000000-0000-0000-0000-000000000007') {
                        present = 28; total = 36;
                    } else if (s.id === '00000000-0000-0000-0000-000000000008') {
                        present = 33; total = 36;
                    } else if (s.id === '00000000-0000-0000-0000-000000000009') {
                        present = 28; total = 36;
                    } else {
                        const charCodeSum = s.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                        total = 31 + (charCodeSum % 15); // 31 to 45 (today included)
                        present = Math.floor(total * (0.65 + (charCodeSum % 30) / 100)); // 65% to 95% attendance
                    }
                }

                const pct = total > 0 ? (present / total) * 100 : 100;

                return {
                    student_id: s.id,
                    full_name: studentNameMap[s.id] || `Student (${s.id.substring(0, 8)})`,
                    present,
                    total,
                    percentage: pct
                };
            });

            setClassAttendanceSummary(summaryList);

            // Convert history map to sorted array (latest first)
            const historyList = Object.values(historyMap).sort((a, b) => {
                const parseDate = (str) => {
                    const parts = str.split('-');
                    return new Date(parts[2], parts[1] - 1, parts[0]);
                };
                return parseDate(b.date) - parseDate(a.date);
            });

            setClassSessionHistory(historyList);
        } catch (err) {
            console.error("Error fetching class attendance details:", err);
        }
    };

    // Helper: Fetch existing marked roster for standard date
    const fetchExistingRosterForDate = async () => {
        try {
            const dateParts = classTeacherDate.split('-');
            const formattedDateStr = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

            const { data: logs, error } = await supabase
                .from('attendance')
                .select('student_id, present')
                .eq('course', classTeacherCourse)
                .eq('date', formattedDateStr);
            
            const statusMap = {};
            
            // Prefill with defaults (all true / present)
            let { data: students } = await supabase
                .from('profiles')
                .select('id')
                .eq('role', 'student');
            
            if (!students || students.length === 0) {
                students = [
                    { id: '00000000-0000-0000-0000-000000000001' },
                    { id: '00000000-0000-0000-0000-000000000002' },
                    { id: '00000000-0000-0000-0000-000000000003' },
                    { id: '00000000-0000-0000-0000-000000000007' },
                    { id: '00000000-0000-0000-0000-000000000008' },
                    { id: '00000000-0000-0000-0000-000000000009' }
                ];
            }
            
            students.forEach(s => {
                statusMap[s.id] = true;
            });

            if (!error && logs) {
                logs.forEach(log => {
                    statusMap[log.student_id] = log.present === 1;
                });
            }
            
            setClassRosterStatus(statusMap);
        } catch (err) {
            console.error("Error fetching existing roster for date:", err);
        }
    };

    // Helper: Save class-wide attendance marks
    const handleSaveClassAttendance = async () => {
        setClassMessage('');
        setIsSavingClass(true);
        try {
            let { data: students, error: studentError } = await supabase
                .from('profiles')
                .select('id')
                .eq('role', 'student');

            if (studentError || !students || students.length === 0) {
                students = [
                    { id: '00000000-0000-0000-0000-000000000001' },
                    { id: '00000000-0000-0000-0000-000000000002' },
                    { id: '00000000-0000-0000-0000-000000000003' },
                    { id: '00000000-0000-0000-0000-000000000007' },
                    { id: '00000000-0000-0000-0000-000000000008' },
                    { id: '00000000-0000-0000-0000-000000000009' }
                ];
            }

            const dateParts = classTeacherDate.split('-');
            const formattedDateStr = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
            
            const dateObj = new Date(classTeacherDate);
            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const formattedDayStr = daysOfWeek[dateObj.getDay()];

            for (const student of students) {
                const isPresent = classRosterStatus[student.id] !== false; // default present

                const { data: existingRecords } = await supabase
                    .from('attendance')
                    .select('id')
                    .eq('student_id', student.id)
                    .eq('course', classTeacherCourse)
                    .eq('date', formattedDateStr)
                    .limit(1);

                if (existingRecords && existingRecords.length > 0) {
                    // Update
                    const { error: updateError } = await supabase
                        .from('attendance')
                        .update({
                            present: isPresent ? 1 : 0
                        })
                        .eq('id', existingRecords[0].id);

                    if (updateError) throw updateError;
                } else {
                    // Insert
                    const { error: insertError } = await supabase
                        .from('attendance')
                        .insert({
                            student_id: student.id,
                            course: classTeacherCourse,
                            date: formattedDateStr,
                            day: formattedDayStr,
                            present: isPresent ? 1 : 0,
                            total: 1,
                            sem: term
                        });

                    if (insertError) throw insertError;
                }
            }

            setClassMessage("Successfully saved class attendance!");
            fetchClassAttendanceSummary();
        } catch (err) {
            console.error("Save class attendance failed:", err);
            setClassMessage(`Error: ${err.message}`);
        } finally {
            setIsSavingClass(false);
        }
    };

    // Helper: Wipe a complete class session's logs
    const handleDeleteClassSession = async (dateStr) => {
        if (!confirm(`Are you sure you want to delete all attendance records for the class session on ${dateStr}?`)) {
            return;
        }

        try {
            const { error } = await supabase
                .from('attendance')
                .delete()
                .eq('course', classTeacherCourse)
                .eq('date', dateStr);

            if (error) throw error;
            
            setClassMessage(`Successfully deleted class session on ${dateStr}`);
            fetchClassAttendanceSummary();
            
            const dateParts = classTeacherDate.split('-');
            const formattedDateStr = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
            if (formattedDateStr === dateStr) {
                fetchExistingRosterForDate();
            }
        } catch (err) {
            alert(`Failed to delete class session: ${err.message}`);
        }
    };

    // Load class summaries when course or term changes
    useEffect(() => {
        if (user?.role === 'teacher' || user?.role === 'admin') {
            fetchClassAttendanceSummary();
        }
    }, [classTeacherCourse, term, user, supabaseRecords]);

    // Load existing roster status when date or course changes
    useEffect(() => {
        if (user?.role === 'teacher' || user?.role === 'admin') {
            fetchExistingRosterForDate();
        }
    }, [classTeacherCourse, classTeacherDate, user]);



    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    // Modal state
    const [selectedUploadRow, setSelectedUploadRow] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileNameText, setFileNameText] = useState('');

    // Teacher Marking Panel States
    const [teacherStudentId, setTeacherStudentId] = useState('');
    const [teacherCourse, setTeacherCourse] = useState('1BPLCO203 - Introduction to C Programming');
    const [teacherDate, setTeacherDate] = useState(() => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    });
    const [teacherPresent, setTeacherPresent] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [teacherMessage, setTeacherMessage] = useState('');

    // 1. Load initial data & set up real-time postgres subscription
    useEffect(() => {
        if (!user) return;

        // A. Load student list for teacher panel
        if (user.role === 'teacher' || user.role === 'admin') {
            const fetchStudents = async () => {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('id, college')
                    .eq('role', 'student');
                
                let merged = [...allSeededStudentsList];
                if (!error && data && data.length > 0) {
                    data.forEach(s => {
                        if (!merged.find(ms => ms.id === s.id)) {
                            merged.push(s);
                        }
                    });
                }
                setStudentProfiles(merged);
                setTeacherStudentId(merged[0]?.id || '');
            };
            fetchStudents();
        }

        // B. Load attendance logs from Supabase
        const fetchAttendance = async () => {
            let query = supabase.from('attendance').select('*');
            
            // If student, only get their own records
            if (user.role === 'student') {
                // If using mock login, map it to the active Supabase user ID if present
                const activeUserRes = await supabase.auth.getUser();
                const actualUid = activeUserRes.data.user?.id;
                if (actualUid) {
                    query = query.eq('student_id', actualUid);
                } else {
                    query = query.eq('student_id', user._id || user.id);
                }
            }

            const { data, error } = await query.order('created_at', { ascending: false });
            if (!error && data) {
                setSupabaseRecords(data);
            }
        };
        fetchAttendance();

        // C. Subscribe to Realtime postgres changes
        const channel = supabase
            .channel('attendance_live_sync')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'attendance' },
                async (payload) => {
                    console.log('[Realtime Attendance Change Received]:', payload);
                    
                    // Fetch latest profile state to see if it targets the active user
                    const activeUserRes = await supabase.auth.getUser();
                    const currentUid = activeUserRes.data.user?.id || user.id;

                    if (payload.eventType === 'INSERT') {
                        // Display sliding live notification toast if it is for the logged in student
                        if (user.role === 'student' && payload.new.student_id === currentUid) {
                            setLiveNotification({
                                course: payload.new.course,
                                present: payload.new.present,
                                date: payload.new.date
                            });
                            // Auto dismiss notification after 5 seconds
                            setTimeout(() => setLiveNotification(null), 6000);
                        }
                        setSupabaseRecords(prev => [payload.new, ...prev]);
                    } else if (payload.eventType === 'UPDATE') {
                        setSupabaseRecords(prev => prev.map(item => item.id === payload.new.id ? payload.new : item));
                    } else if (payload.eventType === 'DELETE') {
                        setSupabaseRecords(prev => prev.filter(item => item.id !== payload.old.id));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, supabase]);

    // Active student ID for computing statistics/records
    const activeStudentId = user?.role === 'student'
        ? (user.id || 'mock-student-id')
        : (teacherStudentId || (studentProfiles[0]?.id));

    // Handle Teacher Document Approvals
    const handleApproveDocument = async (recordId) => {
        try {
            const { error } = await supabase
                .from('attendance')
                .update({
                    doc_status: 'Approved',
                    present: 1
                })
                .eq('id', recordId);
            
            if (error) throw error;
        } catch (err) {
            alert(`Failed to approve document: ${err.message}`);
        }
    };

    const handleRejectDocument = async (recordId) => {
        try {
            const { error } = await supabase
                .from('attendance')
                .update({
                    doc_status: 'Rejected'
                })
                .eq('id', recordId);
            
            if (error) throw error;
        } catch (err) {
            alert(`Failed to reject document: ${err.message}`);
        }
    };

    // 2. Computed Course Summary: Merges default semester lists with live Supabase edits
    const computedCourseSummary = useMemo(() => {
        const baseSummary = term === '1 - Semester' 
            ? semester1CourseSummary.map(item => ({ ...item }))
            : semester2CourseSummary.map(item => ({ ...item }));

        // Map course name -> details
        const courseMap = {};
        baseSummary.forEach(item => {
            courseMap[item.course] = { present: item.present, total: item.total };
        });

        // Add from Supabase
        supabaseRecords.forEach(record => {
            if (record.sem === term && record.student_id === activeStudentId) {
                if (!courseMap[record.course]) {
                    courseMap[record.course] = { present: 0, total: 0 };
                }
                courseMap[record.course].present += record.present;
                courseMap[record.course].total += record.total;
            }
        });

        // Calculate and format results
        return Object.keys(courseMap).map(courseName => {
            const stats = courseMap[courseName];
            const pct = stats.total > 0 ? (stats.present / stats.total) * 100 : 100;
            return {
                course: courseName,
                present: stats.present,
                total: stats.total,
                percentage: pct
            };
        });
    }, [term, supabaseRecords, activeStudentId]);

    // 3. Computed Daywise logs: Merges default daywise list with live Supabase edits
    const computedDaywise = useMemo(() => {
        const baseDaywise = term === '1 - Semester' ? semester1Daywise : semester2Daywise;
        
        // Merge Supabase records with local logs
        const liveLogs = supabaseRecords
            .filter(record => record.sem === term && record.student_id === activeStudentId)
            .map(record => ({
                id: record.id,
                course: record.course,
                date: record.date,
                day: record.day,
                present: record.present,
                total: record.total,
                doc: record.doc || '',
                docStatus: record.doc_status || '',
                sem: record.sem,
                isSupabase: true
            }));

        return [...liveLogs, ...baseDaywise];
    }, [term, supabaseRecords, activeStudentId]);

    // 4. Filter logs by Date Range & Search Term
    const filteredDaywise = useMemo(() => {
        const [fromM, fromY] = fromMonth.split('-').map(Number);
        const fromLimit = fromY * 12 + fromM;

        const [toM, toY] = toMonth.split('-').map(Number);
        const toLimit = toY * 12 + toM;

        return computedDaywise.filter(item => {
            // Month limits check
            const dateParts = item.date.split('-');
            const itemMonth = parseInt(dateParts[1]);
            const itemYear = parseInt(dateParts[2]);
            const itemVal = itemYear * 12 + itemMonth;

            if (itemVal < fromLimit || itemVal > toLimit) return false;

            // Search query check
            const matchesSearch = 
                item.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.date.includes(searchTerm) ||
                item.day.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.docStatus && item.docStatus.toLowerCase().includes(searchTerm.toLowerCase()));

            return matchesSearch;
        });
    }, [computedDaywise, fromMonth, toMonth, searchTerm]);

    // Grouping & Sorting logic
    const groupedDaywise = useMemo(() => {
        const groups = {};
        filteredDaywise.forEach(item => {
            const dateStr = `${item.date} , ${item.day}`;
            if (!groups[dateStr]) {
                groups[dateStr] = [];
            }
            groups[dateStr].push(item);
        });
        return groups;
    }, [filteredDaywise]);

    const sortedDateKeys = useMemo(() => {
        return Object.keys(groupedDaywise).sort((a, b) => {
            const parseDate = (str) => {
                const parts = str.split(' ')[0].split('-');
                return new Date(parts[2], parts[1] - 1, parts[0]);
            };
            return parseDate(b) - parseDate(a); // Descending
        });
    }, [groupedDaywise]);

    // Pagination bounds
    const totalEntries = filteredDaywise.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = Math.min(startIndex + entriesPerPage, totalEntries);

    const paginatedEntries = useMemo(() => {
        const flatList = [];
        sortedDateKeys.forEach(dateKey => {
            const rows = groupedDaywise[dateKey];
            rows.forEach(row => {
                flatList.push({ dateKey, row });
            });
        });
        return flatList.slice(startIndex, endIndex);
    }, [sortedDateKeys, groupedDaywise, startIndex, endIndex]);

    // Handle Teacher Attendance Submission
    const handleTeacherSubmit = async (e) => {
        e.preventDefault();
        setTeacherMessage('');
        setIsSubmitting(true);

        try {
            // Find target student UUID
            let targetStudentUid = teacherStudentId;
            if (!targetStudentUid && studentProfiles.length > 0) {
                targetStudentUid = studentProfiles[0].id;
            }

            // Fallback for demo: if no student registered yet, use own auth user ID
            if (!targetStudentUid) {
                const activeUserRes = await supabase.auth.getUser();
                targetStudentUid = activeUserRes.data.user?.id;
            }

            if (!targetStudentUid) {
                throw new Error("No target student available. Ensure a student account is registered in Supabase.");
            }

            // Date processing YYYY-MM-DD -> DD-MM-YYYY
            const dateParts = teacherDate.split('-');
            const formattedDateStr = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
            
            // Day of week
            const dateObj = new Date(teacherDate);
            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const formattedDayStr = daysOfWeek[dateObj.getDay()];

            const attendancePayload = {
                student_id: targetStudentUid,
                course: teacherCourse,
                date: formattedDateStr,
                day: formattedDayStr,
                present: teacherPresent ? 1 : 0,
                total: 1,
                sem: term,
                doc: '',
                doc_status: ''
            };

            const { data, error } = await supabase
                .from('attendance')
                .insert(attendancePayload)
                .select();

            if (error) throw error;

            setTeacherMessage(`Successfully submitted attendance record!`);
            // Reset fields
            setTeacherPresent(true);
        } catch (err) {
            console.error("Teacher attendance submit error:", err);
            setTeacherMessage(`Error: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Teacher Delete Record
    const handleTeacherDelete = async (recordId) => {
        if (!confirm("Are you sure you want to remove this attendance record?")) return;
        try {
            const { error } = await supabase
                .from('attendance')
                .delete()
                .eq('id', recordId);
            if (error) throw error;
        } catch (err) {
            alert(`Failed to delete record: ${err.message}`);
        }
    };

    const handleUploadClick = (row) => {
        setSelectedUploadRow(row);
        setSelectedFile(null);
        setFileNameText('');
    };

    // Student Doc Upload Submit
    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) return;

        try {
            const activeUserRes = await supabase.auth.getUser();
            const studentId = activeUserRes.data.user?.id || user.id;

            if (!studentId) {
                throw new Error("No active authenticated student session found.");
            }

            // Generate a unique path for the file in the bucket: [studentId]/[timestamp]_[filename]
            const filePath = `${studentId}/${Date.now()}_${selectedFile.name}`;
            
            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('attendance-documents')
                .upload(filePath, selectedFile);
            
            if (uploadError) throw uploadError;

            // Get public URL for the document
            const { data: urlData } = supabase.storage
                .from('attendance-documents')
                .getPublicUrl(filePath);

            const docUrl = urlData?.publicUrl || selectedFile.name;

            if (selectedUploadRow.isSupabase) {
                // Update in Supabase
                const { error } = await supabase
                    .from('attendance')
                    .update({
                        doc: docUrl,
                        doc_status: 'Pending Approval'
                    })
                    .eq('id', selectedUploadRow.id);
                
                if (error) throw error;
            } else {
                // Insert in Supabase
                const { error } = await supabase
                    .from('attendance')
                    .insert({
                        student_id: studentId,
                        course: selectedUploadRow.course,
                        date: selectedUploadRow.date,
                        day: selectedUploadRow.day,
                        present: 0,
                        total: 1,
                        doc: docUrl,
                        doc_status: 'Pending Approval',
                        sem: term
                    });
                
                if (error) throw error;
            }

            setSelectedUploadRow(null);
            setSelectedFile(null);
            setFileNameText('');
        } catch (err) {
            alert(`Failed to upload: ${err.message}`);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("File size exceeds 5MB limit.");
                return;
            }
            setSelectedFile(file);
            setFileNameText(file.name);
        }
    };







    return (
        <div className="lms-attendance-page">
            
            {/* Sliding Realtime Notification Alert Banner */}
            {liveNotification && (
                <div className="live-notification-toast">
                    <div className="toast-icon-wrap">
                        <Bell className="bell-glow" size={20} />
                    </div>
                    <div className="toast-content-wrap">
                        {liveNotification.message ? (
                            <>
                                <h4>{liveNotification.title || "Live Telemetry Detection"}</h4>
                                <p>{liveNotification.message}</p>
                            </>
                        ) : (
                            <>
                                <h4>Live Attendance Feed Alert</h4>
                                <p>{liveNotification.course} updated for {liveNotification.date}. Status: <strong className={liveNotification.present === 1 ? "text-success" : "text-danger"}>{liveNotification.present === 1 ? "PRESENT" : "ABSENT"}</strong></p>
                            </>
                        )}
                    </div>
                    <button className="toast-close-btn" onClick={() => setLiveNotification(null)}>
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Dashboard Welcome Header */}
            <div className="welcome-banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                    <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.8rem', fontWeight: '700', background: 'linear-gradient(to right, var(--text-primary), var(--text-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>Attendance Registry</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '4px 0 0 0' }}>Manage course session logs and mark student participation.</p>
                </div>
                {user && (
                    <div className="date-badge" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-secondary)', padding: '6px 16px', borderRadius: '20px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        Logged in as: <strong style={{ color: 'var(--accent-primary)' }}>{user.name}</strong>
                    </div>
                )}
            </div>

            <>
                    {/* A. TEACHER CLASS-WIDE ATTENDANCE MARKER */}
                    {(user?.role === 'teacher' || user?.role === 'admin') && (
                <div className="lms-section-card teacher-control-panel">
                    <div className="lms-card-header" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <PlusCircle size={18} color="#6366f1" />
                        <span>Class Attendance Marker: Record Course Session</span>
                    </div>
                    <div className="lms-card-body" style={{ padding: '20px' }}>
                        <form onSubmit={(e) => { e.preventDefault(); handleSaveClassAttendance(); }} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div className="lms-filter-row" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                                <div className="lms-filter-col">
                                    <label>Select Term: <span className="required-asterisk">*</span></label>
                                    <select 
                                        value={term} 
                                        onChange={(e) => setTerm(e.target.value)}
                                        className="lms-input-select"
                                    >
                                        {terms.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="lms-filter-col">
                                    <label>Time Slot & Course: <span className="required-asterisk">*</span></label>
                                    <select 
                                        value={selectedTimeSlotId} 
                                        onChange={(e) => {
                                            const slotId = e.target.value;
                                            setSelectedTimeSlotId(slotId);
                                            const slot = timetableSlots.find(s => s.id === slotId);
                                            if (slot) {
                                                setClassTeacherCourse(slot.subject);
                                            }
                                        }}
                                        className="lms-input-select"
                                    >
                                        {timetableSlots.map(slot => (
                                            <option key={slot.id} value={slot.id}>
                                                {slot.subject} ({slot.time} - {slot.day})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="lms-filter-col">
                                    <label>Select Branch: <span className="required-asterisk">*</span></label>
                                    <select 
                                        value={selectedBranch} 
                                        onChange={(e) => setSelectedBranch(e.target.value)}
                                        className="lms-input-select"
                                    >
                                        {branches.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="lms-filter-col">
                                    <label>Select Section: <span className="required-asterisk">*</span></label>
                                    <select 
                                        value={selectedSection} 
                                        onChange={(e) => setSelectedSection(e.target.value)}
                                        className="lms-input-select"
                                    >
                                        {sections.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="lms-filter-col">
                                    <label>Class Date: <span className="required-asterisk">*</span></label>
                                    <input 
                                        type="date" 
                                        value={classTeacherDate}
                                        onChange={(e) => setClassTeacherDate(e.target.value)}
                                        className="lms-input-select"
                                        required
                                        style={{ height: '42px' }}
                                    />
                                </div>
                            </div>

                            {/* Student Roster marking list */}
                            <div className="roster-container">
                                <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>
                                    Student Roster List
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {filteredStudentProfiles.map(student => {
                                        const isPresent = classRosterStatus[student.id] !== false;
                                        
                                        // Retrieve statistics from classCourseLogs excluding today's date
                                        const dateParts = classTeacherDate.split('-');
                                        const formattedTodayStr = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

                                        const studentLogsExcludingToday = classCourseLogs.filter(log => log.student_id === student.id && log.date !== formattedTodayStr);
                                        
                                        let pastPresent = 0;
                                        let pastTotal = 0;
                                        
                                        if (studentLogsExcludingToday.length > 0) {
                                            studentLogsExcludingToday.forEach(log => {
                                                pastPresent += log.present;
                                                pastTotal += log.total;
                                            });
                                        } else {
                                            // Fallback consistent mock seeds if no logs in database for other dates
                                            if (student.id === 'mock-student-id') {
                                                pastPresent = 37; pastTotal = 40;
                                            } else if (student.id === '00000000-0000-0000-0000-000000000001') {
                                                pastPresent = 41; pastTotal = 46;
                                            } else if (student.id === '00000000-0000-0000-0000-000000000002') {
                                                pastPresent = 22; pastTotal = 35;
                                            } else if (student.id === '00000000-0000-0000-0000-000000000003') {
                                                pastPresent = 24; pastTotal = 28;
                                            } else if (student.id === '00000000-0000-0000-0000-000000000007') {
                                                pastPresent = 27; pastTotal = 35;
                                            } else if (student.id === '00000000-0000-0000-0000-000000000008') {
                                                pastPresent = 32; pastTotal = 35;
                                            } else if (student.id === '00000000-0000-0000-0000-000000000009') {
                                                pastPresent = 27; pastTotal = 35;
                                            } else {
                                                const charCodeSum = student.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                                                pastTotal = 30 + (charCodeSum % 15); // 30 to 44
                                                pastPresent = Math.floor(pastTotal * (0.65 + (charCodeSum % 30) / 100)); // 65% to 95% attendance
                                            }
                                        }
                                        
                                        const isPresentToday = classRosterStatus[student.id] !== false;
                                        const presentCount = pastPresent + (isPresentToday ? 1 : 0);
                                        const totalCount = pastTotal + 1;
                                        
                                        const percentageVal = totalCount > 0 ? (presentCount / totalCount) * 100 : 100;
                                        let attendanceColor = '#4ade80'; // Green (default > 85%)
                                        if (percentageVal < 75) {
                                            attendanceColor = '#f87171'; // Red (< 75%)
                                        } else if (percentageVal <= 85) {
                                            attendanceColor = '#fbbf24'; // Yellow (75% to 85%)
                                        }

                                        return (
                                            <div key={student.id} className="roster-student-row">
                                                <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
                                                    <div>
                                                        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                                                            {studentNameMap[student.id] || `Student (${student.id.substring(0, 8)})`}
                                                        </span>
                                                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                                            USN: {student.id.substring(0, 8).toUpperCase()}
                                                        </div>
                                                    </div>
                                                    
                                                    <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                                                        <div style={{ textAlign: 'right' }}>
                                                            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Attendance</span>
                                                            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.95rem', fontWeight: '700', color: attendanceColor }}>
                                                                {presentCount} / {totalCount}
                                                            </span>
                                                        </div>
                                                        <div style={{ textAlign: 'right', minWidth: '80px' }}>
                                                            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Percentage</span>
                                                            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.95rem', fontWeight: '800', color: attendanceColor }}>
                                                                {percentageVal.toFixed(2)}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <button
                                                    type="button"
                                                    onClick={() => setClassRosterStatus(prev => ({ ...prev, [student.id]: !isPresent }))}
                                                    style={{
                                                        padding: '8px 20px',
                                                        borderRadius: '20px',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '700',
                                                        cursor: 'pointer',
                                                        border: 'none',
                                                        transition: 'all 0.2s ease',
                                                        backgroundColor: isPresent ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                                        color: isPresent ? '#4ade80' : '#f87171',
                                                        borderWidth: '1px',
                                                        borderStyle: 'solid',
                                                        borderColor: isPresent ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)',
                                                        minWidth: '110px'
                                                    }}
                                                >
                                                    {isPresent ? '✓ Present' : '✗ Absent'}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
 
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '15px' }}>
                                <button 
                                    type="submit" 
                                    className="attendance-save-btn" 
                                    disabled={isSavingClass}
                                >
                                    {isSavingClass ? 'Saving...' : 'Save Class Attendance'}
                                </button>
                            </div>

                            {classMessage && (
                                <div style={{ 
                                    padding: '10px', 
                                    borderRadius: '4px', 
                                    backgroundColor: classMessage.startsWith('Error') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                    color: classMessage.startsWith('Error') ? '#ef4444' : '#10b981',
                                    fontSize: '0.85rem',
                                    fontWeight: '500'
                                }}>
                                    {classMessage}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            )}

            {/* B. STUDENT FILTERS & FEED */}
            {user?.role === 'student' && (
                <div className="lms-filters-card">
                    <div className="lms-filter-row">
                        <div className="lms-filter-col">
                            <label>Curriculum: <span className="required-asterisk">*</span></label>
                            <select 
                                value={curriculum} 
                                onChange={(e) => setCurriculum(e.target.value)}
                                className="lms-input-select"
                            >
                                {curriculums.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>

                        <div className="lms-filter-col">
                            <label>Term: <span className="required-asterisk">*</span></label>
                            <select 
                                value={term} 
                                onChange={(e) => {
                                    setTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="lms-input-select"
                            >
                                {terms.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>

                        <div className="lms-filter-col">
                            <label>From Month: <span className="required-asterisk">*</span></label>
                            <MonthPicker 
                                value={fromMonth} 
                                onChange={(val) => {
                                    setFromMonth(val);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>

                        <div className="lms-filter-col">
                            <label>To Month: <span className="required-asterisk">*</span></label>
                            <MonthPicker 
                                value={toMonth} 
                                onChange={(val) => {
                                    setToMonth(val);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Course Summary Table (For Students only) */}
            {user?.role === 'student' && (
                <div className="lms-section-card">
                    <div className="lms-card-header">
                        Course summary list
                    </div>
                    <div className="lms-card-body">
                        {computedCourseSummary.length > 0 ? (
                            <table className="lms-table summary-table">
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'left', width: '55%' }}>Course</th>
                                        <th style={{ textAlign: 'center', width: '20%' }}>Present / Total class</th>
                                        <th style={{ textAlign: 'center', width: '25%' }}>Total percentage(%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {computedCourseSummary.map((item, index) => {
                                        let attendanceClass = 'text-success'; // > 85%
                                        if (item.percentage < 75) {
                                            attendanceClass = 'text-danger'; // < 75%
                                        } else if (item.percentage <= 85) {
                                            attendanceClass = 'text-warning'; // 75% - 85%
                                        }
                                        return (
                                            <tr key={index}>
                                                <td className="course-name-cell">{item.course}</td>
                                                <td style={{ textAlign: 'center' }} className={attendanceClass}>
                                                    {item.present} / {item.total}
                                                </td>
                                                <td style={{ textAlign: 'center' }} className={`${attendanceClass} percentage-bold`}>
                                                    {item.percentage.toFixed(2)}(%)
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>
                                No data available in table
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Controls */}
            {user?.role === 'student' && (
                <div className="lms-table-controls">
                    <div className="lms-entries-control">
                        Show &nbsp;
                        <select 
                            value={entriesPerPage} 
                            onChange={(e) => {
                                setEntriesPerPage(parseInt(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="lms-entries-select"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                        &nbsp; entries
                    </div>

                    <div className="lms-search-control">
                        Search: &nbsp;
                        <input 
                            type="text" 
                            value={searchTerm} 
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="lms-search-input"
                        />
                    </div>
                </div>
            )}

            {/* Daywise List / Session History */}
            <div className="lms-section-card daywise-card">
                <div className="lms-card-header">
                    {(user?.role === 'teacher' || user?.role === 'admin')
                        ? `Class Session History Log: ${classTeacherCourse}`
                        : 'Daywise course list'}
                </div>
                <div className="lms-card-body">
                    {(user?.role === 'teacher' || user?.role === 'admin') ? (
                        /* Teacher Session History List */
                        classSessionHistory.length > 0 ? (
                            <table className="lms-table daywise-table">
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'left', width: '40%' }}>Session Date</th>
                                        <th style={{ textAlign: 'center', width: '20%' }}>Day of Week</th>
                                        <th style={{ textAlign: 'center', width: '25%' }}>Students Present / Total</th>
                                        <th style={{ textAlign: 'center', width: '15%' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classSessionHistory.map((session, index) => {
                                        return (
                                            <tr key={index} className="lms-data-row">
                                                <td className="course-name-cell" style={{ fontWeight: '600' }}>
                                                    {session.date}
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    {session.day}
                                                </td>
                                                <td style={{ textAlign: 'center' }} className="percentage-bold text-success">
                                                    {session.present} / {session.total}
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <button 
                                                        onClick={() => handleDeleteClassSession(session.date)}
                                                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }}
                                                        title="Delete class session attendance"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>
                                No session history logs found for this course
                            </div>
                        )
                    ) : (
                        /* Original Student Daywise List */
                        <table className="lms-table daywise-table">
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'left', width: '50%' }}>Course</th>
                                    <th style={{ textAlign: 'center', width: '15%' }}>Attendance</th>
                                    <th style={{ textAlign: 'center', width: '18%' }}>Attendance document</th>
                                    <th style={{ textAlign: 'center', width: '17%' }}>Document status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedEntries.length > 0 ? (
                                    paginatedEntries.map((entryItem, index) => {
                                        const { dateKey, row } = entryItem;
                                        const isFirstOfGroup = index === 0 || paginatedEntries[index - 1].dateKey !== dateKey;

                                        return (
                                            <React.Fragment key={row.id}>
                                                {isFirstOfGroup && (
                                                    <tr className="lms-group-header-row">
                                                        <td colSpan={4} className="lms-group-header-cell">
                                                            {dateKey}
                                                        </td>
                                                    </tr>
                                                )}
                                                <tr className="lms-data-row">
                                                    <td className="course-name-cell">
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <span>{row.course}</span>
                                                            {row.isSupabase && (
                                                                <span style={{ 
                                                                    fontSize: '0.7rem', 
                                                                    backgroundColor: 'rgba(99, 102, 241, 0.15)', 
                                                                    color: '#818cf8',
                                                                    padding: '2px 6px',
                                                                    borderRadius: '4px',
                                                                    fontWeight: '600'
                                                                }}>
                                                                    Live
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        {row.present}/{row.total}
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        {row.present < row.total ? (
                                                            row.doc ? (
                                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                                    <a 
                                                                        href={row.doc} 
                                                                        target="_blank" 
                                                                        rel="noopener noreferrer" 
                                                                        className="lms-doc-link"
                                                                    >
                                                                        View Document
                                                                    </a>
                                                                </div>
                                                            ) : (
                                                                user?.role === 'student' ? (
                                                                    <button 
                                                                        onClick={() => handleUploadClick(row)}
                                                                        className="lms-upload-link"
                                                                    >
                                                                        Upload document
                                                                    </button>
                                                                ) : (
                                                                    <span>-</span>
                                                                )
                                                            )
                                                        ) : (
                                                            <span>-</span>
                                                        )}
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                                            <span className="doc-status-cell">{row.docStatus || '-'}</span>
                                                            {row.isSupabase && row.docStatus === 'Pending Approval' && (user?.role === 'teacher' || user?.role === 'admin') && (
                                                                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                                                    <button 
                                                                        onClick={() => handleApproveDocument(row.id)}
                                                                        className="lms-approve-btn"
                                                                    >
                                                                        Approve
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => handleRejectDocument(row.id)}
                                                                        className="lms-reject-btn"
                                                                    >
                                                                        Reject
                                                                    </button>
                                                                </div>
                                                            )}
                                                            {row.isSupabase && (user?.role === 'teacher' || user?.role === 'admin') && (
                                                                <button 
                                                                    onClick={() => handleTeacherDelete(row.id)}
                                                                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0, marginTop: '4px' }}
                                                                    title="Delete attendance record"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            </React.Fragment>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>
                                            No data available in table
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Pagination */}
            {user?.role === 'student' && (
                <div className="lms-pagination-footer">
                    <div className="lms-showing-text">
                        Showing {totalEntries > 0 ? startIndex + 1 : 0} to {endIndex} of {totalEntries} entries
                    </div>
                    <div className="lms-pagination-buttons">
                        <button 
                            onClick={handlePrevPage} 
                            disabled={currentPage === 1}
                            className="lms-page-btn"
                        >
                            Previous
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                            <button
                                key={pageNumber}
                                onClick={() => setCurrentPage(pageNumber)}
                                className={`lms-page-number ${currentPage === pageNumber ? 'active' : ''}`}
                            >
                                {pageNumber}
                            </button>
                        ))}

                        <button 
                            onClick={handleNextPage} 
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="lms-page-btn"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
            </>

            {/* Upload Modal */}
            {selectedUploadRow && (
                <div className="lms-modal-backdrop">
                    <div className="lms-modal-dialog">
                        <div className="lms-modal-header">
                            <span className="lms-modal-title">Student upload document</span>
                            <button className="lms-modal-close-btn" onClick={() => setSelectedUploadRow(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="lms-modal-body">
                            <table className="lms-modal-info-table">
                                <tbody>
                                    <tr>
                                        <td className="info-label" style={{ width: '30%' }}>Course:</td>
                                        <td className="info-value">{selectedUploadRow.course}</td>
                                    </tr>
                                    <tr>
                                        <td className="info-label">Class Date:</td>
                                        <td className="info-value">{selectedUploadRow.date}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <form onSubmit={handleUploadSubmit} className="lms-modal-form">
                                <div className="lms-file-input-row">
                                    <label className="file-field-label">
                                        Choose File: <span className="required-asterisk">*</span>
                                    </label>
                                    <div className="file-selector-group">
                                        <input 
                                            type="text" 
                                            value={fileNameText} 
                                            placeholder="File Name"
                                            readOnly 
                                            className="lms-file-name-display"
                                        />
                                        <label className="lms-browse-btn">
                                            Browse
                                            <input 
                                                type="file" 
                                                onChange={handleFileChange}
                                                accept=".jpeg,.jpg,.png,.pdf,.doc,.docx,.txt"
                                                style={{ display: 'none' }}
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="lms-modal-notes">
                                    <p>Note*: 1. Only .jpeg, .jpg, .png, .pdf, .doc, .docx, .txt file formats are allowed.</p>
                                    <p style={{ marginLeft: '42px' }}>2. Maximum file size is 5MB.</p>
                                </div>

                                <div className="lms-modal-footer">
                                    <button 
                                        type="submit" 
                                        className="lms-btn-submit"
                                        disabled={!selectedFile}
                                    >
                                        Submit
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setSelectedUploadRow(null)} 
                                        className="lms-btn-cancel"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Attendance;
