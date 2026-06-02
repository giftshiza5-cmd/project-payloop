"use client";

import { DashboardShell } from "../../components/DashboardShell";
import { ContributionTrendChart, LoanStatusChart } from "../../components/Charts";
import { contributionTrend, loanHistory } from "../../lib/data";
import { exportMeetingReport } from "../../lib/pdf";

const overviewStats = [
  { label: "Total Registered Users", value: "1,284", helper: "+64 this month", tone: "violet" },
  { label: "Total Savings Groups", value: "86", helper: "12 counties active", tone: "green" },
  { label: "Total Platform Contributions", value: "KES 8.4M", helper: "+18.2% this quarter", tone: "blue" },
  { label: "Total Loans Issued", value: "KES 3.1M", helper: "126 funded loans", tone: "amber" },
  { label: "Total Transactions", value: "4,982", helper: "M-Pesa and chain events", tone: "cyan" },
  { label: "Active Users", value: "972", helper: "76% monthly active", tone: "green" },
  { label: "Active Groups", value: "74", helper: "86% operational", tone: "blue" },
  { label: "Platform Revenue", value: "KES 142,000", helper: "Service fees tracked", tone: "violet" },
];

const navItems = ["Dashboard", "Users", "Admins", "Groups", "Finance", "Loans", "Analytics", "Notifications", "Reports", "Security", "System", "Blockchain", "Content", "Support"];

const platformSections = [
  {
    id: "users",
    title: "User Management",
    items: ["View All Users", "Add Users", "Edit User Details", "Suspend Users", "Delete Users", "Reset User Passwords", "Assign User Roles"],
  },
  {
    id: "admins",
    title: "Admin Management",
    items: ["Add Admins", "Remove Admins", "Assign Permissions", "Manage Treasurer Accounts", "Manage Group Admin Accounts"],
  },
  {
    id: "groups",
    title: "Group Management",
    items: ["View All Groups", "Create Groups", "Edit Group Information", "Suspend Groups", "Delete Groups", "Monitor Group Activities"],
  },
  {
    id: "finance",
    title: "Financial Monitoring",
    items: ["View All Contributions", "View All Loans", "Monitor Repayments", "Monitor M-Pesa Transactions", "Monitor Blockchain Transactions", "Financial Audit Reports"],
  },
  {
    id: "loans",
    title: "Loan Oversight",
    items: ["View All Loan Requests", "Monitor Approved Loans", "Monitor Rejected Loans", "View Defaulters", "Track Loan Recovery"],
  },
  {
    id: "notifications",
    title: "Notifications Management",
    items: ["Send Platform Announcements", "Send Group Notifications", "Broadcast Messages", "Emergency Alerts"],
  },
  {
    id: "reports",
    title: "Reports",
    items: ["User Reports", "Group Reports", "Financial Reports", "Loan Reports", "Transaction Reports", "Export PDF Reports", "Export Excel Reports"],
  },
  {
    id: "security",
    title: "Security Management",
    items: ["View Login Logs", "View Activity Logs", "Monitor Failed Logins", "Manage Permissions", "Two-Factor Authentication Settings", "Audit Trails"],
  },
  {
    id: "system",
    title: "System Settings",
    items: ["Platform Configuration", "Contribution Rules", "Loan Rules", "Interest/Penalty Settings", "Notification Settings", "Wallet Settings"],
  },
  {
    id: "blockchain",
    title: "Blockchain Management",
    items: ["View Smart Contract Status", "Monitor Contract Transactions", "View Contract Addresses", "Manage Token Settings", "Monitor Wallet Activity"],
  },
  {
    id: "content",
    title: "Content & Resources",
    items: ["Manage Help Resources", "Manage FAQs", "Manage Tutorials", "Upload Documents", "Manage Announcements"],
  },
  {
    id: "support",
    title: "Support Center",
    items: ["View User Complaints", "Resolve Support Tickets", "Chat with Users", "Manage Feedback"],
  },
];

const auditEvents = [
  { label: "Failed login spike", detail: "7 failed attempts from one IP", tone: "red", time: "8m" },
  { label: "Admin role assigned", detail: "Grace Wanjiku assigned Treasurer permissions", tone: "blue", time: "22m" },
  { label: "Group suspended", detail: "Nakuru Circle paused for audit review", tone: "amber", time: "1h" },
  { label: "Contract status checked", detail: "CircleVault registry verified on Amoy", tone: "green", time: "2h" },
];

