"use client";

import { DashboardShell } from "../../components/DashboardShell";
import { ContributionTrendChart } from "../../components/Charts";
import { contributionTrend } from "../../lib/data";
import { WalletButton } from "../../components/WalletButton";

const overviewStats = [
  { label: "Personal Savings Balance", value: "KES 86,000", helper: "+KES 5,000 this month", tone: "violet" },
  { label: "Active Loans", value: "1", helper: "KES 12,000 remaining", tone: "blue" },
  { label: "Credit Score", value: "725", helper: "Good standing", tone: "green" },
  { label: "Recent Transactions", value: "18", helper: "6 this week", tone: "cyan" },
  { label: "Contribution Status", value: "Paid", helper: "Next due Jun 5", tone: "green" },
];

const navItems = ["Dashboard", "Savings", "Loans", "Credit", "Groups", "Wallet", "Notifications", "Profile", "Support"];

const memberSections = [
  {
    id: "savings",
    title: "Savings & Contributions",
    items: ["Make Contribution", "View Contribution History", "Download Receipts", "View Upcoming Contributions"],
  },
  {
    id: "loans",
    title: "Loan Services",
    items: ["Request Loan", "View Loan Status", "View Repayment Schedule", "Repay Loan", "Loan History"],
  },
  {
    id: "credit",
    title: "Credit Score",
    items: ["Current Credit Score", "Contribution Performance", "Repayment Performance", "Credit Score History"],
  },
  {
    id: "groups",
    title: "Groups",
    items: ["View Joined Groups", "Group Information", "Group Members", "Group Announcements"],
  },
  {
    id: "notifications",
    title: "Notifications",
    items: ["Contribution Reminders", "Loan Updates", "Group Announcements", "Meeting Alerts"],
  },
  {
    id: "profile",
    title: "Profile",
    items: ["Edit Profile", "Change Password", "Update Phone Number", "Update Profile Picture"],
  },
  {
    id: "support",
    title: "Support",
    items: ["Contact Group Admin", "Report Issues", "View FAQs"],
  },
];

const transactions = [
  { label: "Contribution paid", amount: "+KES 5,000", detail: "Eldoret Chama monthly contribution", time: "2m" },
  { label: "Loan repayment", amount: "-KES 3,000", detail: "School fees loan installment", time: "1d" },
  { label: "Receipt downloaded", amount: "PDF", detail: "May contribution receipt", time: "3d" },
];

const walletDetails = [
  { label: "Wallet Address", value: "0x7f2A...8C45" },
  { label: "Token Balance", value: "120.45 MATIC" },
  { label: "Transaction History", value: "256 records" },
];

function toneClass(tone) {
  if (tone === "green") return "bg-emerald-100 text-emerald-700";
  if (tone === "blue") return "bg-blue-100 text-blue-700";
  if (tone === "cyan") return "bg-cyan-100 text-cyan-700";
  return "bg-violet-100 text-violet-700";
}

function FeatureList({ id, title, items }) {
  return (
    <article className="panel glass-panel card-3d p-4" id={id}>
      <h2 className="text-lg font-black">{title}</h2>
      <div className="mt-3 grid gap-2">
        {items.map((item) => (
          <div className="flex items-center justify-between rounded-[7px] border border-[var(--border)] bg-slate-50 px-3 py-2" key={item}>
            <span className="text-sm font-extrabold text-slate-700">{item}</span>
            <span className="status-pill bg-white text-slate-500">Open</span>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function MemberDashboardPage() {
  return (
    <DashboardShell
      title="Member Dashboard"
      subtitle="View personal savings, make contributions, request loans, track credit score, manage wallet details, and get group support."
      actions={
        <>
          <button className="button-primary">Make Contribution</button>
          <a className="button-secondary" href="/loans">Request Loan</a>
        </>
      }
    >
      <section className="mb-4 grid gap-2 rounded-[8px] border border-[var(--border)] bg-white p-3 shadow-sm md:grid-cols-3 xl:grid-cols-9">
        {navItems.map((item) => (
          <a className="rounded-[7px] bg-slate-50 px-3 py-2 text-center text-xs font-black text-slate-600 hover:bg-violet-50 hover:text-violet-700" href={`#${item.toLowerCase()}`} key={item}>
            {item}
          </a>
        ))}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5" id="dashboard">
        {overviewStats.map((stat) => (
          <article className="panel glass-panel card-3d metric-card p-4" key={stat.label}>
            <span className={`status-pill ${toneClass(stat.tone)}`}>{stat.label}</span>
            <strong className="relative z-10 mt-3 block text-2xl tracking-tight">{stat.value}</strong>
            <span className="relative z-10 mt-2 block text-xs font-black text-slate-500">{stat.helper}</span>
          </article>
        ))}
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="panel glass-panel card-3d p-4">
          <div className="mb-4">
            <h2 className="text-lg font-black">Contribution History</h2>
            <p className="text-sm font-medium text-slate-500">Personal savings and upcoming contribution trends.</p>
          </div>
          <ContributionTrendChart data={contributionTrend} />
        </article>

        <article className="panel glass-panel card-3d p-4">
          <h2 className="text-lg font-black">Recent Transactions</h2>
          <div className="mt-3 grid gap-3">
            {transactions.map((item) => (
              <div className="grid grid-cols-[2.25rem_1fr_auto] items-center gap-3 rounded-[7px] border border-[var(--border)] bg-white p-3" key={item.label}>
                <span className="icon-badge">{item.label[0]}</span>
                <span>
                  <strong className="block text-sm">{item.label}</strong>
                  <span className="text-xs font-medium text-slate-500">{item.detail}</span>
                </span>
                <span className="text-right text-xs">
                  <strong className="block text-slate-800">{item.amount}</strong>
                  <span className="font-medium text-slate-500">{item.time}</span>
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-3">
        {memberSections.map((section) => (
          <FeatureList key={section.title} {...section} />
        ))}
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[0.7fr_1.3fr]" id="wallet">
        <article className="panel glass-panel card-3d p-4">
          <h2 className="text-lg font-black">Wallet</h2>
          <div className="mt-3">
            <WalletButton />
          </div>
          <div className="mt-4 grid gap-2">
            {walletDetails.map((item) => (
              <div className="rounded-[7px] border border-[var(--border)] bg-slate-50 p-3" key={item.label}>
                <span className="text-xs font-black uppercase text-slate-400">{item.label}</span>
                <strong className="mt-1 block truncate">{item.value}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="panel glass-panel card-3d p-4">
          <h2 className="text-lg font-black">Loan & Credit Snapshot</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {["View Loan Status", "View Repayment Schedule", "Repay Loan", "Loan History", "Current Credit Score", "Credit Score History"].map((item) => (
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

