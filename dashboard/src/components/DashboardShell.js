"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletButton } from "./WalletButton";

const navItems = [
  { section: "Dashboards", items: [
    { label: "Member", href: "/member", icon: "ME" },
    { label: "Treasurer", href: "/treasurer", icon: "TR" },
    { label: "Group Admin", href: "/group-admin", icon: "GA" },
    { label: "Super Admin", href: "/super-admin", icon: "SA" },
  ] },
  { section: "Management", items: [
    { label: "Dashboard", href: "/group-admin", icon: "D" },
    { label: "Groups", href: "/create-group", icon: "G" },
    { label: "Members", href: "/members", icon: "M" },
    { label: "Contributions", href: "/transparency", icon: "C" },
    { label: "Loans", href: "/loans", icon: "L" },
    { label: "Credit Scores", href: "/transparency", icon: "S" },
  ] },
  { section: "Analytics", items: [
    { label: "Analytics", href: "/transparency", icon: "A" },
    { label: "Transactions", href: "/transparency", icon: "T" },
    { label: "Reports", href: "/transparency", icon: "R" },
  ] },
  { section: "Communication", items: [
    { label: "Notifications", href: "/transparency", icon: "N", badge: "12" },
    { label: "Messages", href: "/transparency", icon: "B" },
  ] },
  { section: "Settings", items: [
    { label: "Settings", href: "/transparency", icon: "E" },
    { label: "Admins", href: "/members", icon: "U" },
    { label: "Integrations", href: "/transparency", icon: "I" },
  ] },
];

export function DashboardShell({ title, subtitle, actions, children, publicView = false }) {
  const pathname = usePathname();

  return (
    <div className="dashboard-shell relative overflow-hidden min-h-screen">
      {/* Background Floating Parallax Glow Orbs */}
      <div className="glow-orb glow-orb-primary w-[32rem] h-[32rem] top-[-10%] left-[-10%] animate-float-1" />
      <div className="glow-orb glow-orb-secondary w-[32rem] h-[32rem] bottom-[5%] right-[-10%] animate-float-2" />
      <div className="glow-orb glow-orb-amber w-[25rem] h-[25rem] top-[40%] left-[55%] animate-float-rotate" />

      <div className="relative z-10 grid min-h-screen lg:grid-cols-[248px_1fr] animate-fade-in-up">
        <aside className="hidden border-r border-[var(--border)] bg-white/60 p-4 shadow-[8px_0_28px_rgba(15,23,42,0.04)] backdrop-blur-md lg:block">
          <Link href="/" className="mb-7 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-[7px] bg-[var(--accent)] font-black text-white">P</span>
            <span>
              <span className="block text-lg font-black">PayLoop</span>
              <span className="text-xs font-bold text-slate-500">Decentralized chama platform</span>
            </span>
          </Link>

          <nav className="grid gap-5">
            {navItems.map((group) => (
              <div key={group.section}>
                <p className="mb-2 px-2 text-[0.68rem] font-black uppercase tracking-[0.08em] text-slate-400">{group.section}</p>
                <div className="grid gap-1">
                  {group.items.map((item) => {
                    const active = pathname === item.href || (pathname === "/group" && item.href === "/group-admin");
                    return (
                      <Link
                        key={`${group.section}-${item.label}`}
                        href={item.href}
                        className={`flex min-h-10 items-center gap-3 rounded-[7px] px-3 text-sm font-extrabold ${
                          active ? "bg-violet-50 text-violet-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                        }`}
                      >
                        <span className={`grid h-6 w-6 place-items-center rounded-[6px] text-[0.68rem] ${active ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-500"}`}>{item.icon}</span>
                        <span className="min-w-0 flex-1 truncate">{item.label}</span>
                        {item.badge && <span className="rounded-full bg-violet-600 px-2 py-0.5 text-[0.64rem] text-white">{item.badge}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {!publicView && (
            <div className="panel glass-panel card-3d mt-7 p-4">
              <p className="stat-label mb-3">Connected Wallet</p>
              <WalletButton />
              <div className="mt-4 border-t border-[var(--border)] pt-3">
                <span className="text-xs font-bold text-slate-500">Balance</span>
                <strong className="mt-1 block">120.45 MATIC</strong>
                <span className="text-xs text-slate-500">= KES 12,450</span>
              </div>
            </div>
          )}

          <p className="mt-5 text-xs font-bold text-slate-400">(c) 2026 PayLoop</p>
        </aside>

        <main className="min-w-0 px-4 py-5 sm:px-6 lg:px-8">
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <label className="flex min-h-11 w-full max-w-xl items-center gap-3 rounded-[7px] border border-[var(--border)] bg-white px-4 text-sm text-slate-500 shadow-sm">
              <span className="font-black">Q</span>
              <input className="w-full border-0 bg-transparent text-slate-900 outline-none placeholder:text-slate-400" placeholder="Search members, groups, transactions..." />
              <span className="rounded-[5px] border border-[var(--border)] bg-slate-50 px-1.5 py-0.5 text-[0.64rem] font-black text-slate-500">Ctrl K</span>
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <span className="status-pill border border-[var(--border)] bg-white text-slate-700">Polygon Amoy <span className="ml-2 h-2 w-2 rounded-full bg-emerald-500" /></span>
              <button className="button-secondary h-10 w-10 p-0" aria-label="Theme">LM</button>
              <button className="button-secondary h-10 w-10 p-0" aria-label="Notifications">12</button>
              {!publicView && <WalletButton compact />}
            </div>
          </div>

          <header className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h1 className="text-2xl font-black tracking-normal sm:text-3xl">{title}</h1>
              {subtitle && <p className="mt-2 max-w-3xl text-sm font-medium text-slate-500 sm:text-base">{subtitle}</p>}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {actions}
            </div>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
