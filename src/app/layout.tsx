import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import { Providers } from './providers'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://paperpulse.vercel.app'),
  title: {
    default: 'PaperPulse - Discover Your Next Great Read',
    template: '%s | PaperPulse',
  },
  description: 'Discover your next great read with AI-powered book recommendations, reading lists, and a vibrant book community. Join thousands of readers finding their perfect book.',
  keywords: [
    'books',
    'reading',
    'book recommendations',
    'reading list',
    'book community',
    'book reviews',
    'book discussion',
    'reading goals',
  ],
  authors: [{ name: 'PaperPulse Team' }],
  creator: 'PaperPulse',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://paperpulse.vercel.app',
    siteName: 'PaperPulse',
    title: 'PaperPulse - Discover Your Next Great Read',
    description: 'AI-powered book recommendations and a vibrant reading community',
    images: [
      {
        url: '/logo1.png',
        width: 1200,
        height: 630,
        alt: 'PaperPulse Logo',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PaperPulse - Discover Your Next Great Read',
    description: 'AI-powered book recommendations and reading community',
    images: ['/logo1.png'],
    creator: '@paperpulse',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verification_code_here', // Update after deployment
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
