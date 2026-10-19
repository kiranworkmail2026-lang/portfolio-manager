/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // c22 — the scaffold redirect flips from permanent to temporary.
      // Version A: 301. Version B: 302.
      //
      // statusCode is used rather than `permanent`, because `permanent: true`
      // emits 308 and `false` emits 307, and a crawler reports those as
      // different things from 301 and 302.
      { source: "/lab/chi", destination: "/lab/zeta", statusCode: 302 },

      // c04 — a page that returned 200 at crawl A now permanently redirects.
      { source: "/lab/gamma", destination: "/lab/delta", statusCode: 301 },
    ];
  },
};
module.exports = nextConfig;
