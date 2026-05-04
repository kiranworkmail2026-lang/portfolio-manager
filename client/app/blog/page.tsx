import Link from "next/link";

export const metadata = {
  title: "Why Build a Stock Portfolio? | Portfolio Manager",
  description:
    "Learn why owning stocks and tracking your portfolio is one of the most powerful ways to build long-term wealth.",
};

export default function BlogPage() {
  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-10">
        <p className="text-sm uppercase tracking-wide text-indigo-600 font-semibold">
          Investing 101
        </p>
        <h1 className="text-4xl font-bold mt-2 leading-tight">
          Why Building a Stock Portfolio Matters
        </h1>
        <p className="text-gray-600 mt-3 text-lg">
          A short, honest guide to the benefits of owning stocks — and why
          tracking them is half the battle.
        </p>
      </header>

      <section className="prose prose-lg max-w-none space-y-8 text-gray-800">
        <div>
          <h2 className="text-2xl font-bold mt-0">1. Compounding works — but only if you let it</h2>
          <p>
            Investing $500 per month into a broad market index averaging 8%
            annual returns turns into roughly <strong>$745,000 in 30 years</strong>.
            Of that, only $180,000 is what you actually contributed — the rest
            is compounding doing the heavy lifting. Time in the market beats
            timing the market, almost every time.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold">2. Stocks beat inflation. Cash doesn&apos;t.</h2>
          <p>
            A dollar in a savings account today loses purchasing power every
            year. Equities, historically, have outpaced inflation by 6-7% per
            year. If you&apos;re holding cash for the long-term, you&apos;re losing
            ground. Owning a slice of productive companies is one of the few
            reliable hedges against a depreciating currency.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold">3. You become an owner, not just a saver</h2>
          <p>
            Buying a share of Apple, Microsoft, or any public company makes you
            a part-owner of that business. You participate in their earnings,
            their dividends, and their long-term growth. It&apos;s the most
            accessible form of capital ownership ever built — open to anyone
            with a brokerage account and a few dollars.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold">4. Diversification reduces risk for free</h2>
          <p>
            One of the few &ldquo;free lunches&rdquo; in finance: spreading your money
            across many stocks, sectors, and asset types lowers risk without
            lowering expected return. A concentrated bet on one company can
            wipe you out. A diversified portfolio of 50+ holdings rarely does.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold">5. Liquidity and flexibility</h2>
          <p>
            Unlike real estate, gold, or private businesses, stocks can be
            bought or sold in seconds. You can rebalance, take profits,
            harvest tax losses, or liquidate for an emergency — all from your
            phone. That flexibility has real economic value.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold">6. Tracking is half the battle</h2>
          <p>
            Most retail investors don&apos;t know their actual return. They guess.
            They remember the wins and forget the losses. A clear,
            up-to-date view of your holdings — sectors, exposures, P&amp;L —
            turns vague optimism into informed decisions:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Concentration risk</strong> — is 60% of your money in one sector?</li>
            <li><strong>Cost basis</strong> — what did you actually pay, and where do you stand?</li>
            <li><strong>Sector drift</strong> — has your &ldquo;balanced&rdquo; portfolio quietly become a tech bet?</li>
            <li><strong>Realized vs. unrealized P&amp;L</strong> — what&apos;s real, what&apos;s on paper?</li>
          </ul>
          <p className="mt-3">
            You can&apos;t improve what you can&apos;t see. That&apos;s exactly why this
            tool exists.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold">7. The cost of doing nothing</h2>
          <p>
            Sitting on the sidelines feels safe. It isn&apos;t. Inflation alone
            costs you 3-4% of purchasing power per year. Skipping the market
            for a decade is a guaranteed loss in real terms — without the
            paperwork.
          </p>
        </div>
      </section>

      <div className="mt-12 bg-indigo-50 border border-indigo-100 rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold text-gray-900">
          Ready to see your portfolio clearly?
        </h3>
        <p className="text-gray-700 mt-2">
          Upload your holdings and get charts, P&amp;L, and sector breakdowns in seconds.
        </p>
        <div className="mt-5 flex gap-3 justify-center">
          <Link
            href="/register"
            className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700"
          >
            Create free account
          </Link>
          <Link
            href="/login"
            className="bg-white text-indigo-700 px-5 py-2 rounded border border-indigo-200 hover:bg-indigo-100"
          >
            Login
          </Link>
        </div>
      </div>

      <footer className="mt-10 text-xs text-gray-500 text-center">
        This article is for educational purposes only. Nothing here is
        financial advice. Past performance does not guarantee future results.
      </footer>
    </article>
  );
}
