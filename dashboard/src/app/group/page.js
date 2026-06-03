"use client";

import { DashboardShell } from "../../components/DashboardShell";
import { ContributionTrendChart, LoanStatusChart } from "../../components/Charts";
import { contributionTrend, loanHistory, memberContributions } from "../../lib/data";
import { exportMeetingReport } from "../../lib/pdf";

const metrics = [
  { label: "Total Savings", value: "KES 1,250,000", helper: "+12.5% from last month", tone: "violet", icon: "TS" },
  { label: "Active Members", value: "24", helper: "+2 new this week", tone: "green", icon: "AM" },
  { label: "Total Loans Issued", value: "KES 780,000", helper: "+8.3% from last month", tone: "blue", icon: "TL" },
  { label: "Pending Loans", value: "5", helper: "View pending", tone: "amber", icon: "PL" },
  { label: "Avg. Credit Score", value: "725", helper: "Good", tone: "cyan", icon: "CS" },
];

const toneStyles = {
  violet: { "--badge-bg": "rgba(124, 58, 237, 0.12)", "--badge-fg": "#6d3df2", "--metric-tint": "rgba(124, 58, 237, 0.08)" },
  green: { "--badge-bg": "rgba(34, 197, 94, 0.12)", "--badge-fg": "#16a34a", "--metric-tint": "rgba(34, 197, 94, 0.08)" },
  blue: { "--badge-bg": "rgba(59, 130, 246, 0.12)", "--badge-fg": "#2563eb", "--metric-tint": "rgba(59, 130, 246, 0.08)" },
  amber: { "--badge-bg": "rgba(245, 158, 11, 0.15)", "--badge-fg": "#b45309", "--metric-tint": "rgba(245, 158, 11, 0.1)" },
  cyan: { "--badge-bg": "rgba(8, 145, 178, 0.12)", "--badge-fg": "#0891b2", "--metric-tint": "rgba(8, 145, 178, 0.08)" },
};

const transactions = [
  { label: "Contribution received", person: "Mary Wanjiku", amount: "+KES 5,000", time: "2 min ago", positive: true },
  { label: "Loan disbursed", person: "Peter Mwangi", amount: "-KES 20,000", time: "45 min ago" },
  { label: "Loan repayment", person: "James Otieno", amount: "+KES 10,000", time: "2 hours ago", positive: true },
  { label: "Group created", person: "Eldoret Chama", amount: "", time: "3 hours ago" },
  { label: "Contribution received", person: "Grace Wanjiku", amount: "+KES 3,000", time: "5 hours ago", positive: true },
];

const pendingLoans = loanHistory.filter((loan) => loan.status === "Pending");

const roleAccess = [
  {
    role: "Member",
    dashboard: "Member Dashboard",
    summary: "Personal savings, contributions, loans, credit score, transactions, and profile.",
    tone: "green",
    items: ["View personal savings", "Make contributions", "Request loans", "View credit score"],
  },
  {
    role: "Treasurer",
    dashboard: "Treasurer Dashboard",
    summary: "Group finances, contribution monitoring, repayment tracking, and financial reports.",
    tone: "blue",
    items: ["View group finances", "Monitor contributions", "Track repayments", "Generate reports"],
  },
  {
    role: "Group Admin",
    dashboard: "Group Admin Dashboard",
    summary: "Group setup, member management, loan decisions, announcements, and analytics.",
    tone: "violet",
    items: ["Create and manage groups", "Add/remove members", "Approve or reject loans", "View analytics"],
  },
  {
    role: "Super Admin",
    dashboard: "Super Admin Dashboard",
    summary: "Platform-wide user, group, admin, audit, analytics, and system settings control.",
    tone: "amber",
    items: ["Manage all users", "Manage all groups", "Access audit logs", "Configure settings"],
  },
];

const accessFlow = ["Open App", "Check Login Status", "Login/Register", "Detect User Role", "Open Correct Dashboard"];

function Sparkline({ tone }) {
  const color = tone === "amber" ? "text-amber-500" : tone === "blue" ? "text-blue-500" : tone === "green" ? "text-emerald-500" : "text-violet-500";

  return (
    <svg className={`h-10 w-24 ${color}`} viewBox="0 0 96 40" aria-hidden="true">
      <path className="sparkline" d="M2 32 L10 31 L18 28 L26 30 L34 25 L42 26 L50 20 L58 22 L66 14 L74 18 L82 8 L94 5" />
    </svg>
  );
}

