import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#22d3ee', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#06b6d4', '#84cc16', '#fb923c', '#e879f9', '#38bdf8', '#34d399', '#a78bfa'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(13,20,36,0.95)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px', padding: '12px 16px',
        fontFamily: "'DM Sans', sans-serif"
      }}>
        <p style={{ color: '#f1f5f9', fontSize: '13px', marginBottom: '4px', textTransform: 'capitalize' }}>
          {payload[0].name}
        </p>
        <p style={{ color: payload[0].color, fontSize: '13px', fontFamily: "'JetBrains Mono', monospace" }}>
          ₹{payload[0].value.toLocaleString('en-IN')}
        </p>
      </div>
    );
  }
  return null;
};

export default function CategoryPieChart({ data }) {
  if (!data || data.length === 0) return null;

  const chartData = data.map(d => ({
    name: d.category,
    value: d.categoryTotal
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="45%"
          innerRadius={65}
          outerRadius={95}
          paddingAngle={3}
          dataKey="value"
        >
          {chartData.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '11px', color: '#64748b', fontFamily: 'DM Sans' }}
          formatter={(value) => <span style={{ textTransform: 'capitalize', color: '#64748b' }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}