"use client";

import { DashboardShell } from "./DashboardShell";

function Metric({ label, value, helper }) {
  // Determine color theme based on label keywords
  let tintColor = "rgba(109, 61, 242, 0.08)";
  let badgeColor = "#6d3df2";
  let icon = "📊";

  const lowerLabel = label.toLowerCase();
  if (lowerLabel.includes("savings") || lowerLabel.includes("vault") || lowerLabel.includes("contribution") || lowerLabel.includes("paid")) {
    tintColor = "rgba(22, 163, 74, 0.08)";
    badgeColor = "#16a34a";
    icon = "💰";
  } else if (lowerLabel.includes("loan") || lowerLabel.includes("debt") || lowerLabel.includes("pending")) {
    tintColor = "rgba(245, 158, 11, 0.08)";
    badgeColor = "#f59e0b";
    icon = "📉";
  } else if (lowerLabel.includes("member") || lowerLabel.includes("chama") || lowerLabel.includes("users")) {
    tintColor = "rgba(59, 130, 246, 0.08)";
    badgeColor = "#3b82f6";
    icon = "👥";
  } else if (lowerLabel.includes("score") || lowerLabel.includes("credit")) {
    tintColor = "rgba(124, 58, 237, 0.08)";
    badgeColor = "#7c3aed";
    icon = "⚡";
  }

  return (
    <article 
      className="panel glass-panel card-3d p-5 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group border-slate-200 dark:border-slate-800"
    >
      {/* Visual background tint effect */}
      <div 
        className="absolute -right-10 -top-10 h-32 w-32 rounded-full transition-transform duration-500 group-hover:scale-110" 
        style={{ backgroundColor: tintColor }}
      />
      
      <div className="flex items-center justify-between z-10">
        <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</span>
        <span 
          className="grid h-8 w-8 place-items-center rounded-lg text-sm font-black shadow-sm"
          style={{ backgroundColor: tintColor, color: badgeColor }}
        >
          {icon}
        </span>
      </div>

      <div className="mt-4 z-10">
        <strong className="block text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100">{value}</strong>
        <span 
          className="mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-black"
          style={{ backgroundColor: `${badgeColor}1a`, color: badgeColor }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: badgeColor }} />
          {helper}
        </span>
      </div>
    </article>
  );
}

export function RoleDashboard({ title, subtitle, metrics, primaryActions, activity, controls, accentLabel }) {
  return (
    <DashboardShell title={title} subtitle={subtitle} actions={primaryActions}>
      {/* KPI Cards Grid */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Metric key={metric.label} {...metric} />
        ))}
      </section>

      {/* Allowed Actions & Recent Activity Sections */}
      <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="panel glass-panel p-5 border-slate-200 dark:border-slate-800">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="stat-label text-slate-400 dark:text-slate-500">{accentLabel}</p>
              <h2 className="text-lg font-black text-slate-800 dark:text-slate-100">Allowed Actions</h2>
            </div>
            <span className="status-pill bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 rounded-[5px] border border-violet-100 dark:border-violet-900/30">Role scoped</span>
          </div>
          <div className="grid gap-3">
            {controls.map((item) => (
              <div className="flex items-center justify-between rounded-[7px] border border-[var(--border)] bg-slate-50 dark:bg-slate-900/50 p-3 shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all duration-150" key={item}>
                <span className="font-extrabold text-slate-700 dark:text-slate-300">{item}</span>
                <span className="status-pill bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-extrabold shadow-sm rounded border border-slate-100 dark:border-slate-700">Enabled</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel glass-panel p-5 border-slate-200 dark:border-slate-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-800 dark:text-slate-100">Recent Activity</h2>
            <span className="text-xs font-black uppercase text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 rounded px-2 py-0.5 border border-violet-100 dark:border-violet-900/30">Today</span>
          </div>
          <div className="grid gap-3 overflow-y-auto max-h-[300px] pr-1">
            {activity.map((item) => (
              <div className="grid grid-cols-[2.25rem_1fr_auto] items-center gap-3 rounded-[7px] border border-[var(--border)] bg-white dark:bg-slate-900/40 p-3 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors duration-150" key={`${item.label}-${item.time}`}>
                <span className="icon-badge bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 font-black rounded-md">{item.icon}</span>
                <span>
                  <strong className="block text-sm text-slate-800 dark:text-slate-200">{item.label}</strong>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{item.detail}</span>
                </span>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{item.time}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </DashboardShell>
  );
}
