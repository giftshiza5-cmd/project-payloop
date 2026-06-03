"use client";

import { DashboardShell } from "../../components/DashboardShell";
import { ContributionTrendChart, LoanStatusChart, MemberContributionChart } from "../../components/Charts";
import { contributionTrend, loanHistory, memberContributions } from "../../lib/data";
import { exportMeetingReport } from "../../lib/pdf";

const overviewStats = [
  { label: "Total Group Balance", value: "KES 1,250,000", helper: "+12.5% this month", tone: "violet" },
  { label: "Total Contributions", value: "KES 780,000", helper: "KES 360,000 in June", tone: "green" },
  { label: "Total Loans Issued", value: "KES 410,000", helper: "7 approved loans", tone: "blue" },
  { label: "Pending Repayments", value: "KES 48,000", helper: "5 repayments due", tone: "amber" },
  { label: "Available Funds", value: "KES 840,000", helper: "67% of group balance", tone: "cyan" },
  { label: "Active Members Count", value: "24", helper: "22 paid this cycle", tone: "green" },
];

const sidebarItems = ["Dashboard", "Contributions", "Loans", "Repayments", "Transactions", "Members", "Analytics", "Reports", "Notifications", "Settings"];

const featureGroups = [
  {
    title: "Contributions Management",
    items: ["View Contributions", "Record Contributions", "Contribution History", "Pending Contributions", "Contribution Reminders", "Monthly Contribution Summary"],
  },
  {
    title: "Loan Management",
    items: ["View Approved Loans", "Disburse Loans", "Track Loan Status", "Monitor Outstanding Loans", "Loan Repayment Schedule"],
  },
  {
    title: "Repayments",
    items: ["Upcoming Repayments", "Overdue Repayments", "Defaulters List", "Repayment Tracking", "Repayment Reminders"],
  },
  {
    title: "Transactions",
    items: ["Contribution Transactions", "Loan Disbursements", "Loan Repayments", "M-Pesa Transactions", "Blockchain Transactions"],
  },
  {
    title: "Reports",
    items: ["Monthly Financial Reports", "Contribution Reports", "Loan Reports", "Repayment Reports", "Export PDF/Excel Reports"],
  },
  {
    title: "Settings",
    items: ["Contribution Amount Settings", "Penalty Rules", "Reminder Settings", "Payment Method Settings", "Financial Policy Settings"],
  },
];

const quickActions = ["Add Contribution", "Disburse Loan", "Send Reminder", "Generate Report", "View Transactions", "Export Data"];

const repayments = [
  { member: "Peter Mwangi", loan: "School Fees", due: "Jun 05", amount: "KES 8,000", status: "Upcoming" },
  { member: "Amina Yusuf", loan: "Clinic Equipment", due: "Jun 02", amount: "KES 12,000", status: "Overdue" },
  { member: "Grace Wanjiku", loan: "Business Stock", due: "Jun 12", amount: "KES 6,500", status: "Upcoming" },
];

const notifications = [
  { label: "New Contributions", detail: "Mary Wanjiku added KES 5,000", tone: "green" },
  { label: "Loan Approval Alerts", detail: "2 loans ready for disbursement", tone: "blue" },
  { label: "Repayment Alerts", detail: "3 repayments due this week", tone: "amber" },
  { label: "Overdue Payment Alerts", detail: "1 member is overdue", tone: "red" },
  { label: "Low Balance Alerts", detail: "No current vault risk", tone: "green" },
];

const walletDetails = [
  { label: "Current Vault Balance", value: "KES 1,250,000" },
  { label: "Smart Contract Address", value: "0xA1b2...C3d4" },
  { label: "Wallet Address", value: "0x7f2A...8C45" },
  { label: "Available Funds", value: "KES 840,000" },
  { label: "Transaction History", value: "256 records" },
];

function toneClass(tone) {
  if (tone === "green") return "bg-emerald-100 text-emerald-700";
  if (tone === "blue") return "bg-blue-100 text-blue-700";
  if (tone === "amber") return "bg-amber-100 text-amber-700";
  if (tone === "red") return "bg-red-100 text-red-700";
  if (tone === "cyan") return "bg-cyan-100 text-cyan-700";
  return "bg-violet-100 text-violet-700";
}

