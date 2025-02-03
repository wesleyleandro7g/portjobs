'use client'

import { ReactNode } from 'react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
// import { SessionProvider } from 'next-auth/react'
import { Toaster } from '@/components/ui/toaster'
import { UserProvider } from '@/contexts/user-context'

export function AppProvider({ children }: { children: ReactNode }) {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: true,
      },
    },
  })

  return (
    <UserProvider>
      <QueryClientProvider client={client}>
        {children}
        <Toaster />
      </QueryClientProvider>
    </UserProvider>
  )
}
