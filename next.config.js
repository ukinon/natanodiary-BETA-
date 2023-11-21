/** @type {import('next').NextConfig} */
module.exports = {
  async headers() {
    return [
      {
        source: "/api/firebase-admin",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache",
          },
        ],
      },
    ];
  },
};
