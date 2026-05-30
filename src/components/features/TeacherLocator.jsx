"use client";
import React, { useState, useEffect, useRef } from 'react';
import { mockBackend } from '../../services/mockBackend';
import { 
    MapPin, Search, Radio, Compass, Users, CheckCircle, Clock, 
    Play, Sliders, ChevronRight, AlertCircle, Cpu, Wifi
} from 'lucide-react';
import './TeacherLocator.css';

const TeacherLocator = () => {
    // Load initial teacher locations from mockBackend
    const [teachers, setTeachers] = useState(() => {
        return mockBackend.teacherLocations || [
            { id: 1, name: 'Dr. Bhavana', subject: 'Applied Mathematics II', dept: 'Mathematics', room: 'M Block 402', lastSpotted: '30 mins ago', status: 'On Track', coords: { x: 35, y: 40 } },
            { id: 2, name: 'Dr. White', subject: 'Applied Physics', dept: 'Physics', room: 'Physics Lab A', lastSpotted: '15 mins ago', status: 'On Track', coords: { x: 75, y: 25 } },
            { id: 3, name: 'Prof. Alan', subject: 'C Programming Lab', dept: 'Computer Science', room: 'CS Lab 1', lastSpotted: '5 mins ago', status: 'On Track', coords: { x: 55, y: 70 } },
            { id: 4, name: 'Prof. Jones', subject: 'Communication Skills - 2', dept: 'Humanities', room: 'Seminar Hall 1', lastSpotted: '2 hours ago', status: 'Unscheduled Spot', coords: { x: 15, y: 80 } }
        ];
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTeacherId, setSelectedTeacherId] = useState(1);
    
    // Console log feed simulation
    const [consoleLogs, setConsoleLogs] = useState([
        { time: '09:15:02', camera: 'CAM_M_402', text: 'Face recognition node initialized successfully.' },
        { time: '09:15:10', camera: 'CAM_PHYS_A', text: 'ESP32 Cam Node 4 connected to local mesh.' },
        { time: '09:17:40', camera: 'CAM_SEM_1', text: 'Detection stream open for Prof. Jones.' },
        { time: '09:20:15', camera: 'CAM_CS_LAB1', text: 'Prof. Alan face detected. Confidence score: 98.4%' },
        { time: '09:32:44', camera: 'CAM_PHYS_A', text: 'Dr. White face detected. Confidence score: 99.1%' },
        { time: '09:47:16', camera: 'CAM_M_402', text: 'Dr. Bhavana face detected. Confidence score: 99.7%' }
    ]);

    // Map room names to map coordinates percentages
    const roomCoordinates = {
        'M Block 402': { x: 40, y: 42 },
        'L-301 Classroom': { x: 42, y: 38 },
        'CS Lab 1': { x: 58, y: 68 },
        'CS Lab 2': { x: 62, y: 74 },
        'Physics Lab A': { x: 80, y: 24 },
        'Seminar Hall 1': { x: 22, y: 78 },
        'Seminar Hall 2': { x: 25, y: 84 },
        'Library Room 2': { x: 82, y: 72 },
        'Admin Block A': { x: 48, y: 14 }
    };

    // Scheduled rooms mapping based on current timetable
    const scheduledRooms = {
        'Dr. Bhavana': 'M Block 402',
        'Dr. White': 'Physics Lab A',
        'Prof. Alan': 'CS Lab 1',
        'Prof. Jones': 'L-301 Classroom'
    };

    const consoleEndRef = useRef(null);

    useEffect(() => {
        if (consoleEndRef.current) {
            consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [consoleLogs]);

    // Filter teachers list based on query
    const filteredTeachers = teachers.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.dept.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedTeacher = teachers.find(t => t.id === selectedTeacherId) || teachers[0];

    return (
        <div className="teacher-locator-container animate-enter">
            {/* Page Header */}
            <div className="welcome-banner" style={{ marginBottom: '1.5rem' }}>
                <div>
                    <h2>Live Teacher Radar 📡</h2>
                    <p>Correlates facial recognition model scan-taps with student class schedules in real-time.</p>
                </div>
                <div className="date-badge">
                    <Radio size={16} className="pulse-anim" color="#10b981" />
                    <span>Live Tracking Node Sync: OK</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="locator-stats-grid">
                <div className="locator-stat-card">
                    <div className="locator-stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
                        <Users size={22} />
                    </div>
                    <div className="locator-stat-content">
                        <h3>Faculty Tracked</h3>
                        <div className="locator-stat-value">{teachers.length} Active</div>
                    </div>
                </div>

                <div className="locator-stat-card">
                    <div className="locator-stat-icon" style={{ background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24' }}>
                        <Compass size={22} />
                    </div>
                    <div className="locator-stat-content">
                        <h3>Active Mesh Nodes</h3>
                        <div className="locator-stat-value">9 Gateways</div>
                    </div>
                </div>

                <div className="locator-stat-card">
                    <div className="locator-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                        <Cpu size={22} />
                    </div>
                    <div className="locator-stat-content">
                        <h3>Recognition Model</h3>
                        <div className="locator-stat-value">Gemini Face v1.4</div>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="locator-grid-layout">
                {/* Left Section: Search & List */}
                <div className="locator-section-card">
                    <div className="locator-section-header">
                        <h3>Faculty Registry Logs</h3>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                            Select lecturer to view on Map
                        </span>
                    </div>

                    <div className="locator-search-bar">
                        <Search size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by name, department, or course..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="teachers-tracker-list">
                        {filteredTeachers.map(t => {
                            const isSelected = t.id === selectedTeacherId;
                            const isExpected = scheduledRooms[t.name] === t.room;
                            return (
                                <div 
                                    key={t.id} 
                                    className={`teacher-tracker-card ${isSelected ? 'active-selection' : ''}`}
                                    onClick={() => setSelectedTeacherId(t.id)}
                                >
                                    <div className="teacher-tracker-avatar">
                                        {t.name.split(' ').pop().charAt(0).toUpperCase()}
                                    </div>
                                    <div className="teacher-tracker-details">
                                        <div className="teacher-tracker-name">{t.name}</div>
                                        <div className="teacher-tracker-sub">{t.subject} • {t.dept}</div>
                                    </div>
                                    <div className="teacher-tracker-status-col">
                                        <div className="spotted-location-badge">
                                            <MapPin size={12} />
                                            <span>{t.room}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span className="spotted-time-label">{t.lastSpotted}</span>
                                            <span className={`locator-sync-tag ${t.status === 'On Track' ? 'on-track' : 'unscheduled'}`}>
                                                {t.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {filteredTeachers.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                No tracked faculty matches your query.
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Section: Visual Map & Live Camera Stream Console */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="locator-section-card">
                        <div className="locator-section-header">
                            <h3>Live Campus Radar Map</h3>
                        </div>

                        <div className="campus-map-wrapper">
                            <div className="map-grid-layer" />

                            {/* Map Blocks Layout */}
                            <div className="campus-block" style={{ top: '5%', left: '35%', width: '28%', height: '18%' }}>
                                Admin Block
                            </div>
                            <div className="campus-block" style={{ top: '25%', left: '5%', width: '22%', height: '22%' }}>
                                Science Block
                            </div>
                            <div className="campus-block" style={{ top: '30%', left: '30%', width: '22%', height: '22%' }}>
                                M Block (Math)
                            </div>
                            <div className="campus-block" style={{ top: '12%', left: '72%', width: '22%', height: '18%' }}>
                                Physics Wing
                            </div>
                            <div className="campus-block" style={{ top: '58%', left: '42%', width: '26%', height: '22%' }}>
                                CSE Building
                            </div>
                            <div className="campus-block" style={{ top: '65%', left: '75%', width: '20%', height: '26%' }}>
                                Library Center
                            </div>
                            <div className="campus-block" style={{ top: '75%', left: '5%', width: '25%', height: '18%' }}>
                                Seminar Complex
                            </div>

                            {/* Active Teacher Pins on Map */}
                            {teachers.map(t => {
                                const isSelected = t.id === selectedTeacherId;
                                return (
                                    <div 
                                        key={t.id}
                                        className="map-marker-pin"
                                        style={{ 
                                            top: `${t.coords.y}%`, 
                                            left: `${t.coords.x}%`,
                                            zIndex: isSelected ? 20 : 10 
                                        }}
                                        onClick={() => setSelectedTeacherId(t.id)}
                                    >
                                        <div className="marker-pulse" style={{ background: isSelected ? '#fbbf24' : '#4f46e5' }} />
                                        <div 
                                            className="map-marker-avatar"
                                            style={{ 
                                                background: isSelected ? '#fbbf24' : '#4f46e5',
                                                color: isSelected ? '#000' : '#fff',
                                                borderColor: isSelected ? '#fbbf24' : '#fff'
                                            }}
                                        >
                                            {t.name.split(' ').pop().charAt(0).toUpperCase()}
                                        </div>
                                        <div className="marker-tooltip">
                                            <strong>{t.name}</strong>: {t.room} ({t.lastSpotted})
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Selected Lecturer Card Detail */}
                        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 14px' }}>
                            <h4 style={{ fontSize: '0.88rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <MapPin size={14} color="#fbbf24" />
                                Selection: {selectedTeacher.name}
                            </h4>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                <div><strong>Spotted Location:</strong> {selectedTeacher.room}</div>
                                <div><strong>Expected Room:</strong> {scheduledRooms[selectedTeacher.name] || 'None'}</div>
                                <div><strong>Last Synced:</strong> {selectedTeacher.lastSpotted}</div>
                                <div><strong>Department:</strong> {selectedTeacher.dept}</div>
                            </div>
                        </div>
                    </div>

                    {/* Facial Recognition Node Terminal Stream */}
                    <div className="telemetry-console-wrapper">
                        <div className="telemetry-console-header">
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Wifi size={12} /> Live Telemetry Feed</span>
                            <div className="telemetry-stream-indicator">
                                <span className="dot" />
                                <span>MESH STREAM LIVE</span>
                            </div>
                        </div>
                        <div className="telemetry-console-body">
                            {consoleLogs.map((log, i) => (
                                <div key={i} className="telemetry-log-line">
                                    <span className="time">[{log.time}]</span>
                                    <span className="camera">[{log.camera}]</span>
                                    <span>{log.text}</span>
                                </div>
                            ))}
                            <div ref={consoleEndRef} />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default TeacherLocator;
