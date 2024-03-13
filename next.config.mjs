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
}

export default nextConfig
