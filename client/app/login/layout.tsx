import type { Metadata } from "next";

// The page itself is a client component, so its title lives here.
export const metadata: Metadata = {
  title: "Account sign in — PortfolioHQ",
  description: "Sign in to reach your portfolio report. No brokerage credentials are ever requested.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
