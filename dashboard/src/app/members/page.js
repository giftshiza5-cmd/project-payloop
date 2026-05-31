"use client";

import { useMemo, useState } from "react";
import { isAddress } from "viem";
import { useWriteContract } from "wagmi";
import { DashboardShell } from "../../components/DashboardShell";
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
    setStatus("Member removed from the dashboard view. CircleVault.sol does not expose an on-chain removeMember function yet.");
  }

  return (
    <DashboardShell title="Members Management" subtitle="Add members by wallet address, mark signers, and keep the group roster current.">
      <section className="grid gap-4 xl:grid-cols-[0.72fr_1fr]">
        <article className="panel grid gap-4 p-4">
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
            <select value={role} onChange={(event) => setRole(event.target.value)}>
              <option>Member</option>
              <option>Signer</option>
              <option>Treasurer</option>
            </select>
          </label>
          <button className="button-primary w-max" disabled={isPending} onClick={addMember}>
            {isPending ? "Sending..." : "Add Member"}
          </button>
          {status && <p className="text-sm text-teal-200">{status}</p>}
        </article>

        <article className="panel overflow-hidden">
          <div className="grid gap-3 p-4">
            {rows.map((member) => (
              <div key={member.address} className="grid gap-3 rounded-[7px] border border-[var(--border)] p-3 md:grid-cols-[1fr_1fr_auto] md:items-center">
                <div>
                  <strong>{member.name}</strong>
                  <p className="text-sm text-slate-400">{member.role} · {member.contribution}</p>
                </div>
                <p className="truncate-address text-slate-300">{member.address}</p>
                <button className="button-secondary" onClick={() => removeMember(member.address)}>Remove</button>
              </div>
            ))}
          </div>
        </article>
      </section>
    </DashboardShell>
  );
}
