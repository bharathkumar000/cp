'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Image as ImageIcon, Sparkles, User, Copy, Check, Key, ShieldAlert } from 'lucide-react';

const renderMathToHtml = (latex) => {
    let html = latex;
    
    // Remove wrapping $ or $$
    html = html.replace(/^\$\$?|\$\$?$/g, '').trim();

    // Replace LaTeX fractions: \frac{a}{b} -> a/b
    let prevHtml;
    do {
        prevHtml = html;
        html = html.replace(/\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, '($1)/($2)');
    } while (html !== prevHtml);

    // Replace subscripts and superscripts
    html = html.replace(/_\{?([a-zA-Z0-9+-=]+)\}?/g, '<sub>$1</sub>');
    html = html.replace(/\^\{?([a-zA-Z0-9+-=]+)\}?/g, '<sup>$1</sup>');

    // Replace common LaTeX math symbols
    const mathSymbols = {
        '\\\\mathcal\\{E\\}': '<span style="font-family: \'Times New Roman\', serif; font-style: italic; font-weight: bold; font-size: 1.1em;">ℰ</span>',
        '\\\\mathcal\\{([A-Z])\\}': '<span style="font-family: \'Times New Roman\', serif; font-style: italic; font-weight: bold; font-size: 1.1em;">$1</span>',
        '\\\\Phi': 'Φ',
        '\\\\phi': 'φ',
        '\\\\pi': 'π',
        '\\\\theta': 'θ',
        '\\\\Delta': 'Δ',
        '\\\\times': '×',
        '\\\\cdot': '·',
        '\\\\pm': '±',
        '\\\\infty': '∞',
        '\\\\partial': '∂',
        '\\\\int': '∫',
        '\\\\sum': '∑',
        '\\\\alpha': 'α',
        '\\\\beta': 'β',
        '\\\\gamma': 'γ',
        '\\\\omega': 'ω',
        '\\\\lambda': 'λ',
        '\\\\mu': 'μ',
        '\\\\sigma': 'σ',
        '\\\\tau': 'τ',
        '\\\\epsilon': 'ε',
        '\\\\eta': 'η',
        '\\\\rho': 'ρ',
        '\\\\chi': 'χ',
        '\\\\psi': 'ψ',
        '\\\\nabla': '∇',
        '\\\\sqrt\\{([^}]+)\\}': '√$1',
        '\\\\approx': '≈',
        '\\\\ne': '≠',
        '\\\\le': '≤',
        '\\\\ge': '≥',
        '\\\\to': '→',
        '\\\\rightarrow': '→',
        '\\\\leftarrow': '←',
        '\\\\gets': '←',
        '\\\\forall': '∀',
        '\\\\exists': '∃',
        '\\\\in': '∈',
        '\\\\notin': '∉',
        '\\\\subset': '⊂',
        '\\\\supset': '⊃',
        '\\\\cap': '∩',
        '\\\\cup': '∪',
    };

    for (const [pattern, replacement] of Object.entries(mathSymbols)) {
        const regex = new RegExp(pattern, 'g');
        html = html.replace(regex, replacement);
    }

    return (
        <span 
            className="math-render-inline" 
            style={{ 
                fontFamily: "'Cambria Math', 'Times New Roman', serif", 
                fontStyle: 'italic',
                padding: '0 2px',
                color: '#818cf8',
                fontSize: '1.05em'
            }}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
};

const renderMarkdown = (text) => {
    if (!text) return null;
    
    const parts = text.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
            const lines = part.slice(3, -3).trim().split('\n');
            const firstLine = lines[0];
            const hasLang = /^[a-zA-Z0-9_-]+$/.test(firstLine);
            const code = hasLang ? lines.slice(1).join('\n') : lines.join('\n');
            const lang = hasLang ? firstLine : '';
            
            return (
                <div key={index} className="markdown-code-block-container" style={{
                    margin: '6px 0',
                    background: '#1b1c24',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    fontFamily: 'monospace'
                }}>
                    {lang && (
                        <div style={{
                            background: '#111217',
                            padding: '3px 8px',
                            fontSize: '0.7rem',
                            color: 'rgba(255, 255, 255, 0.4)',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                            textTransform: 'uppercase',
                            fontWeight: 'bold'
                        }}>
                            {lang}
                        </div>
                    )}
                    <pre style={{
                        margin: 0,
                        padding: '8px',
                        overflowX: 'auto',
                        fontSize: '0.75rem',
                        color: '#f8f8f2',
                        lineHeight: '1.35'
                    }}><code>{code}</code></pre>
                </div>
            );
        } else {
            const lines = part.split('\n');
            return lines.map((line, lineIdx) => {
                let currentLine = line;
                
                if (!currentLine.trim()) {
                    return <div key={`${index}-${lineIdx}`} style={{ height: '6px' }} />;
                }
                
                let isListItem = false;
                let listBullet = '';
                if (currentLine.trim().startsWith('- ') || currentLine.trim().startsWith('* ')) {
                    isListItem = true;
                    listBullet = '• ';
                    currentLine = currentLine.trim().slice(2);
                } else if (/^\d+\.\s/.test(currentLine.trim())) {
                    isListItem = true;
                    const match = currentLine.trim().match(/^(\d+\.)\s/);
                    listBullet = match[1] + ' ';
                    currentLine = currentLine.trim().slice(match[0].length);
                }
                
                const inlineParts = [];
                const mathRegex = /(\$\$.*?\{}|\$\$.*?\Slide|\$\$.*?\$\$|\$.*?\$)/g;
                const mathMatches = currentLine.split(mathRegex);
                
                mathMatches.forEach((mathItem, mathIdx) => {
                    if (mathItem.startsWith('$') && mathItem.endsWith('$')) {
                        inlineParts.push(<React.Fragment key={mathIdx}>{renderMathToHtml(mathItem)}</React.Fragment>);
                    } else {
                        const regex = /(\*\*.*?\*\*|`.*?`|https?:\/\/[^\s]+)/g;
                        const matches = mathItem.split(regex);
                        
                        matches.forEach((item, itemIdx) => {
                            if (item.startsWith('**') && item.endsWith('**')) {
                                inlineParts.push(<strong key={`${mathIdx}-${itemIdx}`} style={{ color: '#fff', fontWeight: '700' }}>{item.slice(2, -2)}</strong>);
                            } else if (item.startsWith('`') && item.endsWith('`')) {
                                inlineParts.push(
                                    <code key={`${mathIdx}-${itemIdx}`} style={{
                                        background: 'rgba(255,255,255,0.08)',
                                        padding: '1px 4px',
                                        borderRadius: '3px',
                                        fontFamily: 'monospace',
                                        fontSize: '0.75rem',
                                        color: '#f43f5e'
                                    }}>
                                        {item.slice(1, -1)}
                                    </code>
                                );
                            } else if (item.startsWith('http://') || item.startsWith('https://')) {
                                inlineParts.push(
                                    <a key={`${mathIdx}-${itemIdx}`} href={item} target="_blank" rel="noopener noreferrer" style={{
                                        color: '#818cf8',
                                        textDecoration: 'underline'
                                    }}>
                                        {item}
                                    </a>
                                );
                            } else {
                                inlineParts.push(item);
                            }
                        });
                    }
                });
                
                return (
                    <p key={`${index}-${lineIdx}`} style={{ 
                        margin: '0 0 4px 0', 
                        lineHeight: '1.4',
                        paddingLeft: isListItem ? '10px' : '0',
                        textIndent: isListItem ? '-10px' : '0'
                    }}>
                        {isListItem && <span style={{ color: '#818cf8', fontWeight: 'bold' }}>{listBullet}</span>}
                        {inlineParts}
                    </p>
                );
            });
        }
    });
};

const AIChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            sender: 'ai',
            text: 'Hi! I am Prepcare. Ask me any study question or upload an image of a problem to solve!',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [copiedId, setCopiedId] = useState(null);

    const [isApiModalOpen, setIsApiModalOpen] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [apiSavedMessage, setApiSavedMessage] = useState('');

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const savedKey = localStorage.getItem('user_gemini_api_key');
        if (savedKey) setApiKey(savedKey);
    }, []);

    const handleImageSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file.');
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                setSelectedImage(event.target?.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file.');
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                setSelectedImage(event.target?.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeSelectedImage = () => {
        setSelectedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSendMessage = async (textToSend = inputText) => {
        if (!textToSend.trim() && !selectedImage) return;

        const currentImage = selectedImage;
        const userMsgText = textToSend;

        const userMessage = {
            id: `msg-${Date.now()}`,
            sender: 'user',
            text: userMsgText,
            image: currentImage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setSelectedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setIsTyping(true);

        try {
            const chatHistory = messages.slice(-6).map(m => ({
                sender: m.sender,
                text: m.text,
                image: m.image
            }));

            const response = await fetch('/api/ai-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsgText,
                    image: currentImage,
                    history: chatHistory,
                    apiKey: localStorage.getItem('user_gemini_api_key') || ''
                })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();

            const aiMessage = {
                id: `msg-${Date.now() + 1}`,
                sender: 'ai',
                text: data.text || 'Sorry, I encountered an issue.',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error('Widget chat error:', error);
            const errorMessage = {
                id: `msg-${Date.now() + 1}`,
                sender: 'ai',
                text: '❌ Connection error. Please make sure Ollama is active with qwen3.5:9b-mlx.',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping, isOpen]);

    return (
        <div className="ai-widget-wrapper">
            {/* Widget Toggle FAB */}
            <button 
                className={`widget-fab-btn ${isOpen ? 'active' : ''}`} 
                onClick={() => setIsOpen(!isOpen)}
                title="Ask Prepcare"
            >
                {isOpen ? <X size={24} /> : <Sparkles size={24} style={{ color: '#818cf8' }} />}
                {!isOpen && <span className="tooltip-label">Ask Prepcare</span>}
            </button>

            {/* Chat Box Popup */}
            {isOpen && (
                <div className="widget-popup">
                    {/* Header */}
                    <div className="widget-header">
                        <div className="header-details">
                            <div className="status-indicator"></div>
                            <div>
                                <h4 className="widget-title">Prepcare</h4>
                                <span className="widget-subtitle">AI Study Assistant</span>
                            </div>
                        </div>
                        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button 
                                className="widget-close" 
                                onClick={() => setIsApiModalOpen(true)} 
                                title="Configure AI API Key"
                            >
                                <Key size={15} />
                            </button>
                            <button className="widget-close" onClick={() => setIsOpen(false)} title="Close Widget">
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* API Key Modal with Warning */}
                    {isApiModalOpen && (
                        <div className="api-modal-overlay" onClick={() => setIsApiModalOpen(false)}>
                            <div className="api-modal-content" onClick={(e) => e.stopPropagation()}>
                                <div className="api-modal-header">
                                    <div className="api-modal-title">
                                        <Key size={18} style={{ color: '#818cf8' }} />
                                        <span>Configure AI Bot API Key</span>
                                    </div>
                                    <button className="api-modal-close" onClick={() => setIsApiModalOpen(false)}>
                                        <X size={16} />
                                    </button>
                                </div>

                                {/* PROMINENT WARNING TEXT */}
                                <div className="api-warning-banner">
                                    <ShieldAlert size={20} className="warning-banner-icon" />
                                    <div className="warning-banner-text">
                                        <strong>⚠️ Security Warning:</strong>
                                        Never share or expose your API key in public repositories or client code. Make sure to set quota limits and restriction policies in your AI provider console.
                                    </div>
                                </div>

                                <div className="api-modal-body">
                                    <label className="api-input-label">AI Bot API Key (Gemini / Custom)</label>
                                    <input
                                        type="password"
                                        className="api-key-input"
                                        placeholder="Enter your AI Bot API Key (e.g. AIzaSy...)"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                    />
                                    <div className="api-input-subtext">
                                        Your API Key is stored securely in your browser local storage for AI responses.
                                    </div>
                                </div>

                                <div className="api-modal-footer">
                                    {apiSavedMessage && <span className="api-saved-msg">{apiSavedMessage}</span>}
                                    <button 
                                        type="button"
                                        className="api-save-btn" 
                                        onClick={() => {
                                            localStorage.setItem('user_gemini_api_key', apiKey.trim());
                                            setApiSavedMessage('API Key saved successfully!');
                                            setTimeout(() => {
                                                setApiSavedMessage('');
                                                setIsApiModalOpen(false);
                                            }, 1200);
                                        }}
                                    >
                                        Save API Key
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Chat Area */}
                    <div className="widget-chat-area">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`widget-bubble-row ${msg.sender === 'user' ? 'user-align' : 'ai-align'}`}>
                                <div className="bubble-box">
                                    {msg.image && (
                                        <div className="bubble-attachment">
                                            <img src={msg.image} alt="Attachment" />
                                        </div>
                                    )}
                                    <div className="bubble-text">
                                        {renderMarkdown(msg.text)}
                                    </div>
                                    <div className="bubble-info">
                                        <span className="bubble-time">{msg.timestamp}</span>
                                        <button className="copy-action" onClick={() => copyToClipboard(msg.text, msg.id)}>
                                            {copiedId === msg.id ? <Check size={10} color="#4ade80" /> : <Copy size={10} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="widget-bubble-row ai-align">
                                <div className="bubble-box typing-box">
                                    <div className="typing-dots">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Composer Footer */}
                    <div className="widget-composer">
                        {selectedImage && (
                            <div className="attachment-preview">
                                <img src={selectedImage} alt="Attachment Preview" />
                                <button className="clear-attach" onClick={removeSelectedImage}><X size={10} /></button>
                            </div>
                        )}                         <div 
                            className="composer-input-row"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleFileDrop}
                         >
                            <input 
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageSelect}
                                style={{ display: 'none' }}
                            />
                            <button className="image-attach-btn" onClick={() => fileInputRef.current?.click()}>
                                <ImageIcon size={16} />
                            </button>
                            
                            <input
                                type="text"
                                placeholder="Ask study query..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={handleKeyPress}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleFileDrop}
                                className="widget-input"
                            />

                            <button 
                                className="widget-send-btn"
                                onClick={() => handleSendMessage()}
                                disabled={!inputText.trim() && !selectedImage}
                            >
                                <Send size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .ai-widget-wrapper {
                    position: fixed;
                    bottom: 25px;
                    right: 25px;
                    z-index: 1000;
                    font-family: inherit;
                }

                /* FAB button */
                .widget-fab-btn {
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #6366f1, #4f46e5);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                }

                .widget-fab-btn:hover {
                    transform: scale(1.08) translateY(-2px);
                    box-shadow: 0 12px 30px rgba(99, 102, 241, 0.5);
                    background: linear-gradient(135deg, #4f46e5, #3b82f6);
                }

                .widget-fab-btn.active {
                    background: #1f2029;
                    border-color: rgba(255, 255, 255, 0.1);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                }

                .tooltip-label {
                    position: absolute;
                    left: -110px;
                    top: 15px;
                    background: #000;
                    color: #fff;
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 0.72rem;
                    font-weight: 600;
                    white-space: nowrap;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.2s ease;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .widget-fab-btn:hover .tooltip-label {
                    opacity: 1;
                }

                /* Popup box */
                .widget-popup {
                    position: absolute;
                    bottom: 72px;
                    right: 0;
                    width: 350px;
                    height: 480px;
                    background: #0f1015;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 14px;
                    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.5);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    animation: slideUp 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                }

                @keyframes slideUp {
                    from { transform: translateY(15px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                /* Header */
                .widget-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 14px;
                    background: rgba(20, 21, 28, 0.95);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                }

                .header-details {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .status-indicator {
                    width: 8px;
                    height: 8px;
                    background: #10b981;
                    border-radius: 50%;
                }

                .widget-title {
                    font-size: 0.88rem;
                    font-weight: 700;
                    color: #fff;
                    margin: 0;
                }

                .widget-subtitle {
                    font-size: 0.68rem;
                    color: rgba(255, 255, 255, 0.4);
                }

                .widget-close {
                    background: transparent;
                    border: none;
                    color: rgba(255, 255, 255, 0.5);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    padding: 4px;
                    border-radius: 4px;
                }

                .widget-close:hover {
                    color: #fff;
                    background: rgba(255, 255, 255, 0.05);
                }

                /* Chat Area */
                .widget-chat-area {
                    flex: 1;
                    padding: 12px;
                    overflow-y: auto;
                    background: #0b0c10;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .widget-bubble-row {
                    display: flex;
                    max-width: 85%;
                }

                .user-align {
                    align-self: flex-end;
                }

                .ai-align {
                    align-self: flex-start;
                }

                .bubble-box {
                    padding: 8px 12px;
                    border-radius: 10px;
                    font-size: 0.85rem;
                    color: #e5e7eb;
                }

                .user-align .bubble-box {
                    background: linear-gradient(135deg, #4f46e5, #3b82f6);
                    color: #fff;
                    border-bottom-right-radius: 2px;
                }

                .ai-align .bubble-box {
                    background: #15171e;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-bottom-left-radius: 2px;
                }

                .bubble-attachment {
                    margin-bottom: 6px;
                    border-radius: 4px;
                    overflow: hidden;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    max-width: 200px;
                }

                .bubble-attachment img {
                    width: 100%;
                    height: auto;
                    display: block;
                }

                .bubble-info {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-top: 4px;
                    font-size: 0.65rem;
                    opacity: 0.6;
                }

                .copy-action {
                    background: transparent;
                    border: none;
                    color: inherit;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    padding: 1px;
                }

                /* Typing wave */
                .typing-box {
                    padding: 6px 10px;
                }

                .typing-dots {
                    display: flex;
                    gap: 3px;
                }

                .typing-dots span {
                    width: 4px;
                    height: 4px;
                    background: rgba(255, 255, 255, 0.5);
                    border-radius: 50%;
                    animation: bounceDots 1.2s infinite ease-in-out;
                }

                .typing-dots span:nth-child(2) {
                    animation-delay: 0.2s;
                }

                .typing-dots span:nth-child(3) {
                    animation-delay: 0.4s;
                }

                @keyframes bounceDots {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-4px); }
                }

                /* Composer Footer */
                .widget-composer {
                    padding: 10px;
                    background: #14151c;
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                }

                .attachment-preview {
                    position: relative;
                    width: 40px;
                    height: 40px;
                    border-radius: 4px;
                    overflow: hidden;
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    margin-bottom: 8px;
                }

                .attachment-preview img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .clear-attach {
                    position: absolute;
                    top: 1px;
                    right: 1px;
                    background: rgba(0, 0, 0, 0.7);
                    border: none;
                    border-radius: 50%;
                    color: #fff;
                    width: 12px;
                    height: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }

                .composer-input-row {
                    display: flex;
                    align-items: center;
                    background: #0b0c10;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 8px;
                    padding: 3px;
                }

                .composer-input-row:focus-within {
                    border-color: #6366f1;
                }

                .image-attach-btn {
                    background: transparent;
                    border: none;
                    color: rgba(255, 255, 255, 0.4);
                    width: 28px;
                    height: 28px;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }

                .image-attach-btn:hover {
                    color: #6366f1;
                    background: rgba(255, 255, 255, 0.03);
                }

                .widget-input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: #fff;
                    padding: 6px;
                    font-size: 0.82rem;
                    outline: none;
                }

                .widget-input::placeholder {
                    color: rgba(255, 255, 255, 0.25);
                }

                .widget-send-btn {
                    background: #6366f1;
                    border: none;
                    color: #fff;
                    width: 28px;
                    height: 28px;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }

                .widget-send-btn:hover:not(:disabled) {
                    background: #4f46e5;
                }

                .widget-send-btn:disabled {
                    background: rgba(255, 255, 255, 0.02);
                    color: rgba(255, 255, 255, 0.15);
                    cursor: not-allowed;
                }

                /* API Modal & Security Warning Banner Styles */
                .api-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.75);
                    backdrop-filter: blur(8px);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                }

                .api-modal-content {
                    background: #0f1017;
                    border: 1px solid rgba(99, 102, 241, 0.3);
                    border-radius: 16px;
                    width: 100%;
                    max-width: 440px;
                    padding: 18px 20px;
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(99, 102, 241, 0.15);
                    animation: modalPopIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }

                @keyframes modalPopIn {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }

                .api-modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 14px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                    padding-bottom: 10px;
                }

                .api-modal-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.98rem;
                    font-weight: 700;
                    color: #ffffff;
                }

                .api-modal-close {
                    background: transparent;
                    border: none;
                    color: rgba(255, 255, 255, 0.5);
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 6px;
                    transition: color 0.2s;
                }

                .api-modal-close:hover {
                    color: #ffffff;
                    background: rgba(255, 255, 255, 0.1);
                }

                .api-warning-banner {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    background: rgba(245, 158, 11, 0.1);
                    border: 1px solid rgba(245, 158, 11, 0.3);
                    border-radius: 10px;
                    padding: 10px 12px;
                    margin-bottom: 16px;
                }

                .warning-banner-icon {
                    color: #f59e0b;
                    flex-shrink: 0;
                    margin-top: 2px;
                }

                .warning-banner-text {
                    font-size: 0.78rem;
                    color: #fde68a;
                    line-height: 1.45;
                }

                .warning-banner-text strong {
                    display: block;
                    color: #fbbf24;
                    margin-bottom: 2px;
                }

                .api-modal-body {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    margin-bottom: 16px;
                }

                .api-input-label {
                    font-size: 0.78rem;
                    font-weight: 600;
                    color: #cbd5e1;
                }

                .api-key-input {
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(99, 102, 241, 0.2);
                    border-radius: 8px;
                    padding: 8px 12px;
                    color: #ffffff;
                    font-size: 0.85rem;
                    outline: none;
                    transition: all 0.2s;
                }

                .api-key-input:focus {
                    border-color: #6366f1;
                    box-shadow: 0 0 10px rgba(99, 102, 241, 0.25);
                    background: rgba(0, 0, 0, 0.3);
                }

                .api-input-subtext {
                    font-size: 0.72rem;
                    color: rgba(255, 255, 255, 0.4);
                }

                .api-modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    gap: 10px;
                }

                .api-saved-msg {
                    font-size: 0.78rem;
                    color: #34d399;
                    font-weight: 600;
                }

                .api-save-btn {
                    background: linear-gradient(90deg, #6366f1, #4f46e5);
                    color: #ffffff;
                    border: none;
                    border-radius: 8px;
                    padding: 7px 16px;
                    font-size: 0.82rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .api-save-btn:hover {
                    background: linear-gradient(90deg, #4f46e5, #4338ca);
                    transform: translateY(-1px);
                }

                /* Mobile responsivity: adjust popup size */
                @media (max-width: 480px) {
                    .widget-popup {
                        width: calc(100vw - 40px);
                        right: 0;
                        height: 400px;
                    }
                }
            `}</style>
        </div>
    );
};

export default AIChatWidget;
