import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(13,20,36,0.95)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px', padding: '12px 16px',
        fontFamily: "'DM Sans', sans-serif"
      }}>
        <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '8px' }}>{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color, fontSize: '13px', margin: '4px 0', fontFamily: "'JetBrains Mono', monospace" }}>
            {p.name}: ₹{p.value.toLocaleString('en-IN')}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function IncomeExpenseChart({ data }) {
  if (!data || !data.trends) return null;

  const chartData = data.trends
    .filter(t => t.income > 0 || t.expenses > 0)
    .map(t => ({
      month: t.month.slice(0, 3),
      Income: t.income,
      Expenses: t.expenses,
      Net: t.net
    }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} barGap={4} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: '#475569', fontSize: 12, fontFamily: 'DM Sans' }}
          axisLine={false} tickLine={false}
        />
        <YAxis
          tick={{ fill: '#475569', fontSize: 11, fontFamily: 'JetBrains Mono' }}
          axisLine={false} tickLine={false}
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Legend
          wrapperStyle={{ fontSize: '12px', color: '#64748b', fontFamily: 'DM Sans', paddingTop: '16px' }}
        />
        <Bar dataKey="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
        <Bar dataKey="Expenses" fill="#f43f5e" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}