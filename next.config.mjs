import jiti from 'jiti'
import { fileURLToPath } from 'node:url'

jiti(fileURLToPath(import.meta.url))('./src/app/lib/env')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
}

export default nextConfig
