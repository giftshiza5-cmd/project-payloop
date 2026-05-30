"use client";

import { useEffect, useMemo, useState } from "react";
import { useAccount, useChainId, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { polygon } from "wagmi/chains";
import { upsertPayLoopUser } from "../lib/firebase";

const polygonParams = {
  chainId: "0x89",
  chainName: "Polygon",
  nativeCurrency: {
    name: "POL",
    symbol: "POL",
    decimals: 18,
  },
  rpcUrls: ["https://polygon-rpc.com"],
  blockExplorerUrls: ["https://polygonscan.com"],
};

const navGroups = [
  {
    title: "Management",
    items: ["Dashboard", "Groups", "Members", "Contributions", "Loans", "Credit Scores"],
  },
  {
    title: "Analytics",
    items: ["Analytics", "Transactions", "Reports"],
  },
  {
    title: "Communication",
    items: ["Notifications", "Messages"],
  },
  {
    title: "Settings",
    items: ["Settings", "Admins", "Integrations"],
  },
];

const stats = [
  ["Total Savings", "KES 1,250,000", "+12.5% from last month", "S"],
  ["Active Members", "24", "+2 new this week", "M"],
  ["Total Loans Issued", "KES 780,000", "+8.3% from last month", "L"],
  ["Pending Loans", "5", "View pending", "P"],
  ["Avg. Credit Score", "725", "Good", "C"],
];

const transactions = [
  ["Contribution received", "from Mary Wanjiku", "+KES 5,000", "2 min ago"],
  ["Loan disbursed", "to Peter Mwangi", "-KES 20,000", "45 min ago"],
  ["Loan repayment", "from James Otieno", "+KES 10,000", "2 hours ago"],
  ["Group created", "Eldoret Chama", "", "3 hours ago"],
];

const contributors = [
  ["Mary Wanjiku", "KES 120,000", "100%"],
  ["John Kamau", "KES 100,000", "84%"],
  ["James Otieno", "KES 90,000", "75%"],
  ["Grace Wanjiku", "KES 80,000", "67%"],
  ["Peter Mwangi", "KES 70,000", "58%"],
];

export default function HomePage() {
  const [displayName, setDisplayName] = useState("John Kamau");
  const [status, setStatus] = useState("");
  const [theme, setTheme] = useState("dark");
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connectAsync, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const isWrongNetwork = useMemo(
    () => isConnected && chainId !== polygon.id,
    [chainId, isConnected],
  );

  useEffect(() => {
    disconnect();
  }, [disconnect]);

  async function handleConnect() {
    setStatus("");

    try {
      const result = await connectAsync({ connector: injected() });
      const connectedAddress = result.accounts?.[0];

      if (!connectedAddress) {
        setStatus("MetaMask did not return a wallet address.");
        return;
      }

      await upsertPayLoopUser({
        walletAddress: connectedAddress,
        displayName: displayName || "PayLoop Member",
      });

      setStatus("Wallet connected and user saved.");
    } catch (error) {
      setStatus(error.message || "Could not connect MetaMask.");
    }
  }

  async function handleSwitchToPolygon() {
    if (!window.ethereum) {
      setStatus("MetaMask is not available in this browser.");
      return;
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: polygonParams.chainId }],
      });
    } catch (error) {
      if (error.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [polygonParams],
        });
        return;
      }

      setStatus(error.message || "Could not switch to Polygon.");
    }
  }

  return (
    <div className="app-shell" data-theme={theme}>
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">P</span>
          <div>
            <span className="brand-title">PayLoop</span>
            <span className="brand-subtitle">Decentralized Chama Platform</span>
          </div>
        </div>

        {navGroups.map((group) => (
          <nav className="nav-section" key={group.title}>
            <p className="nav-title">{group.title}</p>
            {group.items.map((item) => (
              <button className={`nav-item ${item === "Dashboard" ? "active" : ""}`} key={item}>
                <span className="nav-icon">+</span>
                {item}
              </button>
            ))}
          </nav>
        ))}

        <div className="connected-card">
          <small>Connected Wallet</small>
          <div className="connected-address">{address || "Not connected"}</div>
          <small>
            <span className="network-dot" />
            {isWrongNetwork ? "Wrong Network" : "Polygon"}
          </small>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <input className="search" placeholder="Search members, groups, transactions..." />
          <div className="top-actions">
            <button className="network-pill" onClick={handleSwitchToPolygon}>
              Polygon
            </button>
            <button
              className="theme-button"
              onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>
          <div className="profile">
            <span className="avatar">JK</span>
            <div>
              <strong>{displayName || "PayLoop Member"}</strong>
              <div className="transaction-meta">Group Admin</div>
            </div>
          </div>
        </header>

        <section className="hero-row">
          <div>
            <h1>Welcome back, John</h1>
            <p>Here is what is happening with your groups today.</p>
          </div>
          <div className="hero-actions">
            <button className="primary">Create Group</button>
            <button className="secondary">Export Report</button>
          </div>
        </section>

        <section className="stats-grid">
          {stats.map(([label, value, change, icon]) => (
            <article className="stat-card" key={label}>
              <div className="metric-icon">{icon}</div>
              <div className="metric-label">{label}</div>
              <div className="metric-value">{value}</div>
              <div className="metric-change">{change}</div>
            </article>
          ))}
        </section>

        <section className="dashboard-grid">
          <article className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Contributions Overview</h2>
              <button className="mini-button">Last 6 Months</button>
            </div>
            <div className="chart" aria-label="Contribution chart">
              {[28, 46, 62, 48, 82, 66].map((height, index) => (
                <div className="bar" style={{ height: `${height}%` }} key={index} />
              ))}
            </div>
          </article>

          <article className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Loan Status Overview</h2>
              <button className="mini-button">All Groups</button>
            </div>
            <div className="donut">
              <div className="donut-inner">
                <span>Total</span>
                <strong>12</strong>
              </div>
            </div>
          </article>

          <article className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Recent Transactions</h2>
              <button className="mini-button">View all</button>
            </div>
            <div className="transactions">
              {transactions.map(([title, meta, amount, time]) => (
                <div className="transaction" key={`${title}-${time}`}>
                  <span className="transaction-icon">+</span>
                  <div>
                    <strong>{title}</strong>
                    <div className="transaction-meta">{meta}</div>
                  </div>
                  <div className={amount.startsWith("+") ? "amount-positive" : "amount-negative"}>
                    {amount}
                    <div className="transaction-meta">{time}</div>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="panel loan-panel">
            <div className="panel-header">
              <h2 className="panel-title">Pending Loan Requests</h2>
              <button className="mini-button">View all</button>
            </div>
            <div className="loan-table">
              <div className="loan-row table-head">
                <span>Applicant</span>
                <span>Amount</span>
                <span>Purpose</span>
                <span>Votes</span>
                <span>Status</span>
                <span>Action</span>
              </div>
              {["Peter Mwangi", "Grace Wanjiku", "James Otieno"].map((name, index) => (
                <div className="loan-row" key={name}>
                  <strong>{name}</strong>
                  <span>KES {index === 0 ? "20,000" : index === 1 ? "15,000" : "30,000"}</span>
                  <span>{index === 0 ? "School Fees" : index === 1 ? "Business Stock" : "Farm Inputs"}</span>
                  <span>{index === 0 ? "15 / 20" : index === 1 ? "10 / 20" : "18 / 20"}</span>
                  <span className="status">Pending</span>
                  <button className="mini-button">Review</button>
                </div>
              ))}
            </div>
          </article>

          <article className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Wallet Access</h2>
              {isConnected ? (
                <button className="mini-button" onClick={() => disconnect()}>
                  Disconnect
                </button>
              ) : null}
            </div>

            <label className="field">
              <span>Display name</span>
              <input
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Jane Member"
              />
            </label>

            <div className="card-actions">
              <button className="primary" disabled={isPending} onClick={handleConnect}>
                {isPending ? "Connecting..." : "Connect MetaMask"}
              </button>
              {isWrongNetwork ? (
                <button className="secondary" onClick={handleSwitchToPolygon}>
                  Switch to Polygon
                </button>
              ) : null}
            </div>

            {address ? <div className="address">PayLoop ID: {address}</div> : null}
            {isWrongNetwork ? <div className="warning">Not connected to Polygon.</div> : null}
            {status ? <p className="status-copy">{status}</p> : null}
          </article>

          <article className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Top Contributors</h2>
              <button className="mini-button">View all</button>
            </div>
            <div className="contributors">
              {contributors.map(([name, amount, progress], index) => (
                <div className="contributor-row" key={name}>
                  <span className="rank">{index + 1}</span>
                  <strong>{name}</strong>
                  <span>{amount}</span>
                  <div className="progress">
                    <span style={{ width: progress }} />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
