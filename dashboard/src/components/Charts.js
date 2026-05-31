"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const colors = ["#14b8a6", "#f59e0b", "#60a5fa", "#ef4444", "#a78bfa"];

export function ContributionTrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="vaultTrend" x1="0" x2="0" y1="0" y2="1">
            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.55} />
            <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#26364f" strokeDasharray="3 3" />
        <XAxis dataKey="month" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip contentStyle={{ background: "#0f1a2a", border: "1px solid #26364f" }} />
        <Area type="monotone" dataKey="amount" stroke="#14b8a6" fill="url(#vaultTrend)" strokeWidth={3} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function MemberContributionChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <CartesianGrid stroke="#26364f" strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
        <YAxis stroke="#94a3b8" />
        <Tooltip contentStyle={{ background: "#0f1a2a", border: "1px solid #26364f" }} />
        <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function LoanStatusChart({ data }) {
  const grouped = data.reduce((acc, loan) => {
    acc[loan.status] = (acc[loan.status] || 0) + 1;
    return acc;
  }, {});
  const chartData = Object.entries(grouped).map(([name, value]) => ({ name, value }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={54} outerRadius={82} paddingAngle={4}>
          {chartData.map((entry, index) => (
            <Cell key={entry.name} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ background: "#0f1a2a", border: "1px solid #26364f" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
