import { useState, useMemo } from "react";
import { MetaMaskSDK } from "@metamask/sdk";
import * as Linking from "expo-linking";
import { polygonChainId, polygonParams } from "../lib/contracts";
import { upsertPayLoopUser } from "../lib/firebase";

export function usePayLoopWallet() {
  const [walletAddress, setWalletAddress] = useState("");
  const [chainId, setChainId] = useState("");
  const [provider, setProvider] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const sdk = useMemo(
    () =>
      new MetaMaskSDK({
        dappMetadata: {
          name: "PayLoop",
          url: "https://payloop.local",
        },
        openDeeplink: (link) => Linking.openURL(link),
        useDeeplink: true,
      }),
    [],
  );

  async function connect(displayName) {
    setIsConnecting(true);

    try {
      const accounts = await sdk.connect();
      const nextProvider = sdk.getProvider();
      const address = accounts?.[0];
      const nextChainId = await nextProvider.request({ method: "eth_chainId" });

      if (!address) {
        throw new Error("MetaMask did not return a wallet address.");
      }

      setProvider(nextProvider);
      setWalletAddress(address);
      setChainId(nextChainId);

      await upsertPayLoopUser({
        walletAddress: address,
        displayName: displayName || "PayLoop Member",
      });

      return address;
    } finally {
      setIsConnecting(false);
    }
  }

  async function switchToPolygon() {
    if (!provider) {
      throw new Error("Connect MetaMask first.");
    }

    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: polygonChainId }],
      });
    } catch (error) {
      if (error.code === 4902) {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [polygonParams],
        });
      } else {
        throw error;
      }
    }

    setChainId(polygonChainId);
  }

  function disconnect() {
    sdk.terminate();
    setProvider(null);
    setWalletAddress("");
    setChainId("");
  }

  return {
    chainId,
    connect,
    disconnect,
    isConnecting,
    isWrongNetwork: Boolean(walletAddress && chainId !== polygonChainId),
    provider,
    switchToPolygon,
    walletAddress,
  };
}
