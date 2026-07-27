"use client";
import React, { useState } from 'react';
import { mockBackend } from '../../services/mockBackend';
import { Send, Users, Hash, ArrowLeft } from 'lucide-react';
import './FeatureStyles.css';

const ChatForum = () => {
    const { chatRooms, chatMessages } = mockBackend;
    const [activeRoom, setActiveRoom] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState(chatMessages);

    const handleSend = () => {
        if (!newMessage.trim()) return;
        setMessages(prev => [...prev, {
            id: Date.now(), roomId: activeRoom.id, user: 'You',
            message: newMessage, time: 'Just now', isOwn: true
        }]);
        setNewMessage('');
    };

    const roomMessages = messages.filter(m => m.roomId === activeRoom?.id);

    return (
        <div className="chat-container animate-enter" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Dashboard Welcome Header */}
            <div className="welcome-banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                    <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.8rem', fontWeight: '700', background: 'linear-gradient(to right, var(--text-primary), var(--text-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>Discussion Forum</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '4px 0 0 0' }}>Join class channels, ask questions, and share notes with peers.</p>
                </div>
            </div>

            <div className="chat-layout" style={{ borderRadius: '16px', overflow: 'hidden', border: '2px solid var(--border-color)' }}>
                {/* Room List */}
                <div className={`room-list ${activeRoom ? 'hidden-mobile' : ''}`} style={{ borderRight: '2px solid var(--border-color)' }}>
                    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: '700', fontSize: '1.1rem', color: 'var(--text-primary)', padding: '1.25rem', borderBottom: '2px solid var(--border-color)', margin: 0 }}>
                        Channels
                    </h3>
                    {chatRooms.map(room => (
                        <div key={room.id} className={`room-item ${activeRoom?.id === room.id ? 'active' : ''}`}
                            onClick={() => setActiveRoom(room)}>
                            <Hash size={18} />
                            <div className="room-info">
                                <span className="room-name" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: '700' }}>{room.name}</span>
                                <span className="room-preview">{room.lastMessage}</span>
                            </div>
                            <div className="room-meta">
                                <span className="room-time" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{room.lastTime}</span>
                                <span className="member-count" style={{ fontFamily: "'JetBrains Mono', monospace" }}><Users size={12} /> {room.members}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Chat Area */}
                <div className={`chat-area ${!activeRoom ? 'empty' : ''}`}>
                    {activeRoom ? (
                        <>
                            <div className="chat-header" style={{ borderBottom: '2px solid var(--border-color)' }}>
                                <button className="back-btn-mobile" onClick={() => setActiveRoom(null)}>
                                    <ArrowLeft size={20} />
                                </button>
                                <Hash size={18} />
                                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: '700' }}>{activeRoom.name}</h3>
                                <span className="online-count" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{activeRoom.members} members</span>
                            </div>
                            <div className="messages-area">
                                {roomMessages.map(msg => (
                                    <div key={msg.id} className={`message ${msg.isOwn ? 'own' : ''}`}>
                                        {!msg.isOwn && <div className="msg-avatar">{msg.user.charAt(0)}</div>}
                                        <div className="msg-content">
                                            {!msg.isOwn && <span className="msg-user">{msg.user}</span>}
                                            <p>{msg.message}</p>
                                            <span className="msg-time">{msg.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="chat-input-bar" style={{ borderTop: '2px solid var(--border-color)', background: 'var(--bg-card)' }}>
                                <input
                                    type="text"
                                    placeholder={`Message #${activeRoom.name}...`}
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                                />
                                <button className="send-btn" onClick={handleSend}>
                                    <Send size={20} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="empty-chat">
                            <Hash size={64} color="var(--text-secondary)" />
                            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: '700', color: 'var(--text-secondary)' }}>Select a channel to start chatting</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatForum;
