import type { Metadata } from "next";

// The page itself is a client component, so its title lives here.
export const metadata: Metadata = {
  title: "Sign in | PortfolioHQ",
  description: "Sign in to your PortfolioHQ account.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
