import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Send, Loader, ArrowUpRight,
  ArrowDownRight, Plus, Trash2, Edit2,
  BarChart2, RefreshCw, X
} from 'lucide-react';
import { sendCommandApi } from '../api/finaiApi';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
};

const suggestions = [
  { label: 'Add salary 80000', icon: Plus, color: '#10b981' },
  { label: 'Show food expenses', icon: ArrowDownRight, color: '#22d3ee' },
  { label: 'Delete last rent expense', icon: Trash2, color: '#f43f5e' },
  { label: 'Update last salary to 90000', icon: Edit2, color: '#f59e0b' },
  { label: 'Summary of this month', icon: BarChart2, color: '#8b5cf6' },
  { label: 'Show income transactions', icon: ArrowUpRight, color: '#10b981' },
];

// Transaction card shown in results
function TransactionCard({ t }) {
  const isIncome = t.type === 'income';
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 14px', borderRadius: '10px',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.06)',
      gap: '10px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
          background: isIncome ? 'rgba(16,185,129,0.10)' : 'rgba(244,63,94,0.10)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {isIncome
            ? <ArrowUpRight size={15} color="#10b981" />
            : <ArrowDownRight size={15} color="#f43f5e" />
          }
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{
            fontSize: '13px', color: '#e2e8f0', margin: '0 0 2px',
            textTransform: 'capitalize', fontWeight: '500',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
          }}>{t.category}</p>
          <p style={{ fontSize: '11px', color: '#475569', margin: 0 }}>
            {formatDate(t.date)}
          </p>
        </div>
      </div>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '13px', fontWeight: '600', flexShrink: 0,
        color: isIncome ? '#10b981' : '#f43f5e'
      }}>
        {isIncome ? '+' : '-'}{formatCurrency(t.amount)}
      </span>
    </div>
  );
}

// Summary display
function SummaryCard({ data }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '10px', marginTop: '10px'
    }}>
      {[
        { label: 'Income', value: data.totalIncome, color: '#10b981', count: data.incomeCount },
        { label: 'Expenses', value: data.totalExpenses, color: '#f43f5e', count: data.expenseCount },
        { label: 'Net Balance', value: data.netBalance, color: '#22d3ee', count: null },
      ].map((item) => (
        <div key={item.label} style={{
          padding: '12px', borderRadius: '10px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.06)',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '11px', color: '#475569', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {item.label}
          </p>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '13px', fontWeight: '700',
            color: item.color, margin: 0
          }}>
            {formatCurrency(item.value)}
          </p>
          {item.count !== null && (
            <p style={{ fontSize: '10px', color: '#334155', margin: '4px 0 0' }}>
              {item.count} transactions
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

// Action icon based on type
function ActionBadge({ action }) {
  const config = {
    create: { icon: Plus, color: '#10b981', bg: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.20)', label: 'Created' },
    read: { icon: ArrowUpRight, color: '#22d3ee', bg: 'rgba(34,211,238,0.10)', border: 'rgba(34,211,238,0.20)', label: 'Found' },
    update: { icon: Edit2, color: '#f59e0b', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.20)', label: 'Updated' },
    delete: { icon: Trash2, color: '#f43f5e', bg: 'rgba(244,63,94,0.10)', border: 'rgba(244,63,94,0.20)', label: 'Deleted' },
    summary: { icon: BarChart2, color: '#8b5cf6', bg: 'rgba(139,92,246,0.10)', border: 'rgba(139,92,246,0.20)', label: 'Summary' },
    error: { icon: X, color: '#f43f5e', bg: 'rgba(244,63,94,0.10)', border: 'rgba(244,63,94,0.20)', label: 'Error' },
    unknown: { icon: X, color: '#64748b', bg: 'rgba(100,116,139,0.10)', border: 'rgba(100,116,139,0.20)', label: 'Unknown' },
  };

  const c = config[action] || config.unknown;
  const Icon = c.icon;

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 8px', borderRadius: '6px',
      background: c.bg, border: `1px solid ${c.border}`,
      marginBottom: '8px'
    }}>
      <Icon size={11} color={c.color} />
      <span style={{ fontSize: '10px', fontWeight: '700', color: c.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {c.label}
      </span>
    </div>
  );
}

// Bot message renderer
function BotMessage({ msg, onRetry }) {
  const { result } = msg;

  if (!result) {
    return (
      <p style={{ fontSize: '13px', color: '#e2e8f0', margin: 0, lineHeight: '1.6' }}>
        {msg.text}
      </p>
    );
  }

  const { action, message, display, success, code } = result;

  return (
    <div>
      <ActionBadge action={success ? action : 'error'} />
      <p style={{ fontSize: '13px', color: success ? '#e2e8f0' : '#fca5a5', margin: '0 0 10px', lineHeight: '1.6' }}>
        {message}
      </p>

      {/* Created / Updated / Deleted single transaction */}
      {success && display && ['created', 'updated', 'deleted'].includes(display.type) && (
        <div style={{ opacity: display.type === 'deleted' ? 0.5 : 1 }}>
          <TransactionCard t={display.data} />
        </div>
      )}

      {/* List of transactions */}
      {success && display?.type === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {display.data.length === 0 ? (
            <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>No transactions found.</p>
          ) : (
            <>
              <p style={{ fontSize: '11px', color: '#475569', margin: '0 0 4px' }}>
                {display.data.length} result{display.data.length !== 1 ? 's' : ''}
              </p>
              {display.data.map(t => <TransactionCard key={t._id} t={t} />)}
            </>
          )}
        </div>
      )}

      {/* Summary */}
      {success && display?.type === 'summary' && (
        <SummaryCard data={display.data} />
      )}

      {/* Error retry */}
      {!success && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRetry}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', borderRadius: '8px', marginTop: '8px',
            fontSize: '12px', fontWeight: '600', cursor: 'pointer',
            background: code === 'RATE_LIMIT' ? 'transparent' : 'rgba(244,63,94,0.10)',
            border: '1px solid rgba(244,63,94,0.20)',
            color: '#f43f5e', fontFamily: "'DM Sans', sans-serif",
            display: code === 'RATE_LIMIT' ? 'none' : 'flex'
          }}
        >
          <RefreshCw size={12} /> Retry
        </motion.button>
      )}
    </div>
  );
}

