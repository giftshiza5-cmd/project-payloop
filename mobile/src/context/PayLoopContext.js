import { createContext, useContext } from "react";

export const PayLoopContext = createContext(null);

export function usePayLoopApp() {
  const context = useContext(PayLoopContext);

  if (!context) {
    throw new Error("PayLoop context is missing");
  }

  return context;
}
