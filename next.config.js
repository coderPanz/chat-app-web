/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    GITHUB_ID: process.env.GITHUB_ID,
    GITHUB_SECRET: process.env.GITHUB_SECRET,
    SECRET: process.env.SECRET,
    ZEGO_APP_ID: process.env.ZEGO_APP_ID,
    ZEGO_SERVER: process.env.ZEGO_SERVER
  },
  // 允许你的应用可以加载来自指定域名的图片
  images: {
    domains: ['avatars.githubusercontent.com', 'localhost', '121.37.175.16'],
  },
}
module.exports = nextConfig
