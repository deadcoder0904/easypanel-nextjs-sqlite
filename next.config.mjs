import jiti from 'jiti'
import { fileURLToPath } from 'node:url'

jiti(fileURLToPath(import.meta.url))('./src/app/lib/env')

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // recommended to solve https://github.com/WiseLibs/better-sqlite3/issues/1155
    workerThreads: false,
    cpus: 1,
  },
  output: 'standalone',
  webpack: (config, context) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    return config
  },
}

export default nextConfig
