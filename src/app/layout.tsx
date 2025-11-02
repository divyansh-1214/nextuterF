import type { Metadata } from 'next'
import './globals.css'

// Initialize fonts
export const metadata: Metadata = {
  title: 'Nexture',
  description: 'platfrom from where you can get the job',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body >
        {children}
      </body>
    </html>
  )
}
