'use client'

import { ReactNode } from 'react'
import {
  QueryClientProvider,
  QueryClient,
  QueryCache,
} from '@tanstack/react-query'
// import { SessionProvider } from 'next-auth/react'
import { Toaster } from '@/components/ui/toaster'
import { UserProvider } from '@/contexts/user-context'

export function AppProvider({ children }: { children: ReactNode }) {
  const queryCache = new QueryCache({
    onError: (error, query) => {
      console.error(`Error in query ${query.queryKey}:`, error)
    },
  })

  const client = new QueryClient({
    queryCache,
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
