"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletButton } from "./WalletButton";

const navItems = [
  { label: "Overview", href: "/group" },
  { label: "Create Group", href: "/create-group" },
  { label: "Members", href: "/members" },
  { label: "Loans", href: "/loans" },
  { label: "Transparency", href: "/transparency" },
];

export function DashboardShell({ title, subtitle, actions, children, publicView = false }) {
  const pathname = usePathname();

  return (
    <div className="dashboard-shell">
      <div className="grid min-h-screen lg:grid-cols-[238px_1fr]">
        <aside className="hidden border-r border-[var(--border)] bg-[#0b1524]/80 p-5 lg:block">
          <Link href="/" className="mb-8 flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-[7px] bg-teal-600 font-black text-white">P</span>
            <span>
              <span className="block text-xl font-black">PayLoop</span>
              <span className="text-xs text-slate-400">Group treasury admin</span>
            </span>
          </Link>

          <nav className="grid gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-[7px] px-3 py-2 text-sm font-bold ${
                  pathname === item.href ? "bg-teal-500/18 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {!publicView && (
            <div className="panel mt-8 p-4">
              <p className="stat-label mb-3">Wallet</p>
              <WalletButton />
            </div>
          )}
        </aside>

        <main className="min-w-0 px-4 py-5 sm:px-6 lg:px-8">
          <header className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="stat-label mb-2">PayLoop Dashboard</p>
              <h1 className="text-2xl font-black tracking-normal sm:text-3xl">{title}</h1>
              {subtitle && <p className="mt-2 max-w-3xl text-sm text-slate-400 sm:text-base">{subtitle}</p>}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {actions}
              {!publicView && <WalletButton compact />}
            </div>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
