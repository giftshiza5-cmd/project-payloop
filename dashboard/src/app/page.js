"use client";

import Link from "next/link";
import { WalletButton } from "../components/WalletButton";

export default function HomePage() {
  return (
    <main className="dashboard-shell grid min-h-screen place-items-center px-4 py-10">
      <section className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="stat-label mb-4">PayLoop Admin</p>
          <h1 className="max-w-3xl text-4xl font-black tracking-normal sm:text-6xl">Run group vaults with wallet-native governance.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Create savings groups, onboard members, review loan votes, and publish transparent public stats from one treasurer dashboard.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <WalletButton compact />
            <Link className="button-secondary" href="/group">
              Open Dashboard
            </Link>
          </div>
        </div>

        <div className="panel p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="stat-label">Current Vault</p>
              <strong className="text-3xl">KES 1.25M</strong>
            </div>
            <span className="status-pill bg-teal-500/15 text-teal-200">Live</span>
          </div>
          <div className="grid gap-3">
            {["Create group vault", "Add wallet members", "Vote on loans", "Export meeting PDF"].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-[7px] border border-[var(--border)] bg-white/[0.03] p-3">
                <span className="font-bold">{item}</span>
                <span className="text-teal-300">Ready</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
