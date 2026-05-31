"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, WagmiProvider, createConfig, createStorage } from "wagmi";
import { polygonAmoy } from "wagmi/chains";

const queryClient = new QueryClient();

const memoryStore = new Map();

const sessionOnlyStorage = createStorage({
  storage: {
    getItem: (key) => memoryStore.get(key) ?? null,
    setItem: (key, value) => memoryStore.set(key, value),
    removeItem: (key) => memoryStore.delete(key),
  },
});

const config = createConfig({
  chains: [polygonAmoy],
  storage: sessionOnlyStorage,
  transports: {
    [polygonAmoy.id]: http(process.env.NEXT_PUBLIC_POLYGON_AMOY_RPC_URL),
  },
});

export function Web3Provider({ children }) {
  return (
    <WagmiProvider config={config} reconnectOnMount={false}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
