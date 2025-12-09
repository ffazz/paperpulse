import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'PaperPulse — Feel the vibes, find your book',
  description: 'Smart book recommendations based on mood, theme, and energy. Discover Indonesian and international books that match your vibe.',
  keywords: ['books', 'recommendations', 'vibes', 'reading', 'Indonesia', 'international'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