export default function FinAI() {
  const isMobile = useIsMobile();
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Hi! I'm FinAI 🤖 I can create, read, update and delete your transactions using natural language. Try a command below or type your own.",
      time: new Date(),
      result: null
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendCommand = async (text, isRetry = false) => {
    const command = text || input.trim();
    if (!command || loading) return;

    setLastCommand(command);
    if (!isRetry) setInput('');

    if (!isRetry) {
      setMessages(prev => [...prev, {
        role: 'user', text: command, time: new Date(), result: null
      }]);
    } else {
      setMessages(prev => prev.slice(0, -1));
    }

    setLoading(true);

    try {
      const res = await sendCommandApi(command);
      const result = res.data.data;

      setMessages(prev => [...prev, {
        role: 'bot',
        text: result.message,
        time: new Date(),
        result
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'bot',
        text: 'Could not reach the server. Check your connection.',
        time: new Date(),
        result: { success: false, action: 'error', code: 'NETWORK', message: 'Could not reach the server. Check your connection.' }
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendCommand();
    }
  };

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: 'calc(100vh - 60px)',
      fontFamily: "'DM Sans', sans-serif",
      maxWidth: '900px', margin: '0 auto', width: '100%'
    }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: isMobile ? '16px 0 12px' : '20px 0 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(139,92,246,0.20), rgba(34,211,238,0.20))',
            border: '1px solid rgba(139,92,246,0.30)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Sparkles size={18} color="#a78bfa" />
          </div>
          <div>
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: isMobile ? '18px' : '22px',
              fontWeight: '700', color: '#f1f5f9', margin: 0
            }}>FinAI</h1>
            <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>
              AI-powered transaction assistant
            </p>
          </div>

          {/* Live indicator */}
          <div style={{
            marginLeft: 'auto', display: 'flex',
            alignItems: 'center', gap: '6px',
            padding: '5px 10px', borderRadius: '20px',
            background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.15)'
          }}>
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: '#10b981', boxShadow: '0 0 6px rgba(16,185,129,0.8)'
            }} />
            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '600' }}>Active</span>
          </div>
        </div>

        {/* Capability chips */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
            {[
              { label: 'Create', color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.15)' },
              { label: 'Read', color: '#22d3ee', bg: 'rgba(34,211,238,0.08)', border: 'rgba(34,211,238,0.15)' },
              { label: 'Update', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.15)' },
              { label: 'Delete', color: '#f43f5e', bg: 'rgba(244,63,94,0.08)', border: 'rgba(244,63,94,0.15)' },
              { label: 'Summary', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.15)' },
            ].map(c => (
              <span key={c.label} style={{
                fontSize: '11px', fontWeight: '600', padding: '3px 10px',
                borderRadius: '20px', background: c.bg, border: `1px solid ${c.border}`,
                color: c.color, textTransform: 'uppercase', letterSpacing: '0.05em'
              }}>{c.label}</span>
            ))}
          </div>
        )}
      </motion.div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: isMobile ? '16px 0' : '20px 0',
        display: 'flex', flexDirection: 'column', gap: '16px'
      }}>

        {/* Suggestions — show only at start */}
        {messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)',
              gap: '8px', marginBottom: '8px'
            }}
          >
            {suggestions.map((s, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => sendCommand(s.label)}
                style={{
                  padding: '12px 14px', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  cursor: 'pointer', textAlign: 'left',
                  fontFamily: "'DM Sans', sans-serif",
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  width: '28px', height: '28px', borderRadius: '8px',
                  background: `${s.color}15`,
                  border: `1px solid ${s.color}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '8px'
                }}>
                  <s.icon size={14} color={s.color} />
                </div>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: '1.4' }}>
                  {s.label}
                </p>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Message list */}
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-start', gap: '10px'
            }}
          >
            {/* Avatar */}
            <div style={{
              width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
              background: msg.role === 'user'
                ? 'rgba(16,185,129,0.15)'
                : 'linear-gradient(135deg, rgba(139,92,246,0.20), rgba(34,211,238,0.20))',
              border: msg.role === 'user'
                ? '1px solid rgba(16,185,129,0.25)'
                : '1px solid rgba(139,92,246,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {msg.role === 'user'
                ? <span style={{ fontSize: '12px', fontWeight: '700', color: '#10b981' }}>U</span>
                : <Sparkles size={14} color="#a78bfa" />
              }
            </div>

            {/* Bubble */}
            <div style={{ maxWidth: isMobile ? '85%' : '75%' }}>
              <div style={{
                padding: '12px 16px', borderRadius: '16px',
                borderTopLeftRadius: msg.role === 'user' ? '16px' : '4px',
                borderTopRightRadius: msg.role === 'user' ? '4px' : '16px',
                background: msg.role === 'user'
                  ? 'rgba(34,211,238,0.10)'
                  : 'rgba(255,255,255,0.04)',
                border: msg.role === 'user'
                  ? '1px solid rgba(34,211,238,0.18)'
                  : '1px solid rgba(255,255,255,0.07)',
              }}>
                {msg.role === 'user' ? (
                  <p style={{ fontSize: '13px', color: '#e2e8f0', margin: 0, lineHeight: '1.6' }}>
                    {msg.text}
                  </p>
                ) : (
                  <BotMessage
                    msg={msg}
                    onRetry={() => sendCommand(lastCommand, true)}
                  />
                )}
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

        {/* Loading */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}
          >
            <div style={{
              width: '30px', height: '30px', borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(139,92,246,0.20), rgba(34,211,238,0.20))',
              border: '1px solid rgba(139,92,246,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <Sparkles size={14} color="#a78bfa" />
            </div>
            <div style={{
              padding: '14px 18px', borderRadius: '16px', borderTopLeftRadius: '4px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              {[0, 1, 2].map(i => (
                <motion.div key={i}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                  style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: '#a78bfa'
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingTop: '16px', flexShrink: 0,
        paddingBottom: isMobile ? '8px' : '0'
      }}>
        {/* Quick action buttons */}
        <div style={{
          display: 'flex', gap: '6px', marginBottom: '10px',
          overflowX: 'auto', paddingBottom: '4px'
        }}>
          {[
            { label: '+ Add', command: 'Add ', color: '#10b981' },
            { label: '🔍 Show', command: 'Show ', color: '#22d3ee' },
            { label: '✏️ Update', command: 'Update last ', color: '#f59e0b' },
            { label: '🗑️ Delete', command: 'Delete last ', color: '#f43f5e' },
            { label: '📊 Summary', command: 'Summary of this month', color: '#8b5cf6' },
          ].map((btn) => (
            <motion.button
              key={btn.label}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setInput(btn.command)}
              style={{
                padding: '5px 12px', borderRadius: '20px',
                fontSize: '11px', fontWeight: '600',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: btn.color, cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                whiteSpace: 'nowrap', flexShrink: 0
              }}
            >
              {btn.label}
            </motion.button>
          ))}
        </div>

        {/* Text input */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Try: 'Add food expense of 500' or 'Show rent transactions'..."
            rows={1}
            style={{
              flex: 1, padding: '12px 16px', borderRadius: '14px',
              fontSize: '13px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#f1f5f9', outline: 'none', resize: 'none',
              lineHeight: '1.5', maxHeight: '100px', overflowY: 'auto',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'border-color 0.2s'
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
          />
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => sendCommand()}
            disabled={!input.trim() || loading}
            style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: input.trim() && !loading
                ? 'linear-gradient(135deg, #8b5cf6, #22d3ee)'
                : 'rgba(255,255,255,0.06)',
              border: 'none',
              cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              color: input.trim() && !loading ? '#fff' : '#334155',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'all 0.2s',
              boxShadow: input.trim() && !loading ? '0 0 20px rgba(139,92,246,0.3)' : 'none'
            }}
          >
            {loading
              ? <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
              : <Send size={18} />
            }
          </motion.button>
        </div>

        <p style={{
          fontSize: '11px', color: '#334155',
          margin: '8px 0 0', textAlign: 'center'
        }}>
          Press Enter to send · Shift+Enter for new line · Admin only
        </p>
      </div>
    </div>
  );
}