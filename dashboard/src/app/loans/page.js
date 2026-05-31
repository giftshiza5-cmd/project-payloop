"use client";

import { useState } from "react";
import { isAddress } from "viem";
import { useAccount, useSignMessage, useWriteContract } from "wagmi";
import { DashboardShell } from "../../components/DashboardShell";
import { circleVaultAbi, circleVaultAddress } from "../../lib/contracts";
import { loanHistory } from "../../lib/data";

export default function LoansPage() {
  const [status, setStatus] = useState("");
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { writeContractAsync, isPending } = useWriteContract();
  const hasVault = Boolean(circleVaultAddress && isAddress(circleVaultAddress));

  async function voteOnLoan(loan) {
    setStatus("");
    try {
      const signature = await signMessageAsync({
        message: `PayLoop loan vote\nRequest: ${loan.id}\nBorrower: ${loan.borrower}\nAmount: KES ${loan.amount}\nVoter: ${address || "unknown"}`,
      });

      if (hasVault) {
        await writeContractAsync({
          address: circleVaultAddress,
          abi: circleVaultAbi,
          functionName: "approveWithdrawal",
          args: [BigInt(loan.id)],
        });
      }

      setStatus(
        hasVault
          ? `Vote signed and approval transaction sent. Signature: ${signature.slice(0, 18)}...`
          : `Vote signed. Configure NEXT_PUBLIC_CIRCLE_VAULT_ADDRESS to submit approveWithdrawal. Signature: ${signature.slice(0, 18)}...`,
      );
    } catch (error) {
      setStatus(error.shortMessage || error.message || "Vote was not submitted.");
    }
  }

  return (
    <DashboardShell title="Loans" subtitle="Review all loan requests and vote on pending withdrawals with a MetaMask signature.">
      <section className="panel overflow-hidden">
        <div className="grid gap-3 p-4">
          {loanHistory.map((loan) => (
            <div key={loan.id} className="grid gap-3 rounded-[7px] border border-[var(--border)] p-3 lg:grid-cols-[1fr_0.6fr_0.8fr_0.6fr_auto] lg:items-center">
              <div>
                <strong>{loan.borrower}</strong>
                <p className="text-sm text-slate-400">{loan.purpose}</p>
              </div>
              <span>KES {loan.amount.toLocaleString()}</span>
              <span>{loan.votes} votes</span>
              <span className={`status-pill ${loan.status === "Pending" ? "bg-amber-500/15 text-amber-200" : "bg-teal-500/15 text-teal-200"}`}>
                {loan.status}
              </span>
              <button className="button-primary" disabled={loan.status !== "Pending" || isPending} onClick={() => voteOnLoan(loan)}>
                Vote
              </button>
            </div>
          ))}
        </div>
      </section>
      {status && <p className="mt-4 rounded-[7px] border border-[var(--border)] bg-white/[0.04] p-3 text-sm text-teal-200">{status}</p>}
    </DashboardShell>
  );
}
