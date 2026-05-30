"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
    Building2, Calendar, Clock, User, Plus, Trash2, 
    Check, AlertCircle, BookOpen, Users, CheckCircle2, 
    Info, ShieldAlert, CalendarDays, Search, HelpCircle, MapPin
} from 'lucide-react';
import './FeatureStyles.css';

// Pre-seeded rooms
const ROOMS = [
    { id: 'cs-lab-1', name: 'CS Lab 1', type: 'Laboratory', dept: 'Computer Science', location: 'C Block, 3rd Floor', capacity: 60, sys: '60 MATLAB PCs' },
    { id: 'cs-lab-2', name: 'CS Lab 2', type: 'Laboratory', dept: 'Computer Science', location: 'C Block, 3rd Floor', capacity: 60, sys: '60 Linux PCs' },
    { id: 'ece-lab', name: 'ECE Lab', type: 'Laboratory', dept: 'Electronics & Comm', location: 'E Block, 2nd Floor', capacity: 45, sys: 'MATLAB / Oscilloscopes' },
    { id: 'mech-lab', name: 'Mechanical Lab', type: 'Laboratory', dept: 'Mechanical Engg', location: 'M Block, Ground Floor', capacity: 50, sys: 'CNC Machines' },
    { id: 'civ-lab', name: 'Civil Engineering Lab', type: 'Laboratory', dept: 'Civil Engg', location: 'V Block, Ground Floor', capacity: 40, sys: 'Structural Testing Rig' },
    { id: 'm-402', name: 'M Block 402 Classroom', type: 'Lecture Hall', dept: 'Mathematics', location: 'M Block, 4th Floor', capacity: 70, sys: 'Projector / Smartboard' },
    { id: 'm-403', name: 'M Block 403 Classroom', type: 'Lecture Hall', dept: 'Mathematics', location: 'M Block, 4th Floor', capacity: 70, sys: 'Projector' },
    { id: 'seminar-1', name: 'Seminar Hall 1', type: 'Auditorium', dept: 'Admin Block', location: 'Admin Block, 1st Floor', capacity: 150, sys: 'Dual Projector / Audio PA' },
    { id: 'phy-lab-a', name: 'Physics Lab A', type: 'Laboratory', dept: 'Applied Physics', location: 'S Block, 1st Floor', capacity: 40, sys: 'Optics Kits' }
];

// Time slots
const TIME_SLOTS = [
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 01:00 PM',
    '02:00 PM - 03:00 PM',
    '03:00 PM - 04:00 PM',
    '04:00 PM - 05:00 PM'
];

