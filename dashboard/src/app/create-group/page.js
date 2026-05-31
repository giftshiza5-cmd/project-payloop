"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { isAddress } from "viem";
import { DashboardShell } from "../../components/DashboardShell";
import { circleVaultAbi, circleVaultBytecode } from "../../lib/contracts";

function parseAddresses(value) {
  return value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function CreateGroupPage() {
  const [form, setForm] = useState({
    name: "Eldoret Chama",
    rules: "Monthly contribution due by the 5th. Loans require 70% signer approval.",
    contribution: "5000",
    members: "",
    signers: "",
    threshold: "2",
  });
  const [status, setStatus] = useState("");
  const [deployedAddress, setDeployedAddress] = useState("");

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function deployVault() {
    setStatus("");

    if (!window.ethereum) {
      setStatus("MetaMask is required to deploy CircleVault.");
      return;
    }

    if (!circleVaultBytecode) {
      setStatus("Set NEXT_PUBLIC_CIRCLE_VAULT_BYTECODE to deploy CircleVault.sol from the dashboard.");
      return;
    }

    const members = parseAddresses(form.members);
    const signers = parseAddresses(form.signers);
    const invalid = [...members, ...signers].find((address) => !isAddress(address));
    if (invalid) {
      setStatus(`Invalid wallet address: ${invalid}`);
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const factory = new ethers.ContractFactory(circleVaultAbi, circleVaultBytecode, signer);
      setStatus("Deploying CircleVault...");
      const contract = await factory.deploy();
      await contract.waitForDeployment();
      const address = await contract.getAddress();
      setDeployedAddress(address);

      setStatus("Creating the first group in the new vault...");
      const tx = await contract.createGroup(form.name, members, signers, BigInt(form.threshold));
      await tx.wait();
      setStatus(`Group created. Recommended contribution: KES ${Number(form.contribution).toLocaleString()}.`);
    } catch (error) {
      setStatus(error.shortMessage || error.reason || error.message || "Deployment failed.");
    }
  }

  return (
    <DashboardShell title="Create Group" subtitle="Deploy a CircleVault contract, define group rules, and seed the initial members and signers.">
      <section className="grid gap-4 xl:grid-cols-[1fr_0.72fr]">
        <form className="panel grid gap-4 p-4" onSubmit={(event) => event.preventDefault()}>
          <label className="field">
            <span>Group name</span>
            <input value={form.name} onChange={(event) => updateField("name", event.target.value)} />
          </label>
          <label className="field">
            <span>Rules</span>
            <textarea value={form.rules} onChange={(event) => updateField("rules", event.target.value)} />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="field">
              <span>Contribution amount (KES)</span>
              <input type="number" min="1" value={form.contribution} onChange={(event) => updateField("contribution", event.target.value)} />
            </label>
            <label className="field">
              <span>Approval threshold</span>
              <input type="number" min="1" value={form.threshold} onChange={(event) => updateField("threshold", event.target.value)} />
            </label>
          </div>
          <label className="field">
            <span>Member wallet addresses</span>
            <textarea placeholder="0x..., one per line or comma-separated" value={form.members} onChange={(event) => updateField("members", event.target.value)} />
          </label>
          <label className="field">
            <span>Signer wallet addresses</span>
            <textarea placeholder="0x..., one per line or comma-separated" value={form.signers} onChange={(event) => updateField("signers", event.target.value)} />
          </label>
          <button className="button-primary w-max" onClick={deployVault}>Deploy CircleVault.sol</button>
        </form>

        <aside className="panel p-4">
          <p className="stat-label">Deployment Result</p>
          <h2 className="mt-3 text-xl font-black">CircleVault factory</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            The dashboard uses MetaMask through ethers.js. Add compiled bytecode from Hardhat as NEXT_PUBLIC_CIRCLE_VAULT_BYTECODE before deploying.
          </p>
          {deployedAddress && <p className="truncate-address mt-4 rounded-[7px] bg-white/[0.04] p-3">{deployedAddress}</p>}
          {status && <p className="mt-4 text-sm text-teal-200">{status}</p>}
        </aside>
      </section>
    </DashboardShell>
  );
}
