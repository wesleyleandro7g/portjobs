import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { AppProvider } from '@/providers/app-provider'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'PortJOBS | Encontre seu emprego dos sonhos',
  description: 'Encontre seu emprego dos sonhos',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='pt-br'>
      <AppProvider>
        <body className={`${poppins.className} antialiased`}>{children}</body>
      </AppProvider>
    </html>
  )
}