export default function ClassroomBooking() {
    const { user } = useAuth();
    
    // Get today's date in YYYY-MM-DD local format
    const getTodayString = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const [selectedDate, setSelectedDate] = useState(getTodayString());
    const [selectedRoom, setSelectedRoom] = useState(ROOMS[0].id);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('All');

    // Booking form state
    const [bookingSlot, setBookingSlot] = useState('');
    const [bookingBranch, setBookingBranch] = useState('CSE');
    const [bookingSem, setBookingSem] = useState('4th Sem');
    const [bookingSec, setBookingSec] = useState('A');
    const [bookingCourse, setBookingCourse] = useState('');
    
    // Status states
    const [alertMessage, setAlertMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Bookings state
    const [bookings, setBookings] = useState([]);

    // Seed initial bookings on mount (or whenever date changes)
    useEffect(() => {
        // Create dynamic date seeds for "today"
        const today = getTodayString();
        
        const seededBookings = [
            {
                id: 'seed-1',
                roomId: 'cs-lab-1',
                date: today,
                timeSlot: '11:00 AM - 12:00 PM',
                teacherName: 'Prof. Alan',
                course: 'C Programming Lab',
                branch: 'CSE',
                sem: '2nd Sem',
                section: 'A',
                isSeed: true
            },
            {
                id: 'seed-2',
                roomId: 'ece-lab',
                date: today,
                timeSlot: '02:00 PM - 03:00 PM',
                teacherName: 'Dr. Bhavana',
                course: 'MATLAB course',
                branch: 'ECE',
                sem: '4th Sem',
                section: 'B',
                isSeed: true
            },
            {
                id: 'seed-3',
                roomId: 'm-402',
                date: today,
                timeSlot: '09:00 AM - 10:00 AM',
                teacherName: 'Dr. White',
                course: 'Applied Physics',
                branch: 'ECE',
                sem: '2nd Sem',
                section: 'C',
                isSeed: true
            },
            {
                id: 'seed-4',
                roomId: 'cs-lab-2',
                date: today,
                timeSlot: '03:00 PM - 04:00 PM',
                teacherName: 'Prof. Alan',
                course: 'Data Structures Lab',
                branch: 'CSE',
                sem: '4th Sem',
                section: 'A',
                isSeed: true
            }
        ];
        
        setBookings(seededBookings);
    }, []);

    // Filter rooms list
    const filteredRooms = ROOMS.filter(room => {
        const matchesQuery = room.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             room.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             room.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'All' || room.type === filterType;
        return matchesQuery && matchesType;
    });

    const activeRoomDetail = ROOMS.find(r => r.id === selectedRoom) || ROOMS[0];

    // Check if slot is booked
    const getBookingForSlot = (roomId, date, slot) => {
        return bookings.find(b => b.roomId === roomId && b.date === date && b.timeSlot === slot);
    };

    // Handle book submission
    const handleBookRoom = (e) => {
        e.preventDefault();

        if (!bookingSlot) {
            setAlertMessage("Please select a time slot first.");
            return;
        }

        if (!bookingCourse.trim()) {
            setAlertMessage("Please enter a course or subject name.");
            return;
        }

        // Check conflict
        const conflict = getBookingForSlot(selectedRoom, selectedDate, bookingSlot);
        if (conflict) {
            setAlertMessage(`🚨 Conflict Detected! ${activeRoomDetail.name} is already booked at ${bookingSlot} by ${conflict.teacherName} for "${conflict.course}".`);
            return;
        }

        // Create booking
        const newBooking = {
            id: `booking-${Date.now()}`,
            roomId: selectedRoom,
            date: selectedDate,
            timeSlot: bookingSlot,
            teacherName: user?.name || 'Dr. Bhavana',
            course: bookingCourse,
            branch: bookingBranch,
            sem: bookingSem,
            section: bookingSec
        };

        setBookings(prev => [...prev, newBooking]);
        setSuccessMessage(`🎉 Successfully booked ${activeRoomDetail.name} for ${bookingSlot}!`);
        
        // Reset booking form values
        setBookingCourse('');
        setBookingSlot('');
        setAlertMessage(null);

        // Auto clear toast
        setTimeout(() => setSuccessMessage(null), 5000);
    };

    // Cancel booking
    const handleCancelBooking = (bookingId) => {
        const targetBooking = bookings.find(b => b.id === bookingId);
        if (!targetBooking) return;

        // Allow cancellation if user is the teacher who booked it, or user is admin, or we are in demo mode
        const isOwner = targetBooking.teacherName === (user?.name || 'Dr. Bhavana');
        const isAdmin = user?.role === 'admin';

        if (!isOwner && !isAdmin) {
            setAlertMessage("Permission Denied: You can only cancel your own room bookings.");
            setTimeout(() => setAlertMessage(null), 4000);
            return;
        }

        setBookings(prev => prev.filter(b => b.id !== bookingId));
        setSuccessMessage(`Booking cancelled: ${ROOMS.find(r => r.id === targetBooking.roomId)?.name} slot at ${targetBooking.timeSlot} is now vacant.`);
        setTimeout(() => setSuccessMessage(null), 4000);
    };

    // Calculate metrics
    const totalBookingsToday = bookings.filter(b => b.date === selectedDate).length;
    
    // Find room with most bookings today
    const getPeakOccupancyRoom = () => {
        const todayBookings = bookings.filter(b => b.date === selectedDate);
        if (todayBookings.length === 0) return 'None';
        
        const counts = {};
        todayBookings.forEach(b => {
            counts[b.roomId] = (counts[b.roomId] || 0) + 1;
        });

        let maxRoomId = '';
        let maxCount = -1;
        Object.entries(counts).forEach(([id, count]) => {
            if (count > maxCount) {
                maxCount = count;
                maxRoomId = id;
            }
        });

        const r = ROOMS.find(room => room.id === maxRoomId);
        return r ? `${r.name} (${maxCount} slots)` : 'None';
    };

    const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'admin';

    return (
        <div className="feature-container classroom-booking-container animate-enter" style={{ color: 'var(--text-primary)' }}>
            
            {/* Header Area */}
            <div className="feature-header" style={{ marginBottom: '2rem' }}>
                <div className="header-text">
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        Classroom & Lab Booking Desk 🏛️
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Reserve technical laboratories and standard lecture halls for specific branches, sections, and courses.
                    </p>
                </div>
            </div>

            {/* Top Metrics Row */}
            <div className="booking-metrics-grid" style={metricsGridStyle}>
                <div className="stat-card" style={statCardStyle}>
                    <span style={statLabelStyle}>Date Context</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                        <Calendar size={18} color="var(--accent-primary)" />
                        <input 
                            type="date" 
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            style={dateInputStyle}
                        />
                    </div>
                </div>
                <div className="stat-card" style={statCardStyle}>
                    <span style={statLabelStyle}>Active Bookings Today</span>
                    <div style={statValueStyle}>{totalBookingsToday} Reserved</div>
                    <span style={statSubStyle}>Across all blocks</span>
                </div>
                <div className="stat-card" style={statCardStyle}>
                    <span style={statLabelStyle}>Peak Occupancy Room</span>
                    <div style={{ ...statValueStyle, fontSize: '1.15rem', color: 'var(--accent-action)' }}>
                        {getPeakOccupancyRoom()}
                    </div>
                    <span style={statSubStyle}>Most scheduled today</span>
                </div>
                <div className="stat-card" style={statCardStyle}>
                    <span style={statLabelStyle}>Logged in user</span>
                    <div style={{ ...statValueStyle, fontSize: '1.15rem', color: 'var(--accent-secondary)' }}>
                        {user?.name || 'Dr. Bhavana'}
                    </div>
                    <span style={statSubStyle}>Role: {user?.role || 'Teacher'}</span>
                </div>
            </div>

            {/* Notification Toasts */}
            {successMessage && (
                <div className="booking-toast success" style={toastSuccessStyle}>
                    <CheckCircle2 size={18} />
                    <span>{successMessage}</span>
                </div>
            )}
            {alertMessage && (
                <div className="booking-toast warning" style={toastWarningStyle}>
                    <AlertCircle size={18} />
                    <span>{alertMessage}</span>
                    <button style={toastCloseStyle} onClick={() => setAlertMessage(null)}>×</button>
                </div>
            )}

            {/* Layout Grid */}
            <div className="booking-workspace-grid" style={workspaceGridStyle}>
                
                {/* Left Column: Room list and search */}
                <div className="workspace-column" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="card" style={{ padding: '1.25rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Building2 size={16} /> Choose Classroom or Lab
                        </h3>

                        {/* Search and Filters */}
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <Search size={16} style={searchIconStyle} />
                                <input 
                                    type="text" 
                                    placeholder="Search by name, block..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={searchInputStyle}
                                />
                            </div>
                            <select 
                                value={filterType} 
                                onChange={(e) => setFilterType(e.target.value)}
                                style={filterSelectStyle}
                            >
                                <option value="All">All Types</option>
                                <option value="Laboratory">Labs Only</option>
                                <option value="Lecture Hall">Classrooms</option>
                                <option value="Auditorium">Auditoriums</option>
                            </select>
                        </div>

                        {/* Rooms List */}
                        <div style={roomsListWrapperStyle}>
                            {filteredRooms.length > 0 ? (
                                filteredRooms.map(room => {
                                    const isSelected = room.id === selectedRoom;
                                    const roomBookingsToday = bookings.filter(b => b.roomId === room.id && b.date === selectedDate).length;
                                    
                                    return (
                                        <div 
                                            key={room.id}
                                            onClick={() => setSelectedRoom(room.id)}
                                            style={{
                                                ...roomListItemStyle,
                                                borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-color)',
                                                background: isSelected ? 'rgba(129, 140, 248, 0.05)' : 'rgba(255,255,255,0.01)'
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div>
                                                    <span style={roomNameStyle}>{room.name}</span>
                                                    <span style={roomTagStyle}>{room.type} • {room.dept}</span>
                                                </div>
                                                <span style={{
                                                    ...roomBookingsBadgeStyle,
                                                    background: roomBookingsToday > 0 ? 'rgba(251, 191, 36, 0.15)' : 'rgba(52, 211, 153, 0.15)',
                                                    color: roomBookingsToday > 0 ? 'var(--accent-action)' : 'var(--success)',
                                                }}>
                                                    {roomBookingsToday} Booked
                                                </span>
                                            </div>
                                            
                                            <div style={roomMetaStyle}>
                                                <MapPin size={12} style={{ color: 'var(--text-secondary)' }} />
                                                <span>{room.location}</span>
                                                <span style={{ margin: '0 4px' }}>•</span>
                                                <span>Cap: {room.capacity}</span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div style={emptyStateStyle}>
                                    No rooms match your filter.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Center Column: Interactive Timeline & Booking Panel */}
                <div className="workspace-column" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    
                    {/* Visual Daily Timeline */}
                    <div className="card" style={{ padding: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
                                    {activeRoomDetail.name} Daily Schedule
                                </h3>
                                <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    {activeRoomDetail.location} ({activeRoomDetail.sys})
                                </p>
                            </div>
                            <span style={timelineDateBadgeStyle}>
                                {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </span>
                        </div>

                        {/* Slots Stack */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {TIME_SLOTS.map(slot => {
                                const booking = getBookingForSlot(activeRoomDetail.id, selectedDate, slot);
                                const isBooked = !!booking;
                                const isUserBooking = isBooked && booking.teacherName === (user?.name || 'Dr. Bhavana');
                                
                                return (
                                    <div 
                                        key={slot}
                                        style={{
                                            ...slotRowStyle,
                                            borderColor: isBooked ? 'var(--border-color)' : 'rgba(52, 211, 153, 0.2)',
                                            background: isBooked 
                                                ? (isUserBooking ? 'rgba(192, 132, 252, 0.05)' : 'rgba(251, 113, 133, 0.02)')
                                                : 'rgba(52, 211, 153, 0.01)'
                                        }}
                                    >
                                        <div style={slotTimeColStyle}>
                                            <Clock size={14} style={{ color: 'var(--text-secondary)' }} />
                                            <span>{slot}</span>
                                        </div>

                                        {isBooked ? (
                                            <div style={slotStatusColStyle}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{
                                                        ...bookedBadgeStyle,
                                                        background: isUserBooking ? 'rgba(192, 132, 252, 0.2)' : 'rgba(251, 113, 133, 0.15)',
                                                        color: isUserBooking ? '#c084fc' : '#fb7185'
                                                    }}>
                                                        {isUserBooking ? 'My Booking' : 'Booked'}
                                                    </span>
                                                    <span style={bookedDetailsStyle}>
                                                        <strong>{booking.course}</strong> by {booking.teacherName} ({booking.branch} Sec {booking.section})
                                                    </span>
                                                </div>
                                                
                                                {isTeacherOrAdmin && (isUserBooking || user?.role === 'admin') && (
                                                    <button 
                                                        onClick={() => handleCancelBooking(booking.id)}
                                                        style={cancelSlotBtnStyle}
                                                        title="Cancel reservation"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <div style={slotStatusColStyle}>
                                                <span style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: 600 }}>
                                                    Available
                                                </span>
                                                
                                                {isTeacherOrAdmin ? (
                                                    <button 
                                                        onClick={() => {
                                                            setBookingSlot(slot);
                                                            setAlertMessage(null);
                                                            // Scroll to booking form on mobile
                                                            document.getElementById('booking-form-box')?.scrollIntoView({ behavior: 'smooth' });
                                                        }}
                                                        style={{
                                                            ...bookSlotBtnStyle,
                                                            borderColor: bookingSlot === slot ? 'var(--accent-action)' : 'var(--success)',
                                                            background: bookingSlot === slot ? 'rgba(251, 191, 36, 0.1)' : 'transparent',
                                                            color: bookingSlot === slot ? 'var(--accent-action)' : 'var(--success)'
                                                        }}
                                                    >
                                                        {bookingSlot === slot ? 'Selected ✓' : 'Reserve Slot'}
                                                    </button>
                                                ) : (
                                                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                                                        View Only
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Booking Form (Teacher / Admin exclusive) */}
                    {isTeacherOrAdmin ? (
                        <div id="booking-form-box" className="card" style={{ padding: '1.25rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Plus size={16} color="var(--accent-primary)" /> Make a Classroom Reservation
                            </h3>

                            <form onSubmit={handleBookRoom} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={formLabelStyle}>Selected Room</label>
                                    <input 
                                        type="text" 
                                        value={`${activeRoomDetail.name} (${activeRoomDetail.location})`}
                                        disabled
                                        style={formInputDisabledStyle}
                                    />
                                </div>

                                <div>
                                    <label style={formLabelStyle}>Selected Time Slot *</label>
                                    <select 
                                        value={bookingSlot}
                                        onChange={(e) => setBookingSlot(e.target.value)}
                                        style={formSelectStyle}
                                        required
                                    >
                                        <option value="">-- Choose Slot --</option>
                                        {TIME_SLOTS.map(slot => {
                                            const booked = getBookingForSlot(activeRoomDetail.id, selectedDate, slot);
                                            return (
                                                <option key={slot} value={slot} disabled={!!booked}>
                                                    {slot} {booked ? '(Booked)' : ''}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                                <div>
                                    <label style={formLabelStyle}>Target Course / Subject *</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Matlab course, Physics Lab"
                                        value={bookingCourse}
                                        onChange={(e) => setBookingCourse(e.target.value)}
                                        style={formInputStyle}
                                        required
                                    />
                                </div>

                                <div>
                                    <label style={formLabelStyle}>Target Branch / Department</label>
                                    <select 
                                        value={bookingBranch}
                                        onChange={(e) => setBookingBranch(e.target.value)}
                                        style={formSelectStyle}
                                    >
                                        <option value="CSE">Computer Science (CSE)</option>
                                        <option value="ECE">Electronics (ECE)</option>
                                        <option value="ISE">Information Science (ISE)</option>
                                        <option value="AIML">Artificial Intelligence (AIML)</option>
                                        <option value="ME">Mechanical Engg (ME)</option>
                                        <option value="CV">Civil Engg (CV)</option>
                                    </select>
                                </div>

                                <div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={formLabelStyle}>Semester</label>
                                            <select 
                                                value={bookingSem}
                                                onChange={(e) => setBookingSem(e.target.value)}
                                                style={formSelectStyle}
                                            >
                                                <option value="1st Sem">1st Sem</option>
                                                <option value="2nd Sem">2nd Sem</option>
                                                <option value="3rd Sem">3rd Sem</option>
                                                <option value="4th Sem">4th Sem</option>
                                                <option value="5th Sem">5th Sem</option>
                                                <option value="6th Sem">6th Sem</option>
                                                <option value="7th Sem">7th Sem</option>
                                                <option value="8th Sem">8th Sem</option>
                                            </select>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={formLabelStyle}>Section</label>
                                            <select 
                                                value={bookingSec}
                                                onChange={(e) => setBookingSec(e.target.value)}
                                                style={formSelectStyle}
                                            >
                                                <option value="A">Section A</option>
                                                <option value="B">Section B</option>
                                                <option value="C">Section C</option>
                                                <option value="D">Section D</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ gridColumn: 'span 2', marginTop: '5px' }}>
                                    <button type="submit" style={submitBtnStyle}>
                                        Confirm Reservation 🚀
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="card" style={studentRestrictionCardStyle}>
                            <ShieldAlert size={36} color="var(--accent-secondary)" style={{ marginBottom: '10px' }} />
                            <h3 style={{ margin: '0 0 5px 0', fontSize: '0.95rem', fontWeight: 800 }}>Student/Parent View Only</h3>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                                You are logged in as a {user?.role || 'Student'}. You can check live classroom availability, but room reservation capabilities are restricted to faculty members.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Active Bookings List */}
            <div className="card" style={{ marginTop: '1.5rem', padding: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CalendarDays size={18} color="var(--accent-primary)" /> Live Campus Reservations (Active Stack)
                </h3>
                
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '-8px', marginBottom: '1.25rem' }}>
                    Review room schedules across all departments. Filtered to showing schedules booked for: <strong>{selectedDate}</strong>.
                </p>

                <div style={tableWrapperStyle}>
                    <table className="lms-table" style={{ width: '100%', margin: 0 }}>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time Slot</th>
                                <th>Classroom / Lab</th>
                                <th>Course / Topic</th>
                                <th>Target Group</th>
                                <th>Instructor</th>
                                <th>Status</th>
                                {isTeacherOrAdmin && <th>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.filter(b => b.date === selectedDate).length > 0 ? (
                                bookings
                                    .filter(b => b.date === selectedDate)
                                    .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot))
                                    .map(b => {
                                        const room = ROOMS.find(r => r.id === b.roomId);
                                        const isOwn = b.teacherName === (user?.name || 'Dr. Bhavana');
                                        
                                        return (
                                            <tr key={b.id} style={{ background: isOwn ? 'rgba(129,140,248,0.02)' : 'transparent' }}>
                                                <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{b.date}</td>
                                                <td style={{ fontWeight: 'bold' }}>{b.timeSlot}</td>
                                                <td style={{ fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                                                    {room ? room.name : b.roomId}
                                                </td>
                                                <td>{b.course}</td>
                                                <td style={{ fontSize: '0.8rem' }}>
                                                    {b.branch} | {b.sem} - Sec {b.section}
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <User size={12} color="var(--text-secondary)" />
                                                        <span>{b.teacherName}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span style={{
                                                        fontSize: '0.68rem',
                                                        fontWeight: 'bold',
                                                        padding: '2px 8px',
                                                        borderRadius: '4px',
                                                        background: 'rgba(251, 191, 36, 0.15)',
                                                        color: 'var(--accent-action)',
                                                        border: '1px solid rgba(251, 191, 36, 0.3)'
                                                    }}>
                                                        Booked
                                                    </span>
                                                </td>
                                                {isTeacherOrAdmin && (
                                                    <td>
                                                        {(isOwn || user?.role === 'admin') ? (
                                                            <button 
                                                                onClick={() => handleCancelBooking(b.id)}
                                                                style={cancelTableBtnStyle}
                                                            >
                                                                <Trash2 size={13} style={{ marginRight: '4px' }} /> Cancel
                                                            </button>
                                                        ) : (
                                                            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Locked</span>
                                                        )}
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })
                            ) : (
                                <tr>
                                    <td colSpan={isTeacherOrAdmin ? 8 : 7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                                        No active bookings recorded for {selectedDate}. Choose a slot above to book!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Helper Guide */}
            <div className="card" style={guideCardStyle}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.88rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <HelpCircle size={14} color="var(--accent-primary)" /> Scheduler Conflict-Prevention Engine
                </h4>
                <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    Connect & Prep includes a stateful conflict prevention scheduler. If a classroom or laboratory is reserved, the database locks that slot for the specific date. Any other teachers attempting to double-book will be blocked, and visual availability checks will turn off reservation actions to maintain strict schedule integrity across the college.
                </p>
            </div>
        </div>
    );
}

// Inline Styles to maintain UI independence and consistency with zinc dashboard style
const metricsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem'
};

const statCardStyle = {
    background: 'var(--bg-card)',
    border: '1.5px solid var(--border-color)',
    borderRadius: '12px',
    padding: '1rem 1.25rem',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
};

const statLabelStyle = {
    fontSize: '0.68rem',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
};

const statValueStyle = {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
    marginTop: '4px',
    lineHeight: '1.2'
};

const statSubStyle = {
    fontSize: '0.65rem',
    color: 'var(--text-secondary)',
    marginTop: '4px'
};

const dateInputStyle = {
    background: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    borderRadius: '6px',
    padding: '6px 10px',
    fontSize: '0.8rem',
    outline: 'none',
    cursor: 'pointer',
    width: '100%'
};

const workspaceGridStyle = {
    display: 'grid',
    gridTemplateColumns: '0.9fr 1.1fr',
    gap: '1.5rem',
    alignItems: 'start'
};

const searchIconStyle = {
    position: 'absolute',
    left: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-secondary)'
};

const searchInputStyle = {
    width: '100%',
    background: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    borderRadius: '8px',
    padding: '8px 12px 8px 32px',
    fontSize: '0.82rem',
    outline: 'none'
};

const filterSelectStyle = {
    background: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '0.82rem',
    outline: 'none',
    cursor: 'pointer'
};

const roomsListWrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxHeight: '430px',
    overflowY: 'auto',
    paddingRight: '4px',
    marginTop: '5px'
};

const roomListItemStyle = {
    border: '1.5px solid var(--border-color)',
    borderRadius: '8px',
    padding: '10px 12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
};

const roomNameStyle = {
    display: 'block',
    fontSize: '0.88rem',
    fontWeight: '800',
    color: 'var(--text-primary)'
};

const roomTagStyle = {
    display: 'block',
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
    marginTop: '2px'
};

const roomBookingsBadgeStyle = {
    fontSize: '0.62rem',
    fontWeight: 'bold',
    padding: '2px 8px',
    borderRadius: '4px'
};

const roomMetaStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.72rem',
    color: 'var(--text-secondary)',
    borderTop: '1px solid rgba(255, 255, 255, 0.03)',
    paddingTop: '6px'
};

const emptyStateStyle = {
    textAlign: 'center',
    padding: '2rem 1rem',
    color: 'var(--text-secondary)',
    fontSize: '0.82rem'
};

const timelineDateBadgeStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--border-color)',
    padding: '4px 10px',
    borderRadius: '15px',
    fontSize: '0.72rem',
    fontWeight: 'bold',
    color: 'var(--accent-primary)'
};

const slotRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 14px',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    gap: '12px'
};

const slotTimeColStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.82rem',
    fontWeight: '700',
    width: '160px',
    flexShrink: 0
};

const slotStatusColStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    gap: '10px'
};

const bookedBadgeStyle = {
    fontSize: '0.68rem',
    fontWeight: '800',
    padding: '2px 8px',
    borderRadius: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
    flexShrink: 0
};

const bookedDetailsStyle = {
    fontSize: '0.78rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.3
};

const bookSlotBtnStyle = {
    border: '1px solid',
    background: 'transparent',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '0.72rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
};

const cancelSlotBtnStyle = {
    background: 'rgba(251, 113, 133, 0.1)',
    border: '1px solid rgba(251, 113, 133, 0.2)',
    color: '#fb7185',
    padding: '4px',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease'
};

const cancelTableBtnStyle = {
    background: 'rgba(251, 113, 133, 0.1)',
    border: '1px solid rgba(251, 113, 133, 0.2)',
    color: '#fb7185',
    padding: '4px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'all 0.15s ease'
};

const formLabelStyle = {
    display: 'block',
    fontSize: '0.72rem',
    fontWeight: 'bold',
    color: 'var(--text-secondary)',
    marginBottom: '5px',
    textTransform: 'uppercase',
    letterSpacing: '0.3px'
};

const formInputStyle = {
    width: '100%',
    background: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    borderRadius: '6px',
    padding: '8px 10px',
    fontSize: '0.82rem',
    outline: 'none'
};

const formInputDisabledStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
    borderRadius: '6px',
    padding: '8px 10px',
    fontSize: '0.82rem',
    cursor: 'not-allowed'
};

const formSelectStyle = {
    width: '100%',
    background: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    borderRadius: '6px',
    padding: '8px 10px',
    fontSize: '0.82rem',
    outline: 'none',
    cursor: 'pointer'
};

const submitBtnStyle = {
    width: '100%',
    background: 'var(--accent-primary)',
    color: 'var(--text-inverse)',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 0',
    fontSize: '0.88rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: 'var(--shadow-sm)'
};

const toastSuccessStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    borderRadius: '8px',
    background: 'rgba(52, 211, 153, 0.15)',
    border: '1px solid var(--success)',
    color: 'var(--success)',
    fontSize: '0.82rem',
    fontWeight: '600',
    marginBottom: '1.25rem',
    animation: 'fadeInUp 0.3s ease'
};

const toastWarningStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    borderRadius: '8px',
    background: 'rgba(251, 113, 133, 0.15)',
    border: '1px solid var(--error)',
    color: 'var(--error)',
    fontSize: '0.82rem',
    fontWeight: '600',
    marginBottom: '1.25rem',
    animation: 'fadeInUp 0.3s ease',
    position: 'relative'
};

const toastCloseStyle = {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    color: 'inherit',
    fontSize: '1.1rem',
    cursor: 'pointer',
    fontWeight: 'bold'
};

const studentRestrictionCardStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1.5rem',
    border: '2px dashed var(--border-color)',
    borderRadius: '12px',
    textAlign: 'center',
    background: 'rgba(255,255,255,0.01)'
};

const tableWrapperStyle = {
    overflowX: 'auto',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    background: 'var(--bg-primary)'
};

const guideCardStyle = {
    marginTop: '1.5rem',
    padding: '1.25rem',
    borderLeft: '4px solid var(--accent-primary)',
    background: 'rgba(129, 140, 248, 0.02)'
};
