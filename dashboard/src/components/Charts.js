"use client";

import { useEffect, useState } from "react";
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

const colors = ["#22c55e", "#f59e0b", "#3b82f6", "#ef4444", "#7c3aed"];
const gridColor = "#e2e8f0";
const axisColor = "#64748b";
const tooltipStyle = { background: "#ffffff", border: "1px solid #dfe7f2", borderRadius: 8, boxShadow: "0 12px 28px rgba(15, 23, 42, 0.1)" };

function ClientOnly({ children, placeholderHeight = 260 }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <div style={{ height: placeholderHeight, width: "100%", background: "rgba(241, 245, 249, 0.5)", borderRadius: 7 }} className="animate-pulse" />;
  }
  return children;
}

export function ContributionTrendChart({ data }) {
  return (
    <ClientOnly placeholderHeight={260}>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="vaultTrend" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.38} />
              <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
          <XAxis dataKey="month" stroke={axisColor} />
          <YAxis stroke={axisColor} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area type="monotone" dataKey="amount" stroke="#7c3aed" fill="url(#vaultTrend)" strokeWidth={3} />
        </AreaChart>
      </ResponsiveContainer>
    </ClientOnly>
  );
}

export function MemberContributionChart({ data }) {
  return (
    <ClientOnly placeholderHeight={260}>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke={axisColor} tick={{ fontSize: 11 }} />
          <YAxis stroke={axisColor} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ClientOnly>
  );
}

export function LoanStatusChart({ data }) {
  const grouped = data.reduce((acc, loan) => {
    acc[loan.status] = (acc[loan.status] || 0) + 1;
    return acc;
  }, {});
  const chartData = Object.entries(grouped).map(([name, value]) => ({ name, value }));

  return (
    <ClientOnly placeholderHeight={220}>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={54} outerRadius={82} paddingAngle={4}>
            {chartData.map((entry, index) => (
              <Cell key={entry.name} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
    </ClientOnly>
  );
}