const supportTickets = [
  { user: "Mary Wanjiku", issue: "Contribution receipt missing", status: "Open" },
  { user: "Peter Mwangi", issue: "Loan repayment dispute", status: "Review" },
  { user: "Amina Yusuf", issue: "Cannot update profile", status: "Resolved" },
];

function toneClass(tone) {
  if (tone === "green") return "bg-emerald-100 text-emerald-700";
  if (tone === "blue") return "bg-blue-100 text-blue-700";
  if (tone === "amber") return "bg-amber-100 text-amber-700";
  if (tone === "red") return "bg-red-100 text-red-700";
  if (tone === "cyan") return "bg-cyan-100 text-cyan-700";
  return "bg-violet-100 text-violet-700";
}

function PlatformSection({ id, title, items }) {
  return (
    <article className="panel p-4" id={id}>
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

export default function SuperAdminDashboardPage() {
  return (
    <DashboardShell
      title="Super Admin Dashboard"
      subtitle="Manage the full PayLoop platform: users, groups, admins, finances, loan oversight, security, blockchain operations, content, and support."
      actions={
        <>
          <button className="button-primary">Send Announcement</button>
          <button className="button-secondary" onClick={exportMeetingReport}>Export Reports</button>
        </>
      }
    >
      <section className="mb-4 grid gap-2 rounded-[8px] border border-[var(--border)] bg-white p-3 shadow-sm md:grid-cols-4 xl:grid-cols-7">
        {navItems.map((item) => (
          <a className="rounded-[7px] bg-slate-50 px-3 py-2 text-center text-xs font-black text-slate-600 hover:bg-violet-50 hover:text-violet-700" href={`#${item.toLowerCase()}`} key={item}>
            {item}
          </a>
        ))}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" id="dashboard">
        {overviewStats.map((stat) => (
          <article className="panel metric-card p-4" key={stat.label}>
            <span className={`status-pill ${toneClass(stat.tone)}`}>{stat.label}</span>
            <strong className="relative z-10 mt-3 block text-2xl tracking-tight">{stat.value}</strong>
            <span className="relative z-10 mt-2 block text-xs font-black text-slate-500">{stat.helper}</span>
          </article>
        ))}
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]" id="analytics">
        <article className="panel p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black">Analytics & Insights</h2>
              <p className="text-sm font-bold text-violet-600">User growth, group growth, contribution trends, and platform activity charts.</p>
            </div>
            <span className="status-pill bg-violet-50 text-violet-700">Contribution Trends</span>
          </div>
          <ContributionTrendChart data={contributionTrend} />
        </article>

        <article className="panel p-4">
          <div className="mb-4">
            <h2 className="text-lg font-black">Loan Trends</h2>
            <p className="text-sm font-medium text-slate-500">Approved, rejected, defaulter, and repayment trend oversight.</p>
          </div>
          <LoanStatusChart data={loanHistory} />
        </article>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="panel p-4">
          <h2 className="text-lg font-black">Security & Audit Watch</h2>
          <div className="mt-3 grid gap-3">
            {auditEvents.map((event) => (
              <div className="grid grid-cols-[2.25rem_1fr_auto] items-center gap-3 rounded-[7px] border border-[var(--border)] bg-white p-3" key={event.label}>
                <span className={`grid h-9 w-9 place-items-center rounded-[7px] text-sm font-black ${toneClass(event.tone)}`}>{event.label[0]}</span>
                <span>
                  <strong className="block text-sm">{event.label}</strong>
                  <span className="text-xs font-medium text-slate-500">{event.detail}</span>
                </span>
                <span className="text-xs font-bold text-slate-500">{event.time}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel overflow-hidden" id="support">
          <div className="flex items-center justify-between p-4">
            <div>
              <h2 className="text-lg font-black">Support Center</h2>
              <p className="text-sm font-medium text-slate-500">User complaints, support tickets, user chat, and feedback management.</p>
            </div>
            <button className="button-secondary">Chat with Users</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Complaint / Ticket</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {supportTickets.map((ticket) => (
                  <tr className="table-row" key={ticket.issue}>
                    <td className="px-4 py-3 font-bold">{ticket.user}</td>
                    <td className="px-4 py-3 text-slate-600">{ticket.issue}</td>
                    <td className="px-4 py-3"><span className="status-pill bg-violet-50 text-violet-700">{ticket.status}</span></td>
                    <td className="px-4 py-3"><button className="button-secondary min-h-8 px-3 text-xs">Resolve</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-3">
        {platformSections.map((section) => (
          <PlatformSection key={section.title} {...section} />
        ))}
      </section>
    </DashboardShell>
  );
}

