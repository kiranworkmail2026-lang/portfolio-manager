import type { Metadata } from "next";

// The page itself is a client component, so its title lives here.
export const metadata: Metadata = {
  title: "Request access — PortfolioHQ adviser reporting",
  description: "Get your practice on to PortfolioHQ with a name, a work email address and a password. No payment details and no per-seat licence.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
