import type { Metadata } from "next";

// The page itself is a client component, so its title lives here.
export const metadata: Metadata = {
  title: "Request access — PortfolioHQ treasury reporting",
  description: "Get your finance team on to PortfolioHQ with a name, a work email address and a password. No payment details and no procurement cycle.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
