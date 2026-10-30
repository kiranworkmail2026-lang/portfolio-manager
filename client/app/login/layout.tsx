import type { Metadata } from "next";

// The page itself is a client component, so its title lives here.
export const metadata: Metadata = {
  title: "Sign in — PortfolioHQ adviser reporting",
  description: "Sign in to reach your client holdings statements. Platform and custodian credentials are never requested.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
