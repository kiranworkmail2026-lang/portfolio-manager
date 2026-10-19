import type { Metadata } from "next";

// The page itself is a client component, so its title lives here.
export const metadata: Metadata = {
  title: "Create your account — PortfolioHQ",
  description: "Create a PortfolioHQ account with a name, an email address and a password. No payment details are required.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
