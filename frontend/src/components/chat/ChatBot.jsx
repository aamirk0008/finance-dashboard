import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader } from 'lucide-react';
import axios from '../../api/axios';

const suggestions = [
  "What is my total income?",
  "What is my financial health score?",
  "Which category am I spending most on?",
  "Show my recent transactions",
  "How can I save more money?",
  "What is my net balance?"
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Hi! I'm your FinanceOS assistant 👋 I can answer questions about your financial data or give you general finance advice. What would you like to know?",
      time: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async (text) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    setInput('');
    setMessages(prev => [...prev, {
      role: 'user',
      text: messageText,
      time: new Date()
    }]);
    setLoading(true);

    try {
      const res = await axios.post('/api/chat', { message: messageText });
      setMessages(prev => [...prev, {
        role: 'bot',
        text: res.data.data.response,
        time: new Date()
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'bot',
        text: 'Sorry, I could not process your request. Please try again.',
        time: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit'
    });
  };

  // Format bold text from markdown
  const formatText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} style={{ color: '#22d3ee', fontWeight: '600' }}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed', bottom: '28px', right: '28px',
          width: '52px', height: '52px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #22d3ee, #06b6d4)',
          border: 'none', cursor: 'pointer', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 30px rgba(34,211,238,0.4)',
          color: '#020617'
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen
            ? <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X size={22} />
              </motion.div>
            : <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                <MessageCircle size={22} />
              </motion.div>
          }
        </AnimatePresence>
      </motion.button>

      {/* Unread dot */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            position: 'fixed', bottom: '72px', right: '24px',
            width: '10px', height: '10px', borderRadius: '50%',
            background: '#10b981', zIndex: 101,
            boxShadow: '0 0 8px rgba(16,185,129,0.8)'
          }}
        />
      )}

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            style={{
              position: 'fixed', bottom: '92px', right: '28px',
              width: '360px', height: '520px',
              background: 'rgba(13,20,36,0.97)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px', zIndex: 99,
              display: 'flex', flexDirection: 'column',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
              fontFamily: "'DM Sans', sans-serif",
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(34,211,238,0.05)',
              display: 'flex', alignItems: 'center', gap: '12px'
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(34,211,238,0.15)',
                border: '1px solid rgba(34,211,238,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Bot size={18} color="#22d3ee" />
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#f1f5f9', margin: 0 }}>
                  FinanceOS AI
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: '#10b981',
                    boxShadow: '0 0 6px rgba(16,185,129,0.8)'
                  }} />
                  <p style={{ fontSize: '11px', color: '#475569', margin: 0 }}>Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  marginLeft: 'auto', background: 'rgba(255,255,255,0.06)',
                  border: 'none', borderRadius: '8px', padding: '6px',
                  cursor: 'pointer', color: '#64748b',
                  display: 'flex', alignItems: 'center'
                }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1, overflowY: 'auto', padding: '16px',
              display: 'flex', flexDirection: 'column', gap: '12px'
            }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'flex',
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-start', gap: '8px'
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    flexShrink: 0,
                    background: msg.role === 'bot'
                      ? 'rgba(34,211,238,0.15)'
                      : 'rgba(16,185,129,0.15)',
                    border: msg.role === 'bot'
                      ? '1px solid rgba(34,211,238,0.25)'
                      : '1px solid rgba(16,185,129,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {msg.role === 'bot'
                      ? <Bot size={14} color="#22d3ee" />
                      : <User size={14} color="#10b981" />
                    }
                  </div>

                  {/* Bubble */}
                  <div style={{ maxWidth: '75%' }}>
                    <div style={{
                      padding: '10px 14px', borderRadius: '14px',
                      borderTopLeftRadius: msg.role === 'bot' ? '4px' : '14px',
                      borderTopRightRadius: msg.role === 'user' ? '4px' : '14px',
                      background: msg.role === 'bot'
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(34,211,238,0.12)',
                      border: msg.role === 'bot'
                        ? '1px solid rgba(255,255,255,0.06)'
                        : '1px solid rgba(34,211,238,0.20)',
                      fontSize: '13px', lineHeight: '1.5',
                      color: '#e2e8f0'
                    }}>
                      {formatText(msg.text)}
                    </div>
                    <p style={{
                      fontSize: '10px', color: '#334155',
                      margin: '4px 4px 0',
                      textAlign: msg.role === 'user' ? 'right' : 'left'
                    }}>
                      {formatTime(msg.time)}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Loading bubble */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}
                >
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'rgba(34,211,238,0.15)',
                    border: '1px solid rgba(34,211,238,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Bot size={14} color="#22d3ee" />
                  </div>
                  <div style={{
                    padding: '12px 16px', borderRadius: '14px',
                    borderTopLeftRadius: '4px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', gap: '6px'
                  }}>
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                        style={{
                          width: '6px', height: '6px', borderRadius: '50%',
                          background: '#22d3ee'
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 1 && (
              <div style={{
                padding: '0 16px 10px',
                display: 'flex', flexWrap: 'wrap', gap: '6px'
              }}>
                {suggestions.map((s, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => sendMessage(s)}
                    style={{
                      padding: '5px 10px', borderRadius: '20px',
                      fontSize: '11px', cursor: 'pointer',
                      background: 'rgba(34,211,238,0.06)',
                      border: '1px solid rgba(34,211,238,0.15)',
                      color: '#22d3ee', fontFamily: "'DM Sans', sans-serif"
                    }}
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{
              padding: '12px 16px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', gap: '8px', alignItems: 'flex-end'
            }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your finances..."
                rows={1}
                style={{
                  flex: 1, padding: '10px 14px',
                  borderRadius: '12px', fontSize: '13px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#f1f5f9', outline: 'none',
                  resize: 'none', lineHeight: '1.4',
                  fontFamily: "'DM Sans', sans-serif",
                  maxHeight: '80px', overflowY: 'auto'
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(34,211,238,0.4)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                style={{
                  width: '38px', height: '38px', borderRadius: '10px',
                  background: input.trim() && !loading
                    ? 'linear-gradient(135deg, #22d3ee, #06b6d4)'
                    : 'rgba(255,255,255,0.06)',
                  border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                  color: input.trim() && !loading ? '#020617' : '#334155',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'all 0.2s'
                }}
              >
                {loading ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={16} />}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}