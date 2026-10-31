import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  webpack(config, { isServer }) {
    if (isServer) {
      // Workers cannot run Firestore's Node/gRPC transport.
      config.resolve.alias["@firebase/firestore$"] = path.join(
        root,
        "node_modules/@firebase/firestore/dist/index.esm2017.js"
      );
    }
    return config;
  },
};

export default nextConfig;
