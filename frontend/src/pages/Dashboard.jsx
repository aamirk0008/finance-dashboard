import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Wallet,
  Activity, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  fetchSummary, fetchCategories,
  fetchTrends, fetchRatio
} from '../store/slices/dashboardSlice';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import IncomeExpenseChart from '../components/charts/IncomeExpenseChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import RatioGauge from '../components/charts/RatioGauge';
import Spinner from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';

const cardStyle = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '16px',
  padding: '24px'
};

export default function Dashboard() {
  const dispatch = useDispatch();
  const { summary, categories, trends, ratio, loading } = useSelector((s) => s.dashboard);

  useEffect(() => {
    dispatch(fetchSummary());
    dispatch(fetchCategories());
    dispatch(fetchTrends(new Date().getFullYear()));
    dispatch(fetchRatio());
  }, []);

  if (loading && !summary) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Income',
      value: formatCurrency(summary?.totalIncome || 0),
      icon: TrendingUp,
      color: '#10b981',
      glow: 'rgba(16,185,129,0.15)',
      bg: 'rgba(16,185,129,0.10)',
      border: 'rgba(16,185,129,0.20)',
      count: summary?.incomeCount || 0
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(summary?.totalExpenses || 0),
      icon: TrendingDown,
      color: '#f43f5e',
      glow: 'rgba(244,63,94,0.15)',
      bg: 'rgba(244,63,94,0.10)',
      border: 'rgba(244,63,94,0.20)',
      count: summary?.expenseCount || 0
    },
    {
      title: 'Net Balance',
      value: formatCurrency(summary?.netBalance || 0),
      icon: Wallet,
      color: '#22d3ee',
      glow: 'rgba(34,211,238,0.15)',
      bg: 'rgba(34,211,238,0.10)',
      border: 'rgba(34,211,238,0.20)',
      count: summary?.totalTransactions || 0
    },
    {
      title: 'Transactions',
      value: summary?.totalTransactions || 0,
      icon: Activity,
      color: '#f59e0b',
      glow: 'rgba(245,158,11,0.15)',
      bg: 'rgba(245,158,11,0.10)',
      border: 'rgba(245,158,11,0.20)',
      count: null
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '22px', fontWeight: '700', color: '#f1f5f9', margin: '0 0 4px 0' }}>
          Overview
        </h1>
        <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
          Financial summary for {new Date().getFullYear()}
        </p>
      </motion.div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '16px' }}>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            style={{
              ...cardStyle,
              boxShadow: `0 0 30px ${stat.glow}`,
              cursor: 'default'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: stat.bg, border: `1px solid ${stat.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <stat.icon size={20} color={stat.color} />
              </div>
              {stat.count !== null && (
                <span style={{
                  fontSize: '11px', color: '#475569',
                  background: 'rgba(255,255,255,0.05)',
                  padding: '3px 8px', borderRadius: '6px'
                }}>
                  {stat.count} entries
                </span>
              )}
            </div>
            <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 6px 0' }}>{stat.title}</p>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '22px', fontWeight: '600',
              color: stat.color, margin: 0
            }}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '16px' }}>

        {/* Monthly trends — takes 2 cols */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{ ...cardStyle, gridColumn: 'span 2' }}
        >
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '15px', fontWeight: '600', color: '#f1f5f9', margin: '0 0 4px 0' }}>
              Monthly Trends
            </h3>
            <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>Income vs expenses by month</p>
          </div>
          <IncomeExpenseChart data={trends} />
        </motion.div>

        {/* Ratio gauge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={cardStyle}
        >
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '15px', fontWeight: '600', color: '#f1f5f9', margin: '0 0 4px 0' }}>
              Health Score
            </h3>
            <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>Income to expense ratio</p>
          </div>
          <RatioGauge data={ratio} />
        </motion.div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '16px' }}>

        {/* Category breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          style={cardStyle}
        >
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '15px', fontWeight: '600', color: '#f1f5f9', margin: '0 0 4px 0' }}>
              Category Breakdown
            </h3>
            <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>Spending by category</p>
          </div>
          <CategoryPieChart data={categories} />
        </motion.div>

        {/* Recent transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={cardStyle}
        >
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '15px', fontWeight: '600', color: '#f1f5f9', margin: '0 0 4px 0' }}>
              Recent Transactions
            </h3>
            <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>Last 5 transactions</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {summary?.recentTransactions?.map((t, i) => (
              <motion.div
                key={t._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.06 }}
                style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    background: t.type === 'income' ? 'rgba(16,185,129,0.10)' : 'rgba(244,63,94,0.10)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {t.type === 'income'
                      ? <ArrowUpRight size={16} color="#10b981" />
                      : <ArrowDownRight size={16} color="#f43f5e" />
                    }
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', color: '#e2e8f0', margin: '0 0 2px 0', textTransform: 'capitalize' }}>
                      {t.category}
                    </p>
                    <p style={{ fontSize: '11px', color: '#475569', margin: 0 }}>
                      {formatDate(t.date)}
                    </p>
                  </div>
                </div>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '13px', fontWeight: '600',
                  color: t.type === 'income' ? '#10b981' : '#f43f5e'
                }}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </span>
              </motion.div>
            ))}

            {(!summary?.recentTransactions || summary.recentTransactions.length === 0) && (
              <p style={{ textAlign: 'center', color: '#475569', fontSize: '13px', padding: '20px 0' }}>
                No transactions yet
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}