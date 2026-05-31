import { DashboardShell } from "../../components/DashboardShell";
import { publicStats, contributionTrend, loanHistory } from "../../lib/data";

export default function TransparencyPage() {
  return (
    <DashboardShell
      publicView
      title="Public Transparency"
      subtitle="A public, privacy-preserving view of aggregate PayLoop activity. Member addresses and private loan notes are excluded."
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {publicStats.map((stat) => (
          <article className="panel p-4" key={stat.label}>
            <p className="stat-label">{stat.label}</p>
            <strong className="mt-3 block text-2xl">{stat.value}</strong>
          </article>
        ))}
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-2">
        <article className="panel p-4">
          <h2 className="mb-4 text-lg font-black">Monthly Public Totals</h2>
          <div className="grid gap-3">
            {contributionTrend.map((item) => (
              <div key={item.month} className="grid grid-cols-[4rem_1fr_auto] items-center gap-3">
                <span className="font-bold">{item.month}</span>
                <span className="h-2 rounded-full bg-white/10">
                  <span className="block h-2 rounded-full bg-teal-500" style={{ width: `${Math.min(100, item.amount / 4000)}%` }} />
                </span>
                <span className="text-sm text-slate-300">KES {item.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel p-4">
          <h2 className="mb-4 text-lg font-black">Loan Outcomes</h2>
          <div className="grid gap-3">
            {loanHistory.map((loan) => (
              <div key={loan.id} className="flex items-center justify-between rounded-[7px] border border-[var(--border)] p-3">
                <span>{loan.purpose}</span>
                <span className="status-pill bg-white/10 text-slate-200">{loan.status}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </DashboardShell>
  );
}
