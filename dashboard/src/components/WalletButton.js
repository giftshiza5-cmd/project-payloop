"use client";

import { useMemo, useState } from "react";
import { useAccount, useChainId, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { polygonAmoy } from "wagmi/chains";
import { upsertPayLoopUser } from "../lib/firebase";

const amoyParams = {
  chainId: "0x13882",
  chainName: "Polygon Amoy",
  nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 },
  rpcUrls: ["https://rpc-amoy.polygon.technology"],
  blockExplorerUrls: ["https://amoy.polygonscan.com"],
};

export function WalletButton({ compact = false }) {
  const [status, setStatus] = useState("");
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connectAsync, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const isWrongNetwork = useMemo(() => isConnected && chainId !== polygonAmoy.id, [chainId, isConnected]);
  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  async function connectWallet() {
    setStatus("");
    try {
      const result = await connectAsync({ connector: injected() });
      const connectedAddress = result.accounts?.[0];
      if (connectedAddress) {
        await upsertPayLoopUser({ walletAddress: connectedAddress, displayName: "PayLoop Admin" });
      }
    } catch (error) {
      setStatus(error.shortMessage || error.message || "MetaMask connection failed.");
    }
  }

  async function switchNetwork() {
    if (!window.ethereum) {
      setStatus("MetaMask is not available in this browser.");
      return;
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: amoyParams.chainId }],
      });
    } catch (error) {
      if (error.code === 4902) {
        await window.ethereum.request({ method: "wallet_addEthereumChain", params: [amoyParams] });
        return;
      }
      setStatus(error.message || "Could not switch to Polygon Amoy.");
    }
  }

  if (isConnected) {
    return (
      <div className={compact ? "flex items-center gap-2" : "grid gap-2"}>
        <button className="button-secondary" onClick={isWrongNetwork ? switchNetwork : () => disconnect()}>
          {isWrongNetwork ? "Switch to Amoy" : shortAddress}
        </button>
        {!compact && <span className="truncate-address text-slate-400">{address}</span>}
        {status && <span className="text-sm text-amber-300">{status}</span>}
      </div>
    );
  }

  return (
    <div className={compact ? "" : "grid gap-2"}>
      <button className="button-primary" disabled={isPending} onClick={connectWallet}>
        {isPending ? "Connecting..." : "Connect MetaMask"}
      </button>
      {status && <span className="text-sm text-amber-300">{status}</span>}
    </div>
  );
}
