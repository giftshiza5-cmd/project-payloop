"use client";

import { DashboardShell } from "./DashboardShell";

function Metric({ label, value, helper }) {
  return (
    <article className="panel p-4">
      <p className="stat-label">{label}</p>
      <strong className="mt-2 block text-2xl tracking-tight">{value}</strong>
      <span className="mt-2 block text-xs font-black text-emerald-600">{helper}</span>
    </article>
  );
}

export function RoleDashboard({ title, subtitle, metrics, primaryActions, activity, controls, accentLabel }) {
  return (
    <DashboardShell title={title} subtitle={subtitle} actions={primaryActions}>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Metric key={metric.label} {...metric} />
        ))}
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="panel p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="stat-label">{accentLabel}</p>
              <h2 className="text-lg font-black">Allowed Actions</h2>
            </div>
            <span className="status-pill bg-violet-50 text-violet-700">Role scoped</span>
          </div>
          <div className="grid gap-3">
            {controls.map((item) => (
              <div className="flex items-center justify-between rounded-[7px] border border-[var(--border)] bg-slate-50 p-3" key={item}>
                <span className="font-extrabold">{item}</span>
                <span className="status-pill bg-white text-slate-600">Enabled</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-black">Recent Activity</h2>
            <span className="text-sm font-black text-violet-600">Today</span>
          </div>
          <div className="grid gap-3">
            {activity.map((item) => (
              <div className="grid grid-cols-[2.25rem_1fr_auto] items-center gap-3 rounded-[7px] border border-[var(--border)] bg-white p-3" key={`${item.label}-${item.time}`}>
                <span className="icon-badge">{item.icon}</span>
                <span>
                  <strong className="block text-sm">{item.label}</strong>
                  <span className="text-xs font-medium text-slate-500">{item.detail}</span>
                </span>
                <span className="text-xs font-bold text-slate-500">{item.time}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </DashboardShell>
  );
}

