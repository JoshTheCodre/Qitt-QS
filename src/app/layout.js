import './globals.css'

export const metadata = {
  title: 'Qitt - Study Material Sharing',
  description: 'Share and access study materials with your peers',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Qitt'
  },
}

export const viewport = {
  themeColor: '#4045ef',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
