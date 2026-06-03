"use client";

import Link from "next/link";
import { WalletButton } from "../components/WalletButton";

export default function HomePage() {
  return (
    <main className="dashboard-shell grid min-h-screen place-items-center px-4 py-10 relative overflow-hidden">
      {/* Background Floating Parallax Glow Orbs */}
      <div className="glow-orb glow-orb-primary w-[30rem] h-[30rem] top-[-10%] left-[-15%] animate-float-1" />
      <div className="glow-orb glow-orb-secondary w-[30rem] h-[30rem] bottom-[-15%] right-[-10%] animate-float-2" />
      <div className="glow-orb glow-orb-amber w-[20rem] h-[20rem] top-[60%] left-[20%] animate-float-rotate" />

      <section className="relative z-10 grid w-full max-w-5xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center animate-fade-in-up">
        <div>
          <p className="stat-label mb-4">PayLoop Admin</p>
          <h1 className="max-w-3xl text-4xl font-black tracking-normal sm:text-6xl">Open the right dashboard for every PayLoop role.</h1>
          <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-slate-600">
            Members, treasurers, group admins, and super admins each get a dashboard scoped to what they are allowed to manage.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <WalletButton compact />
            <Link className="button-secondary" href="/login">
              Login / Register
            </Link>
          </div>
        </div>

        <div className="panel glass-panel card-3d p-6 sm:p-8">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="stat-label">Current Vault</p>
              <strong className="text-3xl">KES 1.25M</strong>
            </div>
            <span className="status-pill bg-emerald-100 text-emerald-700 font-black rounded-full px-3 py-1 animate-pulse">Live</span>
          </div>
          <div className="grid gap-3">
            {["Member Dashboard", "Treasurer Dashboard", "Group Admin Dashboard", "Super Admin Dashboard"].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-[7px] border border-[var(--border)] bg-white/70 p-3 hover:bg-violet-50 transition-colors duration-200 shadow-sm">
                <span className="font-extrabold text-slate-800">{item}</span>
                <span className="text-xs font-black uppercase text-violet-600 bg-violet-50 rounded px-2.5 py-0.5 border border-violet-100">Ready</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
