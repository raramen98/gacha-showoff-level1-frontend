import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 상위 폴더(홈 폴더)의 package-lock.json 대신 frontend 폴더를 프로젝트 기준으로 쓴다
  outputFileTracingRoot: path.dirname(fileURLToPath(import.meta.url)),
};

export default nextConfig;
