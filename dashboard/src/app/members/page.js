"use client";

import { useMemo, useState } from "react";
import { isAddress } from "viem";
import { useWriteContract } from "wagmi";
import { DashboardShell } from "../../components/DashboardShell";
import { AdvancedTable } from "../../components/AdvancedTable";
import { circleVaultAbi, circleVaultAddress } from "../../lib/contracts";
import { members as seedMembers } from "../../lib/data";

export default function MembersPage() {
  const [rows, setRows] = useState(seedMembers);
  const [wallet, setWallet] = useState("");
  const [role, setRole] = useState("Member");
  const [groupId, setGroupId] = useState("0");
  const [status, setStatus] = useState("");
  const { writeContractAsync, isPending } = useWriteContract();

  const canWriteOnChain = useMemo(() => Boolean(circleVaultAddress && isAddress(circleVaultAddress)), []);

  async function addMember() {
    setStatus("");
    if (!isAddress(wallet)) {
      setStatus("Enter a valid wallet address.");
      return;
    }

    try {
      if (canWriteOnChain) {
        await writeContractAsync({
          address: circleVaultAddress,
          abi: circleVaultAbi,
          functionName: "addMember",
          args: [BigInt(groupId), wallet, role !== "Member"],
        });
      }

      setRows((current) => [
        ...current,
        { name: "New member", role, address: wallet, contribution: "KES 0" },
      ]);
      setWallet("");
      setStatus(canWriteOnChain ? "Member transaction sent with MetaMask." : "Member added locally. Configure NEXT_PUBLIC_CIRCLE_VAULT_ADDRESS for on-chain writes.");
    } catch (error) {
      setStatus(error.shortMessage || error.message || "Could not add member.");
    }
  }

  function removeMember(address) {
    setRows((current) => current.filter((member) => member.address !== address));
    setStatus("Member removed from dashboard view.");
  }

  const headers = [
    { key: "name", label: "Name" },
    { key: "role", label: "Role" },
    { key: "contribution", label: "Contribution" },
    { key: "address", label: "Wallet Address" },
    { key: "actions", label: "Actions" },
  ];

  const tableData = useMemo(() => {
    return rows.map((member) => ({
      ...member,
      actions: (
        <button 
          className="button-secondary h-7 px-2.5 text-[10px] font-black text-rose-600 border-rose-100 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:border-rose-200 dark:border-slate-800 transition-all"
          onClick={() => removeMember(member.address)}
          type="button"
        >
          Remove
        </button>
      ),
    }));
  }, [rows]);

  return (
    <DashboardShell title="Members Management" subtitle="Add members by wallet address, mark signers, and keep the group roster current.">
      <section className="grid gap-6">
        <article className="panel glass-panel grid gap-4 p-5 max-w-xl border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-black text-slate-800 dark:text-slate-100">Add New Chama Member</h2>
          <label className="field">
            <span>Group ID</span>
            <input value={groupId} onChange={(event) => setGroupId(event.target.value)} />
          </label>
          <label className="field">
            <span>Wallet address</span>
            <input placeholder="0x..." value={wallet} onChange={(event) => setWallet(event.target.value)} />
          </label>
          <label className="field">
            <span>Role</span>
            <select value={role} onChange={(event) => setRole(event.target.value)} className="dark:bg-slate-900 border-[var(--border)] dark:border-slate-800">
              <option>Member</option>
              <option>Signer</option>
              <option>Treasurer</option>
            </select>
          </label>
          <button className="button-primary w-max" disabled={isPending} onClick={addMember}>
            {isPending ? "Sending..." : "Add Member"}
          </button>
          {status && (
            <p className="text-xs font-black text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30 p-2.5 rounded-md border border-violet-100 dark:border-violet-900/30 mt-2">
              {status}
            </p>
          )}
        </article>

        <article className="grid gap-3">
          <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-1">Roster & Permissions</h2>
          <AdvancedTable
            title="PayLoop Chama Members"
            headers={headers}
            data={tableData}
            filterColumn="role"
          />
        </article>
      </section>
    </DashboardShell>
  );
}