export default function GroupDashboardPage() {
  return (
    <DashboardShell
      title="Group Admin Dashboard"
      subtitle="Create groups, manage members, approve or reject loans, send announcements, and view group analytics."
      actions={
        <>
          <a className="button-primary" href="/create-group">+ Create Group</a>
          <button className="button-secondary" onClick={exportMeetingReport}>Export Report</button>
        </>
      }
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => (
          <article className="panel glass-panel card-3d metric-card p-4" key={metric.label} style={toneStyles[metric.tone]}>
            <div className="relative z-10 flex items-start justify-between gap-3">
              <div className="icon-badge">{metric.icon}</div>
              <Sparkline tone={metric.tone} />
            </div>
            <div className="relative z-10 mt-3">
              <p className="text-sm font-extrabold text-slate-500">{metric.label}</p>
              <strong className="mt-1 block text-2xl tracking-tight">{metric.value}</strong>
              <span className={`mt-2 block text-xs font-black ${metric.tone === "amber" ? "text-amber-600" : "text-emerald-600"}`}>{metric.helper}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="panel glass-panel card-3d p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black">Recommended Roles</h2>
              <p className="text-sm font-medium text-slate-500">Each user lands on the dashboard that matches their PayLoop permissions.</p>
            </div>
            <span className="status-pill bg-violet-50 text-violet-700">Current: Group Admin</span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {roleAccess.map((role) => (
              <div className="rounded-[7px] border border-[var(--border)] bg-slate-50/80 p-3" key={role.role} style={toneStyles[role.tone]}>
                <div className="flex items-start gap-3">
                  <span className="icon-badge">{role.role.split(" ").map((word) => word[0]).join("")}</span>
                  <div>
                    <h3 className="font-black">{role.role}</h3>
                    <p className="text-xs font-black uppercase text-slate-400">{role.dashboard}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{role.summary}</p>
                <div className="mt-3 grid gap-1.5">
                  {role.items.map((item) => (
                    <span className="text-xs font-extrabold text-slate-600" key={item}>- {item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel glass-panel card-3d p-4">
          <h2 className="text-lg font-black">Dashboard Access Flow</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">Login state and role decide where the user is sent.</p>
          <div className="mt-5 grid gap-3">
            {accessFlow.map((step, index) => (
              <div className="grid grid-cols-[2.25rem_1fr] items-center gap-3" key={step}>
                <span className={`grid h-9 w-9 place-items-center rounded-[7px] text-sm font-black ${index === 2 ? "bg-amber-100 text-amber-700" : "bg-violet-50 text-violet-700"}`}>
                  {index + 1}
                </span>
                <div className="rounded-[7px] border border-[var(--border)] bg-white p-3">
                  <strong className="block">{step}</strong>
                  <span className="text-xs font-medium text-slate-500">
                    {index === 2 ? "Only shown when the user is not logged in." : index === 4 ? "Member, Treasurer, Group Admin, or Super Admin." : "Required before dashboard routing."}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1.22fr_0.78fr_0.88fr]">
        <article className="panel glass-panel card-3d p-4 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black">Contributions Overview</h2>
              <p className="text-sm font-bold text-violet-600">Total Contributions (KES)</p>
            </div>
            <select className="rounded-[7px] border border-[var(--border)] bg-white px-3 py-2 text-sm font-bold text-slate-600">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <ContributionTrendChart data={contributionTrend} />
        </article>

        <article className="panel glass-panel card-3d p-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h2 className="text-lg font-black">Loan Status Overview</h2>
            <select className="rounded-[7px] border border-[var(--border)] bg-white px-2 py-1.5 text-xs font-bold text-slate-600">
              <option>All Groups</option>
            </select>
          </div>
          <LoanStatusChart data={loanHistory} />
          <div className="grid gap-2 text-sm font-bold text-slate-600">
            {["Approved", "Pending", "Rejected"].map((item, index) => (
              <div key={item} className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${index === 0 ? "bg-emerald-500" : index === 1 ? "bg-amber-500" : "bg-red-500"}`} />
                <span>{item}</span>
                <span className="ml-auto text-slate-400">{index === 0 ? "7 (58%)" : index === 1 ? "3 (25%)" : "2 (17%)"}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <article className="panel glass-panel card-3d overflow-hidden">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-black">Pending Loan Requests</h2>
            <a className="text-sm font-black text-violet-600" href="/loans">View all</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Applicant</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Purpose</th>
                  <th className="px-4 py-3">Votes</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingLoans.map((loan) => (
                  <tr className="table-row" key={loan.id}>
                    <td className="px-4 py-3">
                      <strong>{loan.borrower}</strong>
                      <span className="block text-xs text-slate-500">0x{loan.id}a32f...{loan.id}84dE</span>
                    </td>
                    <td className="px-4 py-3 font-bold">KES {loan.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-600">{loan.purpose}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                          <span className="block h-full rounded-full bg-violet-600" style={{ width: loan.votes.startsWith("15") ? "75%" : "60%" }} />
                        </span>
                        <span className="font-bold">{loan.votes}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="status-pill bg-amber-100 text-amber-700">Pending</span></td>
                    <td className="px-4 py-3"><a className="button-primary min-h-8 px-3 text-xs" href="/loans">Review</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <div className="grid gap-4">
          <article className="panel glass-panel card-3d p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-black">Recent Transactions</h2>
              <a className="text-sm font-black text-violet-600" href="/transparency">View all</a>
            </div>
            <div className="grid gap-3">
              {transactions.map((item) => (
                <div className="grid grid-cols-[2.25rem_1fr_auto] items-center gap-3" key={`${item.label}-${item.time}`}>
                  <span className={`icon-badge ${item.positive ? "" : "text-blue-600"}`}>{item.positive ? "+" : "-"}</span>
                  <span>
                    <strong className="block text-sm">{item.label}</strong>
                    <span className="text-xs font-medium text-slate-500">from {item.person}</span>
                  </span>
                  <span className="text-right text-xs">
                    {item.amount && <strong className={item.positive ? "block text-emerald-600" : "block text-slate-700"}>{item.amount}</strong>}
                    <span className="font-medium text-slate-500">{item.time}</span>
                  </span>
                </div>
              ))}
            </div>
          </article>

          <article className="panel glass-panel card-3d p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-black">Top Contributors</h2>
              <a className="text-sm font-black text-violet-600" href="/members">View all</a>
            </div>
            <div className="grid gap-3">
              {memberContributions.map((member, index) => (
                <div className="grid grid-cols-[1.8rem_1fr_auto] items-center gap-3" key={member.name}>
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-slate-100 text-xs font-black text-slate-600">{index + 1}</span>
                  <span>
                    <strong className="block text-sm">{member.name}</strong>
                    <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <span className="block h-full rounded-full bg-violet-600" style={{ width: `${100 - index * 12}%` }} />
                    </span>
                  </span>
                  <strong className="text-sm">KES {member.amount.toLocaleString()}</strong>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-[0.86fr_0.86fr_1fr_1.12fr]">
        <article className="panel glass-panel card-3d p-4">
          <p className="stat-label">Smart Contract (CircleVault)</p>
          <strong className="mt-2 block truncate">0xA1b2...C3d4</strong>
          <div className="mt-3 flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Deployed on May 28, 2026</span>
            <span className="status-pill bg-emerald-100 text-emerald-700">Verified</span>
          </div>
        </article>
        <article className="panel glass-panel card-3d p-4">
          <p className="stat-label">Total Transactions</p>
          <strong className="mt-2 block text-2xl">256</strong>
          <span className="text-xs font-black text-emerald-600">+18.6% this month</span>
        </article>
        <article className="panel glass-panel card-3d p-4">
          <p className="stat-label">Total Volume (KES)</p>
          <strong className="mt-2 block text-2xl">KES 2,030,000</strong>
          <span className="text-xs font-black text-emerald-600">+14.2% this month</span>
        </article>
        <article className="panel glass-panel card-3d grid grid-cols-[3rem_1fr] items-center gap-4 p-4">
          <span className="icon-badge h-12 w-12 text-lg">PX</span>
          <span>
            <span className="stat-label">Network Status</span>
            <strong className="mt-1 block">Polygon Amoy Testnet</strong>
            <span className="text-xs font-black text-emerald-600">Connected</span>
          </span>
        </article>
      </section>
    </DashboardShell>
  );
}