function FeatureList({ title, items }) {
  return (
    <article className="panel glass-panel card-3d p-4">
      <h2 className="text-lg font-black">{title}</h2>
      <div className="mt-3 grid gap-2">
        {items.map((item) => (
          <div className="flex items-center justify-between rounded-[7px] border border-[var(--border)] bg-slate-50 px-3 py-2" key={item}>
            <span className="text-sm font-extrabold text-slate-700">{item}</span>
            <span className="status-pill bg-white text-slate-500">Ready</span>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function TreasurerDashboardPage() {
  return (
    <DashboardShell
      title="Treasurer Dashboard"
      subtitle="Monitor group finances, manage contributions, disburse approved loans, track repayments, review transactions, and generate financial reports."
      actions={
        <>
          <button className="button-primary">Add Contribution</button>
          <button className="button-secondary" onClick={exportMeetingReport}>Generate Report</button>
        </>
      }
    >
      <section className="mb-4 grid gap-2 rounded-[8px] border border-[var(--border)] bg-white p-3 shadow-sm md:grid-cols-5 xl:grid-cols-10">
        {sidebarItems.map((item) => (
          <a className="rounded-[7px] bg-slate-50 px-3 py-2 text-center text-xs font-black text-slate-600 hover:bg-violet-50 hover:text-violet-700" href={`#${item.toLowerCase()}`} key={item}>
            {item}
          </a>
        ))}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6" id="dashboard">
        {overviewStats.map((stat) => (
          <article className="panel glass-panel card-3d metric-card p-4" key={stat.label}>
            <span className={`status-pill ${toneClass(stat.tone)}`}>{stat.label}</span>
            <strong className="relative z-10 mt-3 block text-2xl tracking-tight">{stat.value}</strong>
            <span className="relative z-10 mt-2 block text-xs font-black text-slate-500">{stat.helper}</span>
          </article>
        ))}
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]" id="analytics">
        <article className="panel glass-panel card-3d p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black">Financial Analytics</h2>
              <p className="text-sm font-bold text-violet-600">Monthly Contribution Chart</p>
            </div>
            <span className="status-pill bg-violet-50 text-violet-700">Income vs Expenses</span>
          </div>
          <ContributionTrendChart data={contributionTrend} />
        </article>

        <article className="panel glass-panel card-3d p-4">
          <div className="mb-4">
            <h2 className="text-lg font-black">Loan Repayment Chart</h2>
            <p className="text-sm font-medium text-slate-500">Loan status and group financial trends.</p>
          </div>
          <LoanStatusChart data={loanHistory} />
        </article>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[0.85fr_1.15fr]" id="members">
        <article className="panel glass-panel card-3d p-4">
          <h2 className="text-lg font-black">Member Financial Records</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">Contribution history, loan history, outstanding balances, credit scores, and repayment performance.</p>
          <div className="mt-4">
            <MemberContributionChart data={memberContributions} />
          </div>
        </article>

        <article className="panel glass-panel card-3d overflow-hidden" id="repayments">
          <div className="flex items-center justify-between p-4">
            <div>
              <h2 className="text-lg font-black">Repayment Tracking</h2>
              <p className="text-sm font-medium text-slate-500">Upcoming repayments, overdue repayments, and defaulters list.</p>
            </div>
            <button className="button-secondary">Send Reminder</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Member</th>
                  <th className="px-4 py-3">Loan</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {repayments.map((repayment) => (
                  <tr className="table-row" key={`${repayment.member}-${repayment.due}`}>
                    <td className="px-4 py-3 font-bold">{repayment.member}</td>
                    <td className="px-4 py-3 text-slate-600">{repayment.loan}</td>
                    <td className="px-4 py-3">{repayment.due}</td>
                    <td className="px-4 py-3 font-bold">{repayment.amount}</td>
                    <td className="px-4 py-3">
                      <span className={`status-pill ${repayment.status === "Overdue" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>{repayment.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-3">
        {featureGroups.map((group) => (
          <FeatureList key={group.title} {...group} />
        ))}
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[0.72fr_1fr_0.78fr]">
        <article className="panel glass-panel card-3d p-4" id="transactions">
          <h2 className="text-lg font-black">Transactions</h2>
          <div className="mt-3 grid gap-2">
            {["Contribution Transactions", "Loan Disbursements", "Loan Repayments", "M-Pesa Transactions", "Blockchain Transactions"].map((item) => (
              <div className="rounded-[7px] border border-[var(--border)] bg-slate-50 p-3" key={item}>
                <strong className="block text-sm">{item}</strong>
                <span className="text-xs font-medium text-slate-500">Latest records synced today</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel glass-panel card-3d p-4" id="notifications">
          <h2 className="text-lg font-black">Notifications</h2>
          <div className="mt-3 grid gap-3">
            {notifications.map((item) => (
              <div className="grid grid-cols-[2.25rem_1fr] items-center gap-3 rounded-[7px] border border-[var(--border)] bg-white p-3" key={item.label}>
                <span className={`grid h-9 w-9 place-items-center rounded-[7px] text-sm font-black ${toneClass(item.tone)}`}>{item.label[0]}</span>
                <span>
                  <strong className="block text-sm">{item.label}</strong>
                  <span className="text-xs font-medium text-slate-500">{item.detail}</span>
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel glass-panel card-3d p-4">
          <h2 className="text-lg font-black">Wallet / Vault Management</h2>
          <div className="mt-3 grid gap-2">
            {walletDetails.map((item) => (
              <div className="rounded-[7px] border border-[var(--border)] bg-slate-50 p-3" key={item.label}>
                <span className="text-xs font-black uppercase text-slate-400">{item.label}</span>
                <strong className="mt-1 block truncate">{item.value}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[0.72fr_1.28fr]" id="settings">
        <article className="panel glass-panel card-3d p-4">
          <h2 className="text-lg font-black">Quick Actions</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {quickActions.map((action, index) => (
              <button className={index < 2 ? "button-primary" : "button-secondary"} key={action}>{action}</button>
            ))}
          </div>
        </article>

        <article className="panel glass-panel card-3d p-4" id="reports">
          <h2 className="text-lg font-black">Reports and Financial Policy</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {["Monthly Financial Reports", "Contribution Reports", "Loan Reports", "Repayment Reports", "Export PDF/Excel Reports", "Contribution Amount Settings", "Penalty Rules", "Reminder Settings", "Payment Method Settings", "Financial Policy Settings"].map((item) => (
              <div className="flex items-center justify-between rounded-[7px] border border-[var(--border)] bg-slate-50 px-3 py-2" key={item}>
                <span className="text-sm font-extrabold text-slate-700">{item}</span>
                <span className="text-xs font-black text-violet-600">Open</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </DashboardShell>
  );
}

