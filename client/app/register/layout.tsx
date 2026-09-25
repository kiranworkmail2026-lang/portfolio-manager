import type { Metadata } from "next";

// The page itself is a client component, so its title lives here.
export const metadata: Metadata = {
  title: "Open an account | PortfolioHQ",
  description: "Open a PortfolioHQ account with a name, an email address and a password.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
