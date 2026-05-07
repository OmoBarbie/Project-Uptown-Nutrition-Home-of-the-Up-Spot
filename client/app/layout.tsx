import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { CartProvider } from './context/CartContext'
import './globals.css'

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://uptownnutritionchicago.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Uptown Nutrition — Fresh Smoothies & Nutrition Bar Chicago',
    template: '%s | Uptown Nutrition',
  },
  description:
    'Chicago\'s premier nutrition bar — fresh protein smoothies, bowls, refreshers and snacks made daily. 10+ years serving Uptown at 4548 N Broadway. Order online for pickup.',
  keywords: [
    'uptown nutrition chicago',
    'protein smoothies chicago',
    'healthy food uptown chicago',
    'nutrition bar chicago',
    'smoothie bar chicago',
    'protein bowls chicago',
    'healthy smoothies 4548 n broadway',
  ],
  authors: [{ name: 'Uptown Nutrition', url: BASE_URL }],
  creator: 'Uptown Nutrition',
  publisher: 'Uptown Nutrition',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'Uptown Nutrition',
    title: 'Uptown Nutrition — Fresh Smoothies & Nutrition Bar Chicago',
    description:
      'Chicago\'s premier nutrition bar — fresh protein smoothies, bowls, refreshers and snacks made daily. 10+ years serving Uptown at 4548 N Broadway.',
    images: [
      {
        url: '/cropped-uptown.jpg',
        width: 1200,
        height: 630,
        alt: 'Uptown Nutrition — Chicago Nutrition Bar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Uptown Nutrition — Fresh Smoothies & Nutrition Bar Chicago',
    description:
      'Chicago\'s premier nutrition bar — fresh protein smoothies, bowls, refreshers and snacks made daily.',
    images: ['/cropped-uptown.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      'index': true,
      'follow': true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${cormorant.variable} antialiased`} suppressHydrationWarning>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
