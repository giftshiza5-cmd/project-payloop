"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  const router = useRouter();

  // Theme state
  const [theme, setTheme] = useState("light");
  
  // Sidebar collapsible state
  const [collapsed, setCollapsed] = useState(false);

  // Dropdown states
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Custom notifications
  const [notifications, setNotifications] = useState([
    { id: 1, text: "On-chain contribution confirmed (0.05 ETH)", time: "5m ago", read: false },
    { id: 2, text: "Loan request #43 approved by Chama voting", time: "1h ago", read: false },
    { id: 3, text: "New member Mary Wanjiku joined the Chama", time: "2h ago", read: true },
    { id: 4, text: "Monthly savings pool distribution completed", time: "1d ago", read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = window.localStorage.getItem("theme") || "light";
      const savedCollapsed = window.localStorage.getItem("sidebarCollapsed") === "true";
      setTheme(savedTheme);
      setCollapsed(savedCollapsed);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === "light" ? "dark" : "light");

  const toggleSidebar = () => {
    setCollapsed(prev => {
      const next = !prev;
      window.localStorage.setItem("sidebarCollapsed", next);
      return next;
    });
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleLogout = () => {
    window.localStorage.removeItem("payloopRole");
    router.push("/login");
  };

  return (
    <div className="dashboard-shell relative overflow-hidden min-h-screen transition-colors duration-300 dark:bg-[#090e1a]">
      {/* Background Floating Parallax Glow Orbs */}
      <div className="glow-orb glow-orb-primary w-[32rem] h-[32rem] top-[-10%] left-[-10%] animate-float-1 dark:opacity-20" />
      <div className="glow-orb glow-orb-secondary w-[32rem] h-[32rem] bottom-[5%] right-[-10%] animate-float-2 dark:opacity-20" />
      <div className="glow-orb glow-orb-amber w-[25rem] h-[25rem] top-[40%] left-[55%] animate-float-rotate dark:opacity-10" />

      <div className={`relative z-10 grid min-h-screen transition-all duration-300 animate-fade-in-up ${
        collapsed ? "lg:grid-cols-[80px_1fr]" : "lg:grid-cols-[248px_1fr]"
      }`}>
        {/* Sidebar */}
        <aside className="hidden border-r border-[var(--border)] bg-white/60 dark:bg-[#0f172a]/60 p-4 shadow-[8px_0_28px_rgba(15,23,42,0.04)] dark:shadow-[8px_0_28px_rgba(0,0,0,0.2)] backdrop-blur-md lg:flex lg:flex-col justify-between transition-all duration-300">
          <div>
            <div className="mb-7 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-[7px] bg-[var(--accent)] font-black text-white shadow-md">P</span>
                {!collapsed && (
                  <span>
                    <span className="block text-lg font-black text-slate-800 dark:text-slate-100">PayLoop</span>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Decentralized chama</span>
                  </span>
                )}
              </Link>
              <button 
                onClick={toggleSidebar}
                className="hidden lg:grid h-7 w-7 place-items-center rounded-md border border-[var(--border)] bg-white dark:bg-[#1e293b] text-slate-600 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <span className="text-xs font-black">{collapsed ? "→" : "←"}</span>
              </button>
            </div>

            <nav className="grid gap-5 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
              {navItems.map((group) => (
                <div key={group.section} className="transition-all">
                  {!collapsed ? (
                    <p className="mb-2 px-2 text-[0.68rem] font-black uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500">{group.section}</p>
                  ) : (
                    <div className="h-px bg-[var(--border)] my-3 animate-pulse" />
                  )}
                  <div className="grid gap-1">
                    {group.items.map((item) => {
                      const active = pathname === item.href || (pathname === "/group" && item.href === "/group-admin");
                      return (
                        <Link
                          key={`${group.section}-${item.label}`}
                          href={item.href}
                          className={`flex min-h-10 items-center gap-3 rounded-[7px] px-3 text-sm font-extrabold transition-all duration-200 relative group ${
                            active 
                              ? "bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300" 
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-slate-100"
                          }`}
                        >
                          <span className={`grid h-6 w-6 place-items-center rounded-[6px] text-[0.68rem] transition-all ${
                            active ? "bg-violet-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
                          }`}>{item.icon}</span>
                          {!collapsed && <span className="min-w-0 flex-1 truncate">{item.label}</span>}
                          
                          {/* Collapsed Tooltip */}
                          {collapsed && (
                            <span className="absolute left-[70px] bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-250 z-50 whitespace-nowrap">
                              {item.label}
                            </span>
                          )}

                          {!collapsed && item.badge && (
                            <span className="rounded-full bg-violet-600 px-2 py-0.5 text-[0.64rem] text-white">{item.badge}</span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>

          <div>
            {!publicView && !collapsed && (
              <div className="panel glass-panel card-3d p-4 dark:border-slate-800">
                <p className="stat-label mb-3">Connected Wallet</p>
                <WalletButton />
                <div className="mt-4 border-t border-[var(--border)] pt-3 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-500">Balance</span>
                  <strong className="mt-1 block text-slate-800 dark:text-slate-200">120.45 MATIC</strong>
                  <span className="text-xs text-slate-500">= KES 12,450</span>
                </div>
              </div>
            )}
            <p className="mt-5 text-[10px] font-bold text-slate-400 dark:text-slate-500 text-center">
              {collapsed ? "©" : "© 2026 PayLoop"}
            </p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="min-w-0 px-4 py-5 sm:px-6 lg:px-8 dark:text-slate-100">
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Search bar */}
            <label className="flex min-h-11 w-full max-w-xl items-center gap-3 rounded-[7px] border border-[var(--border)] bg-white dark:bg-[#0f172a] px-4 text-sm text-slate-500 shadow-sm focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-transparent transition-all duration-200">
              <span className="font-black text-slate-400">Q</span>
              <input className="w-full border-0 bg-transparent text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-400" placeholder="Search members, groups, transactions..." />
              <span className="rounded-[5px] border border-[var(--border)] bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 text-[0.64rem] font-black text-slate-500">Ctrl K</span>
            </label>

            {/* Header Right buttons */}
            <div className="flex flex-wrap items-center gap-2 relative">
              <span className="status-pill border border-[var(--border)] bg-white dark:bg-[#0f172a] text-slate-700 dark:text-slate-300 rounded-[7px] flex items-center gap-2">
                Polygon Amoy <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </span>

              {/* Theme Toggle Button */}
              <button 
                onClick={toggleTheme} 
                className="button-secondary h-10 w-10 p-0 flex items-center justify-center shadow-sm relative hover:scale-105 active:scale-95 transition-all" 
                type="button"
                aria-label="Theme toggle"
                title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
              >
                <span className="text-lg">{theme === "light" ? "🌙" : "☀️"}</span>
              </button>

              {/* Notifications Center Toggle */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowProfileMenu(false);
                  }}
                  className="button-secondary h-10 w-10 p-0 flex items-center justify-center shadow-sm relative hover:scale-105 active:scale-95 transition-all" 
                  type="button"
                  aria-label="Notifications"
                >
                  <span className="text-lg">🔔</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 rounded-full bg-rose-500 h-5 w-5 flex items-center justify-center text-[10px] font-bold text-white border-2 border-white dark:border-[#0f172a] animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 rounded-lg border border-[var(--border)] bg-white dark:bg-[#0f172a] p-4 shadow-xl z-50 animate-fade-in-up">
                    <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 mb-3">
                      <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">Alert Center</h3>
                      <button onClick={handleMarkAllRead} className="text-xs font-black text-violet-600 dark:text-violet-400 hover:underline">Mark all read</button>
                    </div>
                    <div className="grid gap-2 max-h-60 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((n) => (
                          <div 
                            key={n.id} 
                            onClick={() => {
                              setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item));
                            }}
                            className={`p-2.5 rounded-md text-xs transition-colors cursor-pointer border ${
                              n.read 
                                ? "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400" 
                                : "bg-violet-50/50 dark:bg-violet-950/20 border-violet-100 dark:border-violet-900/40 text-slate-800 dark:text-slate-200 font-extrabold"
                            }`}
                          >
                            <p className="leading-relaxed">{n.text}</p>
                            <span className="block mt-1 text-[10px] text-slate-400 font-medium">{n.time}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-xs text-slate-400 py-4">No notifications.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown Toggle */}
              {!publicView && (
                <div className="relative">
                  <button 
                    onClick={() => {
                      setShowProfileMenu(!showProfileMenu);
                      setShowNotifications(false);
                    }}
                    className="button-secondary min-h-10 px-3 flex items-center gap-2 shadow-sm rounded-[7px] hover:scale-105 active:scale-95 transition-all"
                    type="button"
                  >
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-violet-600 text-white text-[10px] font-black">JK</span>
                    <span className="text-xs font-black hidden sm:inline text-slate-700 dark:text-slate-300">John Kamau</span>
                    <span className="text-[10px] text-slate-400 font-bold">▼</span>
                  </button>

                  {/* Profile Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 rounded-lg border border-[var(--border)] bg-white dark:bg-[#0f172a] py-2 shadow-xl z-50 animate-fade-in-up">
                      <div className="px-4 py-2 border-b border-[var(--border)]">
                        <span className="block text-xs font-black text-slate-800 dark:text-slate-200">John Kamau</span>
                        <span className="block text-[10px] text-slate-400 font-medium truncate">johnkamau@email.com</span>
                      </div>
                      <Link href="/member" onClick={() => setShowProfileMenu(false)} className="block w-full text-left px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        Member Console
                      </Link>
                      <Link href="/group-admin" onClick={() => setShowProfileMenu(false)} className="block w-full text-left px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        Group Admin Console
                      </Link>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-xs font-black text-rose-600 dark:text-rose-400 border-t border-[var(--border)] hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors" type="button">
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}

              {!publicView && <WalletButton compact />}
            </div>
          </div>

          <header className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h1 className="text-2xl font-black tracking-normal sm:text-3xl text-slate-800 dark:text-slate-100">{title}</h1>
              {subtitle && <p className="mt-2 max-w-3xl text-sm font-medium text-slate-500 dark:text-slate-400 sm:text-base">{subtitle}</p>}
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
