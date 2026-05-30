"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, WagmiProvider, createConfig, createStorage } from "wagmi";
import { polygon } from "wagmi/chains";

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
  chains: [polygon],
  storage: sessionOnlyStorage,
  transports: {
    [polygon.id]: http(),
  },
});

export function Web3Provider({ children }) {
  return (
    <WagmiProvider config={config} reconnectOnMount={false}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
