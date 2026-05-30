import "./globals.css";
import { Web3Provider } from "../lib/web3-provider";

export const metadata = {
  title: "PayLoop Dashboard",
  description: "PayLoop savings group dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
