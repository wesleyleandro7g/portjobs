import { Aside } from '@/components/system/aside'
import { Header } from '@/components/system/header'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='flex w-full min-h-screen overflow-hidden bg-white'>
      <Aside />
      <div className='w-full h-svh bg-background overflow-hidden'>
        <Header />
        <main className='flex w-full h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] p-4 overflow-auto'>
          {children}
        </main>
      </div>
    </div>
  )
}
