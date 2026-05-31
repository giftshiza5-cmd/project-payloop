"use client";

import { DashboardShell } from "../../components/DashboardShell";
import { ContributionTrendChart, LoanStatusChart, MemberContributionChart } from "../../components/Charts";
import { contributionTrend, groupStats, loanHistory, memberContributions } from "../../lib/data";
import { exportMeetingReport } from "../../lib/pdf";

export default function GroupDashboardPage() {
  return (
    <DashboardShell
      title="Group Dashboard"
      subtitle="Monitor vault growth, member contribution behavior, and loan activity for the active savings group."
      actions={<button className="button-secondary" onClick={exportMeetingReport}>Export PDF</button>}
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {groupStats.map((stat) => (
          <article className="panel p-4" key={stat.label}>
            <p className="stat-label">{stat.label}</p>
            <strong className="mt-3 block text-2xl">{stat.value}</strong>
            <span className="mt-2 block text-sm text-teal-200">{stat.helper}</span>
          </article>
        ))}
      </section>

      <section className="mt-5 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="panel p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-black">Total Vault Trend</h2>
            <span className="text-sm text-slate-400">Last 6 months</span>
          </div>
          <ContributionTrendChart data={contributionTrend} />
        </article>

        <article className="panel p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-black">Contributions by Member</h2>
            <span className="text-sm text-slate-400">KES</span>
          </div>
          <MemberContributionChart data={memberContributions} />
        </article>

        <article className="panel p-4">
          <h2 className="mb-4 text-lg font-black">Loan Status</h2>
          <LoanStatusChart data={loanHistory} />
        </article>

        <article className="panel p-4">
          <h2 className="mb-4 text-lg font-black">Loan History</h2>
          <div className="grid gap-3">
            {loanHistory.map((loan) => (
              <div key={loan.id} className="grid gap-2 rounded-[7px] border border-[var(--border)] p-3 sm:grid-cols-[1fr_auto]">
                <div>
                  <strong>{loan.borrower}</strong>
                  <p className="text-sm text-slate-400">{loan.purpose}</p>
                </div>
                <div className="text-left sm:text-right">
                  <strong>KES {loan.amount.toLocaleString()}</strong>
                  <span className="block text-sm text-slate-400">{loan.status}</span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </DashboardShell>
  );
}
