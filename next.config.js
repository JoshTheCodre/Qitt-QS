/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow cross-origin requests from specific IP during development
  allowedDevOrigins: ['http://192.168.1.180:3000', '192.168.1.180:3000'],
  // Transpile react-pdf and pdfjs-dist packages
  transpilePackages: ["react-pdf", "pdfjs-dist"],
}

module.exports = nextConfig
