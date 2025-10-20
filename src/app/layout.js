import './globals.css'

export const metadata = {
  title: 'Qitt-QS',
  description: 'Firebase Auth with Next.js',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
