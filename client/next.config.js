/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Crawl-diff experiment scaffold: a permanent redirect that already
      // exists at crawl A, so change c22 can flip it to temporary in B.
      //
      // statusCode is used rather than `permanent`, because `permanent: true`
      // emits 308 and `false` emits 307. The test calls for 301 and 302, and a
      // crawler reports those as different things.
      //
      // Version A: 301. Version B: 302.
      { source: "/lab/chi", destination: "/lab/zeta", statusCode: 301 },
    ];
  },
};
module.exports = nextConfig;
