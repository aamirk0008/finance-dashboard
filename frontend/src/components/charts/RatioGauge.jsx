import { motion } from 'framer-motion';
import { HEALTH_SCORE_COLORS } from '../../constants';

export default function RatioGauge({ data }) {
  if (!data) return null;

  const { incomePercentage, expensePercentage, ratio, healthScore, totalIncome, totalExpenses } = data;

  const scoreColor = {
    Excellent: '#10b981',
    Good: '#22d3ee',
    Fair: '#f59e0b',
    Poor: '#f43f5e',
    'No Data': '#475569'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Health Score */}
      <div style={{ textAlign: 'center' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.3 }}
          style={{
            display: 'inline-flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            width: '100px', height: '100px', borderRadius: '50%',
            border: `3px solid ${scoreColor[healthScore]}`,
            boxShadow: `0 0 30px ${scoreColor[healthScore]}30`,
            margin: '0 auto'
          }}
        >
          <span style={{
            fontSize: '13px', fontWeight: '700',
            color: scoreColor[healthScore],
            fontFamily: "'Syne', sans-serif",
            textAlign: 'center', lineHeight: '1.2'
          }}>{healthScore}</span>
          {ratio && (
            <span style={{
              fontSize: '11px', color: '#475569',
              fontFamily: "'JetBrains Mono', monospace"
            }}>{ratio}x</span>
          )}
        </motion.div>
        <p style={{ color: '#475569', fontSize: '12px', marginTop: '8px' }}>Financial Health</p>
      </div>

      {/* Progress bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* Income bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', color: '#10b981' }}>Income</span>
            <span style={{ fontSize: '12px', color: '#10b981', fontFamily: "'JetBrains Mono', monospace" }}>
              {incomePercentage}%
            </span>
          </div>
          <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${incomePercentage}%` }}
              transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
              style={{ height: '100%', borderRadius: '3px', background: 'linear-gradient(90deg, #10b981, #34d399)' }}
            />
          </div>
          <p style={{ fontSize: '11px', color: '#475569', marginTop: '4px', fontFamily: "'JetBrains Mono', monospace" }}>
            ₹{totalIncome?.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Expense bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', color: '#f43f5e' }}>Expenses</span>
            <span style={{ fontSize: '12px', color: '#f43f5e', fontFamily: "'JetBrains Mono', monospace" }}>
              {expensePercentage}%
            </span>
          </div>
          <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${expensePercentage}%` }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
              style={{ height: '100%', borderRadius: '3px', background: 'linear-gradient(90deg, #f43f5e, #fb7185)' }}
            />
          </div>
          <p style={{ fontSize: '11px', color: '#475569', marginTop: '4px', fontFamily: "'JetBrains Mono', monospace" }}>
            ₹{totalExpenses?.toLocaleString('en-IN')}
          </p>
        </div>
      </div>
    </div>
  );
}